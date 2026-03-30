---
id: provider-budgeting
title: Budget Layer
---

# Budget Layer

ARC не должен считать provider calls бесплатными. Первый foundation slice этого слоя уже появился в runtime.

Что уже реализовано:

- `internal/budget` с базовыми схемами policy, assessment и usage event
- `--budget-mode` в `arc task plan|run`
- request classification перед provider execution
- `.arc/budget/policy.json`
- optional `.arc/budget/project_override.json`
- `.arc/budget/usage_events.jsonl`
- per-run artifact `budget_assessment.json`
- per-run artifact `budget_usage_event.json`
- per-run artifact `budget_policy_resolution.json`
- per-run artifact `prompt_minimization.json`

Текущий слой умеет:

- различать `no_provider`, `local_first`, `cheap_provider_ok`, `premium_required`, `premium_high_risk`
- записывать usage ledger
- блокировать `premium_high_risk` в `ultra_safe` и `emergency_low_limit`
- reroute local-first задачи в local-only execution path, если policy предпочитает local work
- вводить явный `low_limit_state`:
  - `normal`
  - `warning`
  - `constrained`
  - `emergency`
- сохранять `confidence` и `matched_signals` для classification, а не только итоговый class
- сохранять `confidence_tier` и `signal_breakdown`, чтобы routing decisions были explainable не только по одной итоговой цифре
- оставлять budget artifacts в runs

Текущий routing contract:

- если request классифицирован как `local_first`
- и active policy имеет `prefer_local=true`
- ARC не зовёт provider, а выполняет local-only pipeline
- run metadata фиксирует:
  - `budget_route_locally`
  - `budget_routing_reason`
  - `provider_execution_mode`
- usage ledger честно пишет `used_provider=false` для такого случая

Current heuristic shape:

- signals now use simple weights, not first-match wins
- `premium_high_risk` overrides everything
- `premium_required` beats weak local signals like `inspect`
- `local_first` is chosen only when local evidence wins cleanly enough
- in `emergency_low_limit`, some low-confidence `cheap_provider_ok` work can also be rerouted locally to conserve provider budget

Current low-limit behavior:

- `balanced` -> `low_limit_state=normal`
- `deep_work` -> `low_limit_state=warning`
- `ultra_safe` -> `low_limit_state=constrained`
- `emergency_low_limit` -> `low_limit_state=emergency`

Operational consequences now include:

- `premium_high_risk` still blocks in `ultra_safe` and `emergency_low_limit`
- `premium_required` now also blocks in `emergency_low_limit`
- `cheap_provider_ok` may reroute locally in `emergency_low_limit` when provider confidence is low enough, for example on weak generic requests like naming or wording help that do not carry strong local or premium signals
- the same weak generic `cheap_provider_ok` requests now also reroute locally in `ultra_safe`, because `low_limit_state=constrained` now has an explicit low-confidence cheap-provider fallback too

That means a task like `inspect and implement the budget schema` is no longer rerouted locally just because it contains `inspect`; it stays provider-bound and is classified as `premium_required`.

Precedence rule for budget mode:

- `--budget-mode` задаёт effective budget mode для текущего run, если он передан явно
- если mode не задан флагом, ARC может взять его из session override file через `--budget-override-file`
- если session override mode не задан, ARC может взять mode из `.arc/budget/project_override.json`
- если и там mode нет, ARC может взять default из resolved preset stack через `environment_budget_profile`
- если neither explicit flag nor preset profile are present, ARC falls back to `balanced`
- после выбора effective mode ARC materialize-ит `.arc/budget/policy.json` под этот mode и синхронизирует файл
- это убирает рассинхрон между:
  - `requested_budget_mode`
  - `environment_budget_profile`
  - `budget_mode_source`
  - `assessment.mode`
  - `policy.mode`
  - run metadata
  - persisted `policy.json`

Policy overrides:

- `.arc/budget/project_override.json` is a durable project-level bias layer
- `--budget-override-file <path>` is a run/session-level override layer
- `arc budget override set|clear` is the first operator-facing CLI for managing the project override file without hand-editing JSON
- `arc budget show` prints the current project override plus the currently resolved project-level effective policy
- `arc budget session write|show|clear` is the operator-facing CLI for authoring and inspecting session override files that later feed `--budget-override-file`
- both files can override:
  - `mode`
  - `low_limit_state`
  - `prefer_local`
  - `block_premium_high_risk`
  - `block_premium_required`
  - `require_approval_for_premium_high_risk`
  - `require_approval_for_premium_required`
- overrides apply after base mode materialization, so one run can stay explainable as:
  - effective mode source
  - applied override sources
  - final effective policy

Per-run budget artifacts now also surface:

- `budget_policy_resolution.json`
- `budget_project_override_present`
- `budget_session_override_present`
- `budget_override_sources`

Run metadata and assessment artifacts now also surface:

- `budget_low_limit_state`
- `budget_confidence`
- `budget_confidence_tier`
- `budget_matched_signals`
- `budget_signal_breakdown`
- `budget_routing_trigger`

Prompt minimization is now explicit:

- every run now writes `prompt_minimization.json`
- `budget_assessment.json` embeds the same payload under `prompt_minimization`
- current minimization contract records:
  - `context_source`
  - `context_selection_reason`
  - `arc_tokens`
  - `ctx_tokens`
  - `selected_tokens`
  - `token_reduction`
  - `token_reduction_percent`
  - `prompt_minimized`

Usage attribution is richer too:

- `budget_usage_event.json` and `.arc/budget/usage_events.jsonl` now also persist:
  - `provider_model`
  - `provider_session_id`
  - `project_root`
  - `budget_mode_source`
  - `environment_budget_profile`
  - `context_source`
  - `context_selection_reason`
  - `context_arc_tokens`
  - `context_ctx_tokens`
  - `context_selected_tokens`
  - `context_token_reduction`
  - `context_token_reduction_percent`
  - `prompt_minimized`
  - `route_locally`

That means a budget event now explains both:

- why a run was routed, allowed, or blocked
- how much ARC reduced prompt pressure before that decision

Следующий слой развития — `Provider Budget Manager`, который дальше будет:

- классифицировать запросы до вызова провайдера
- учитывать usage events
- применять budget policies
- делать local-first routing богаче и точнее текущих keyword heuristics
- move beyond current weighted keyword heuristics toward stronger local routing confidence and richer risk estimation
- переводить систему в low-limit mode при необходимости

Базовые режимы:

- `ultra_safe`
- `balanced`
- `deep_work`
- `emergency_low_limit`

RFC source in repo: `rfcs/provider-budget-manager.md`
