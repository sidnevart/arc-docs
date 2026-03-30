---
id: preset-environment
title: Среда пресетов
---

# Среда пресетов

ARC движется к жёсткой композиционной модели пресетов, где не все пресеты равноправны.

Классы:

- `infrastructure`
- `domain`
- `session_overlay`

Канонический порядок применения:

1. ARC base
2. provider adapter
3. infrastructure presets
4. selected domain preset
5. project overlays
6. session overlays
7. explicit user instruction

Первый implementation slice уже добавил environment-aware manifest fields и parser validation для:

- `short_description`
- `preset_type`
- `permissions.runtime`
- `hooks`
- `commands`
- `memory_scopes`
- `budget_profile`

`short_description` теперь нужен как creator-authored user-facing guidance layer: именно из него desktop и другие surfaces могут показывать короткое объяснение, что агент умеет лучше всего и как с ним работать.

Repo-local validation for this track now also lives under `.codex/skills/preset-environment-validator/`.

RFC source in repo: `rfcs/preset-environment-composition.md`

Install-time composition checks are now part of the same track:

- command collisions against already installed presets
- hook collisions against already installed presets
- non-shared memory namespace collisions
- forbidden non-infrastructure attempts to claim `system` scope or elevated runtime execution permissions

The next slice is now real in code too:

- `arc preset preview` returns a deterministic `resolution` object with layer order, hook registry, command registry, memory ownership, effective runtime ceiling, and effective budget profile
- `arc preset install` now materializes `environment_resolution.json` and `environment_resolution.md` next to the install report under `.arc/presets/reports/`
- non-infrastructure presets are now rejected even earlier if they declare `required_modules`, `system` memory scope, or runtime permissions above the allowed non-infrastructure ceiling

The next runtime-facing slice is also now wired into `task plan|run`:

- every run now materializes `environment_resolution.json` and `environment_resolution.md` inside the run directory
- every run now also materializes `memory_policy.json` and `memory_policy.md`
- ARC can execute declared preset hooks from `.arc/hooks/` for supported lifecycles:
  - `before_context_assembly`
  - `after_context_assembly`
  - `before_persist_memory`
  - `before_run`
  - `after_run`
- hook execution is now audited into `hook_execution.json` and `hook_execution.md`
- sandboxed hook runs now also emit `hook_sandbox_profile.json` and `hook_sandbox_profile.md`
- risky hooks now block execution until approval instead of silently running

Current implementation note:

- read-only and preview-only hooks still run as bounded local subprocesses rooted at the workspace
- `sandboxed_exec` hooks now run under a stricter bounded sandbox profile:
  - dedicated working directory under the run artifacts
  - sanitized environment instead of inheriting the full parent shell
  - explicit `ARC_HOOK_SANDBOX_DIR`
  - `.sh` / `.bash` scripts only
  - a separate sandbox profile artifact that records:
    - working directory
    - whether parent env was inherited
    - which ARC env keys were exposed
    - allowed memory scopes
    - the mediated memory write path
- hook-side memory writes now have a mediated path:
  - hooks can call `arc hook memory add`
  - the command reads `ARC_ALLOWED_MEMORY_SCOPES`
  - writes are validated against the active memory policy
  - successful writes append `hook_memory_events.jsonl` under the run directory
- missing declared hooks now have a clearer policy:
  - infrastructure/domain layers fail as `missing_required`
  - project/session overlay hooks soft-skip as `missing_skipped`
- ARC-managed memory writes now use canonical `runs/<run-id>` scopes and are checked against the resolved allowlist before persistence
- hooks receive `ARC_ALLOWED_MEMORY_SCOPES` so the current runtime memory policy is explicit even before stricter sandboxing lands
- true OS-level isolation for `sandboxed_exec` still remains a later slice, but the runner now enforces a real bounded sandbox profile instead of treating `sandboxed_exec` as the same execution mode as plain local hooks
