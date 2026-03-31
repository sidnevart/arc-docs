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

The next preset-platform slice is now live too:

- ARC now has a canonical preset-core draft store under `.arc/presets/platform/<preset-id>/`
- `arc preset draft init` generates a stable `profile.json`, `brief.json`, `brief.md`, `manifest.json`, `evaluation.json`, and `evaluation.md`
- `arc preset draft update` now mutates the draft safely and rebuilds the derived brief/manifest/evaluation artifacts instead of expecting operators to hand-edit the generated bundle
- `arc preset draft interview start|answer|show` now gives the first guided authoring path over the same draft store, with project-local interview sessions under `.arc/presets/interviews/`
- `arc preset draft interview remediate` now applies deterministic fixes for known contradictions instead of forcing operators to hand-edit workflow and quality-gate lists for common cases
- draft update/interview answers now also normalize common aliases instead of treating every comma-separated token literally:
  - `simulation` -> `simulate`
  - `validated` / `validation-ready` -> `validation_ready`
  - `brief` / `manifest` -> `preset_brief` / `preset_manifest`
  - workflow order is now preserved instead of being alphabetically reordered
- `arc preset draft simulate` now writes artifact-backed simulation reports under the draft root, so authors can inspect scenario results before later `tested/published` gates exist
- `arc preset draft mark-tested` now requires a passing simulation report before the draft can move from `draft` to `tested`
- `arc preset draft export` now requires a `tested` draft and a passing simulation report, then writes provider-specific installable bundles under `.arc/presets/exports/<preset-id>-<provider>/`
- `arc preset draft publish` now requires a `tested` draft, revalidates exportable provider bundles, writes `publish.json` plus `publish.md`, and only then moves the draft into `published`
- `arc preset draft publish` now also writes `publish_envelope.json` plus `publish_envelope.md`, recording source metadata, simulation status, manifest-validation status, and SHA-256 fingerprints for the exported provider bundle files
- `arc preset draft catalog-sync` now requires a `published` draft and copies the provider bundles into any operator-chosen local catalog root, validates the synced `manifest.yaml` files there, and writes `catalog_sync.json` plus `catalog_sync.md`
- `arc preset draft install` now requires a `published` draft, regenerates the export bundles if needed, picks the provider-specific bundle that matches the project's default provider when possible, and then goes through the normal install/conflict-report path
- `arc preset draft show|validate|list` expose that canonical draft state through the CLI
- validation now treats `PresetProfile`, `PresetBrief`, `PresetManifest`, and `PresetEvaluationPack` as one draft unit, so publish/install-oriented preset work has a stable local substrate before Preset Studio and simulation UI land

The export step is now the first real bridge from Preset Studio artifacts into the existing preset catalog/install model:

- export writes `manifest.yaml`, `README.md`, `payload/docs/overview.md`, and provider-specific `payload/CODEX.md` / `payload/CLAUDE.md`
- export also carries sidecar evidence files like `profile.json`, `brief.json`, `evaluation.json`, and `simulation.json`
- the generated bundle root can already be validated with `arc preset validate --root .arc/presets/exports <bundle-id>`
- publish is now the first explicit operator gate after export:
  - it regenerates the provider bundles
  - validates the generated manifests
  - writes `publish.json` and `publish.md`
  - writes `publish_envelope.json` and `publish_envelope.md`
  - records source/trust metadata plus file fingerprints for later review or catalog sync
  - updates both `profile.status` and `evaluation_pack.status` to `published`
- install from draft is now also real instead of conceptual:
  - it reuses `.arc/presets/exports` as the catalog root
  - it still goes through the same install preview/conflict/environment-report machinery as ordinary preset installs
  - provider selection prefers the current project's `default_provider`
- local catalog publishing now also has a concrete v1 meaning:
  - `catalog-sync` can mirror a `published` draft into any operator-specified local catalog root
  - the synced bundles stay validate-able through `arc preset validate --root <catalog-root> <bundle-id>`
  - ARC writes `catalog_sync.{json,md}` back into the draft root so local catalog movement is artifact-backed too

The official preset catalog now also ships reusable provider-specific variants of the three core ARC agents:

- `study-codex`
- `study-claude`
- `work-codex`
- `work-claude`
- `hero-codex`
- `hero-claude`

These live alongside the built-in generic `study/work/hero` presets so operators can install the same agent semantics into other projects as explicit Codex/Claude preset payloads instead of depending only on ARC's built-in mode cards.

Current implementation note:

- the first interview layer is intentionally CLI-first, not UI-first
- modes now exist for `quick`, `deep`, and `import-refine`
- every interview answer mutates the draft through the same safe update path and then persists the next question plus a simple confidence/progress score
- interview sessions now also surface `contradictions` plus explicit `readiness`:
  - `draft_valid`
  - `simulation_ready`
  - `save_ready`
  - `blockers`
- interview sessions now also surface `suggested_fixes`:
  - deterministic fixes can be auto-applied through `interview remediate`
  - ambiguous conflicts still stay operator-driven and are shown as manual suggestions
- stronger normalization now happens below the interview layer too:
  - workflow remains ordered
  - outputs and quality gates are canonicalized to ARC-friendly ids
  - free-text fields like non-goals do not get over-normalized into generic tokens
- the draft bundle remains the canonical stored artifact; interview sessions are a guided authoring layer on top of it, not a competing source of truth
