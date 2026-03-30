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
