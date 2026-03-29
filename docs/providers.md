---
id: providers
title: Провайдеры
---

# Провайдеры

## Codex

Текущий адаптер поддерживает:

- `exec`
- `resume`
- transcript capture
- timeout handling
- process-group cleanup

`arc` уже доходит до реального `codex exec` path. В этом workspace внешний runtime всё ещё падает в своём OTEL/system-configuration коде во время live runs.

## Claude

Claude подключён к documented headless CLI shape:

- `claude -p`
- `--output-format json`
- `--resume`
- `--continue`

Для live validation по-прежнему нужен локально установленный `claude` binary.
