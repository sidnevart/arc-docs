---
id: commands
title: Команды
---

# Команды

Ниже не полный low-level reference, а команды, которые нужны большинству пользователей.

## Подготовка

### Проверка окружения

```bash
arc doctor
```

### Инициализация проекта

```bash
arc init --path .
```

### Выбор режима

```bash
arc mode show --path .
arc mode set work --path .
```

## Работа с задачами

### Сделать план

```bash
arc task plan --path . --mode work --provider codex "<задача>"
```

### Сделать безопасный запуск

```bash
arc task run --path . --mode work --provider codex --dry-run "<задача>"
```

### Сделать реальный запуск

```bash
arc task run --path . --mode work --provider codex --provider-timeout 30s "<задача>"
```

### Запустить с явным budget mode

```bash
arc task run --path . --budget-mode deep_work "<задача>"
```

### Запустить с session budget override

```bash
arc task run --path . --budget-override-file ./.arc/tmp/session-budget.json "<задача>"
```

### Подготовить session budget override через CLI

```bash
arc budget session write --file ./.arc/tmp/session-budget.json --mode emergency_low_limit --block-premium-required true
arc budget session show --file ./.arc/tmp/session-budget.json --json
```

### Проверить статус

```bash
arc run list --path .
arc run status --path .
```

### Сделать review и verify

```bash
arc task review --path . --run-id <id>
arc task verify --path . --run-id <id> --run-checks
```

## Работа с чатом

### Начать новый чат

```bash
arc chat start --path . --provider codex --mode work "Обсуди со мной следующий шаг по проекту"
```

### Отправить сообщение в существующий чат

```bash
arc chat send --path . --session-id <id> "Продолжим с прошлого сообщения"
```

### Посмотреть список чатов

```bash
arc chat list --path .
```

## Работа с наборами

### Список наборов

```bash
arc preset list
```

### Создать черновик набора

```bash
arc preset draft init --path . --id codex-research-preset --name "Codex Research Preset" --summary "Draft preset for structured repo research." --goal "Help the user explore a codebase and return structured reviewable findings." --target-agent codex --providers codex,claude --json
```

### Посмотреть черновик набора

```bash
arc preset draft show --path . --json codex-research-preset
```

### Обновить черновик набора

```bash
arc preset draft update --path . --id codex-research-preset \
  --summary "Sharper draft summary for preset authoring." \
  --goal "Help operators shape reviewable presets from vague agent ideas." \
  --outputs preset_brief,preset_manifest,evaluation_pack,interview_notes \
  --workflow interview,normalize,simulate,refine,save \
  --quality-gates profile_complete,simulation_ready,validation_ready,brief_reviewed \
  --json
```

### Запустить guided interview по черновику

```bash
arc preset draft interview start --path . --id codex-research-preset --mode deep --json
arc preset draft interview answer --path . --session <session-id> --json "Help operators convert vague agent ideas into validated preset drafts."
arc preset draft interview remediate --path . --json <session-id>
arc preset draft interview show --path . --json <session-id>
```

### Проверить черновик набора

```bash
arc preset draft validate --path . --json codex-research-preset
```

### Прогнать симуляцию по черновику набора

```bash
arc preset draft simulate --path . --json codex-research-preset
```

### Перевести черновик в `tested` после passing simulation

```bash
arc preset draft mark-tested --path . --json codex-research-preset
```

### Экспортировать `tested` черновик в installable preset bundle

```bash
arc preset draft export --path . --json codex-research-preset
arc preset validate --root .arc/presets/exports codex-research-preset-codex
```

### Перевести экспортированный `tested` черновик в `published`

```bash
arc preset draft publish --path . --json codex-research-preset
```

После `publish` ARC пишет не только `publish.json` и `publish.md`, но и `publish_envelope.json` с source/trust metadata и SHA-256 fingerprints по provider-specific bundle files.

### Синхронизировать `published` черновик в произвольный local preset catalog

```bash
arc preset draft catalog-sync --path . --root ./local-preset-catalog --json codex-research-preset
arc preset validate --root ./local-preset-catalog codex-research-preset-codex
```

### Установить `published` черновик прямо из `.arc/presets/exports`

```bash
arc preset draft install --path . --json codex-research-preset
```

### Список черновиков набора

```bash
arc preset draft list --path . --json
```

### Предпросмотр установки

```bash
arc preset preview --path . --id <preset-id>
```

### Установка

```bash
arc preset install --path . --id <preset-id>
```

## Память и документация

### Состояние памяти

```bash
arc memory status --path .
```

### Записать память из hook runtime

```bash
ARC_RUN_ID=<run-id> ARC_ALLOWED_MEMORY_SCOPES=project,runs/<run-id> \
arc hook memory add --path . --scope runs/<run-id> "fact learned inside a preset hook"
```

### Обновить карты проекта

```bash
arc docs generate --path . --apply
```

## Если нужен полный walkthrough

- [CLI для новичков](./cli-guide.md)
- [Desktop для новичков](./desktop-guide.md)
- [Первый сценарий от начала до конца](./first-task.md)
