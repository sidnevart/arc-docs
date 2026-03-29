---
id: workflows
title: Пользовательские сценарии
---

# Пользовательские сценарии

Ниже не reference, а реальные рабочие сценарии.

## Сценарий 1: Первый запуск в новом репозитории

```bash
arc doctor
arc init --path .
arc mode set work --path .
arc index build --path .
```

Ожидаемый результат:

- проект инициализирован
- `.arc/` создан
- индексы собраны
- можно переходить к planning/run

## Сценарий 2: Сначала понять задачу

```bash
arc task plan --path . --mode work "Понять, как устроена оркестрация run pipeline"
```

Смотри:

- `task_map.md`
- `system_flow.md`
- `unknowns.md`

## Сценарий 3: Прогнать весь pipeline безопасно

```bash
arc task run --path . --mode hero --provider codex --dry-run --no-provider --run-checks "Проверить текущее состояние репозитория"
```

Смотри:

- `verification_report.md`
- `review_report.md`
- `docs_delta.md`
- `anti_hallucination_report.md`

## Сценарий 4: Реальный provider-backed run

```bash
arc task run --path . --mode hero --provider codex --provider-timeout 30s "Сделать небольшое изменение"
```

Что важно:

- если provider упадёт, run станет `failed`
- артефакты всё равно сохранятся
- transcript и stderr останутся в run directory

## Сценарий 5: Обновить generated docs

```bash
arc docs generate --path . --apply
```

Что обновится:

- `REPO_MAP.md`
- `DOCS_MAP.md`
- `CLI_MAP.md`
- `ARTIFACTS_MAP.md`
- `RUNTIME_STATUS.md`

## Сценарий 6: Посмотреть, где проект застрял

```bash
arc run status --path .
arc questions show --path .
arc memory status --path .
```

Это основной набор команд для оператора, когда нужно быстро понять текущее состояние.
