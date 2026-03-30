---
id: roadmap
title: Дорожная карта
---

# Дорожная карта

## Уже реализовано

- provider-neutral Go CLI
- deterministic orchestration
- layered memory
- approval gates
- docs apply для generated runtime maps
- live provider timeout/failure handling

## Что осталось

- validate live Claude runtime
- улучшить docs auto-update beyond generated maps
- углубить approval gates от task-text heuristics к concrete action-level policy
- исследовать или задокументировать workaround для текущей Codex OTEL panic
- зафиксировать composition model для preset environment
- углубить первый standalone-first `ctx` boundary дальше от current token-first plus memory-aware heuristic selection toward richer doc/code relevance, richer `.context/memory` semantics, and deeper orchestrator integration
- углубить первый provider budget layer дальше от current weighted routing heuristics, local-first rerouting, and fixed mode precedence toward richer routing confidence, low-limit behavior и preset-linked policy

## Зафиксированные следующие foundation tracks

- [Среда пресетов](./preset-environment)
- [Context Tool](./context-tool)
- [Budget Layer](./provider-budgeting)
