---
id: context-tool
title: Context Tool
---

# Context Tool

ARC уже собирает context packs, но теперь в репозитории появился и первый standalone-first boundary для `ctx`.

Что уже реализовано:

- human-authored `.context-tool.yaml`
- `ctx init`
- `ctx doctor`
- `ctx index build`
- `ctx index refresh`
- `ctx memory add`
- `ctx memory list`
- `ctx memory search`
- `ctx memory status`
- `ctx memory compact`
- `ctx assemble`
- `ctx bench`
- отдельный workspace `.context/`
- отдельные index artifacts под `.context/index/`
- отдельные durable memory artifacts под `.context/memory/`
- отдельные assembly artifacts под `.context/artifacts/assemble/<timestamp>/`
- benchmark artifacts под `.context/benchmarks/<timestamp>/`
- managed config at repo root via `.context-tool.yaml`

Текущий первый slice намеренно переиспользует существующие движки `indexer` и формат `contextpack.Pack`, но уже разводит storage и CLI surface с ARC.

Цель полного направления:

- индексировать проект
- собирать бюджетированный context bundle
- хранить provenance и metrics
- сравнивать `baseline` vs `optimized`

Текущий CLI surface:

- `ctx init`
- `ctx doctor`
- `ctx index build`
- `ctx memory add`
- `ctx memory list`
- `ctx memory search`
- `ctx memory status`
- `ctx memory compact`
- `ctx assemble`
- `ctx bench`

Managed config теперь тоже часть v1 surface:

- `ctx init` scaffolds `.context-tool.yaml`
- `ctx doctor` reports the resolved human config and its path
- `ctx index build|refresh` respect include/exclude/docs path filters from `.context-tool.yaml`
- `ctx assemble` and `ctx bench` now persist `config_path` and `human_config` inside metadata/results

Current `.context-tool.yaml` contract:

- `project_name`
- `include_paths`
- `exclude_paths`
- `docs_paths`
- `memory_paths`
- `language_hints`
- `metrics_enabled`

The parser is intentionally small and standard-library-only:

- JSON-compatible scalars still work
- list values can be written in block form with `- item`
- unsupported keys fail fast instead of being silently ignored

Первый `.context/memory` slice теперь уже usable:

- `ctx memory add --kind decision --tags ctx,retrieval "..."` пишет human-authored entries в `.context/memory/entries.json`
- `ctx memory list` читает тот же storage
- `ctx memory search "preset environment"` даёт deterministic retrieval over ids, tags, status fields, and summaries
- `ctx memory status` now returns counts plus the canonical artifact paths for entries/active/archive/questions views
- `ctx memory compact` now marks stale active entries and syncs archive markdown without touching still-relevant recent memory
- tool дополнительно синхронизирует readable artifacts:
  - `.context/memory/MEMORY_ACTIVE.md`
  - `.context/memory/MEMORY_ARCHIVE.md`
  - `.context/memory/OPEN_QUESTIONS.md`

`ctx doctor` now checks the standalone workspace itself:

- `.context-tool.yaml`
- `.context/config.json`
- required workspace directories
- memory entry readability
- index-bundle presence
- self-indexing regressions where `.context/` accidentally leaks back into the machine index

Это важно потому, что `ctx` теперь хранит не только machine-generated indexes, но и свой отдельный durable human-authored memory layer, не смешивая его с ARC `.arc/memory`.

It also means standalone configuration now has an explicit human-authored home outside `.context/config.json`: machine-managed workspace metadata stays under `.context/`, while operator intent lives in `.context-tool.yaml`.

Первый bridge в ARC тоже уже есть:

- `arc task plan|run` теперь строит и classic ARC pack, и `ctx` pack
- затем ARC детерминированно выбирает provider-facing `context_pack`
- текущий selection rule уже двухфакторный:
  - quality-aware metadata считается для `ctx`
  - ARC сравнивает token size и простую pack-quality heuristic
  - на практике сейчас это всё ещё mostly token-driven выбор, а не полноценный relevance ranker
- обе версии всё равно сохраняются как артефакты:
  - `arc_context_pack.{md,json}`
  - `ctx_context_pack.{md,json}`
  - `ctx_context_metadata.json`
  - `context_selection.json`
- итоговый `run.json` тоже фиксирует выбор через:
  - `metadata.context_source`
  - `metadata.context_arc_tokens`
  - `metadata.context_ctx_tokens`
  - `metadata.context_token_reduction`
  - `metadata.context_arc_quality`
  - `metadata.context_ctx_quality`
  - `metadata.context_selection_reason`

`ctx_context_metadata.json` теперь тоже пишет retrieval signals:

- `quality_score`
- `term_coverage`
- `matched_sections`
- `memory_match_count`
- `matched_memory_ids`
- `memory_boost`
- `memory_trust_bonus`
- `memory_recency_bonus`
- `section_provenance`
- `accounting`
- `reuse`

The new provenance/accounting layer makes retrieval inspectable instead of only heuristic:

- every assembled section now carries section-level provenance in metadata
- provenance records:
  - `title`
  - `source`
  - `source_paths`
  - `candidate_count`
  - `selected_count`
  - truncation flag and optional notes
- aggregate accounting now records:
  - total candidates vs selected entries
  - docs candidates vs selected
  - code file candidates vs selected
  - symbol candidates vs selected
  - recent-change candidates vs selected
  - memory candidates vs selected

`ctx bench` now also compares baseline vs optimized on candidate-vs-final density, not only tokens and quality:

- `baseline_candidate_total`
- `baseline_selected_total`
- `optimized_candidate_total`
- `optimized_selected_total`
- `reuse_index_source`
- `reuse_memory_source`
- `reuse_artifact_count`

ARC run metadata now mirrors the first high-level totals too:

- `context_ctx_candidate_total`
- `context_ctx_selected_total`
- `context_ctx_index_source`
- `context_ctx_reused_artifact_count`

The next reuse-evidence slice landed too:

- `ctx assemble` metadata now makes reuse explicit instead of leaving it implied behind `built_index=false`
- the first reuse contract is intentionally small and audit-friendly:
  - `reuse.index_source`
  - `reuse.memory_source`
  - `reuse.reused_artifact_count`
  - `reuse.index_bundle_path`
  - `reuse.memory_entries_path`
- current values distinguish:
  - `reused_existing`
  - `rebuilt`
  - `empty_workspace`
- this means a later tuning pass can answer two different questions separately:
  - what was selected into the pack
  - what did not need to be recomputed first

То есть `ctx` уже не просто sidecar для наблюдения: ARC действительно может использовать его pack как основной provider-facing context, но сохраняет обе версии для аудита и последующего улучшения retrieval quality.

Memory теперь уже влияет на assembled pack напрямую:

- `ctx assemble` читает `.context/memory/entries.json`
- matching entries попадают в секцию `Relevant Memory`
- summary of current memory попадает в `Memory Summary`
- эти секции участвуют в retrieval-quality metadata (`matched_sections`, `quality_score`, `memory_match_count`, `memory_boost`)

Следующий quality slice уже landed поверх этого:

- `ctx` selection теперь не только token-aware, но и memory-aware
- ARC run metadata теперь зеркалит:
  - `context_ctx_memory_matches`
  - `context_ctx_memory_boost`
- и теперь ещё:
  - `context_ctx_memory_trust_bonus`
  - `context_ctx_memory_recency_bonus`
- это даёт selection layer явный сигнал, что `ctx` pack содержит durable human-authored context, а не только меньше токенов

Следующий ranking slice landed тоже:

- memory ranking теперь различает trust и recency
- recent verified human decisions усиливают `ctx` pack сильнее, чем старые/слабые notes
- `ctx bench` now records:
  - `optimized_memory_trust_bonus`
  - `optimized_memory_recency_bonus`

Следующий retrieval slice landed тоже:

- docs теперь ранжируются не только по path match, но и сильнее по title/headings coverage
- code surfaces теперь сильнее ранжируются по basename, symbol name, path coverage и multi-term coverage
- это даёт `ctx` quality signal не только за счёт memory bonuses, но и за счёт более релевантного отбора docs/code surfaces в optimized pack

`ctx bench` сейчас сравнивает:

- `baseline` — более широкий noisy pack
- `optimized` — текущий query-driven pack

и пишет:

- `baseline_pack.{json,md}`
- `optimized_pack.{json,md}`
- `summary.json`

Следующие шаги:

- ввести richer retrieval/metrics поверх первого pack builder, чтобы выбор был не только “меньше токенов”, но и “лучше покрытие задачи”
- усилить retrieval ranking дальше так, чтобы quality scores между classic ARC pack и `ctx` расходились по релевантности не только на уровне heuristic title/name coverage, но и на более содержательном doc/code matching
- решить, достаточно ли текущего memory-aware bonus как первого шага, или `.context/memory` надо углублять в typed weighting / recency / trust before more aggressive provider-facing selection
- углубить orchestrator integration дальше от current selection heuristic к более quality-aware provider-facing assembly

RFC source in repo: `rfcs/context-management-tool.md`
