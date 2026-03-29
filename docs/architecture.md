---
id: architecture
title: Архитектура
---

# Архитектура

`arc` разделён на несколько стабильных подсистем.

## CLI layer

Парсит команды и переводит их в orchestrator actions.

## Orchestrator

Запускает детерминированную state machine:

- `initialized`
- `context_collecting`
- `planning`
- `implementing`
- `verifying`
- `reviewing`
- `documenting`
- `done`
- `failed`
- `blocked`

## Провайдеры

Адаптеры скрывают runtime-specific детали Codex и Claude, сохраняя orchestration core provider-neutral.

## Контекст и память

- file index
- symbol index
- docs index
- recent changes
- layered memory поверх `.arc/memory/entries.json`

## Governance

Approval gates останавливают risky tasks до provider execution, если оператор явно не передал `--approve-risky`.
