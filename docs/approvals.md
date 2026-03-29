---
id: approvals
title: Approval gates
---

# Approval gates

Даже в `hero` режиме `arc` не должен бесконтрольно делать risky actions.

## Что считается risky

Сейчас approval gates срабатывают по тексту задачи, если в ней есть признаки:

- удаления или destructive changes
- работы с секретами и конфигами
- миграций БД
- деплоя или publish
- `git push` или PR creation
- CI/CD изменений
- сетевых или внешних интеграций

## Что делает `arc`

Если risky task требует approval и ты не дал явное разрешение:

- provider execution не стартует
- run получает статус `blocked`
- пишется `approval_report.md`

## Как запустить осознанно

```bash
arc task run --path . --mode hero --provider codex --approve-risky "Deploy the service and apply the migration"
```

## Что важно понимать

- approval gates не заменяют здравый смысл
- сейчас это task-text risk assessment, а не полный action interceptor
- это MVP-уровень governance, а не финальная policy engine
