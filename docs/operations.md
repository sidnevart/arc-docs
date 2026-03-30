---
id: operations
title: Эксплуатация
---

# Эксплуатация

## Рекомендуемый локальный flow

1. `make build`
2. `arc doctor`
3. `arc init --path .`
4. `arc task plan ...`
5. `arc task run ...`
6. `arc docs generate --path . --apply`

## Docs site

Из `docs-site/`:

```bash
npm install
npm run start
```

Открой `http://localhost:3000`.

## Runtime status docs

После `arc docs generate --apply` проект обновляет:

- `.arc/maps/REPO_MAP.md`
- `.arc/maps/DOCS_MAP.md`
- `.arc/maps/CLI_MAP.md`
- `.arc/maps/ARTIFACTS_MAP.md`
- `.arc/maps/RUNTIME_STATUS.md`

## Следующие operator-facing foundations

- [Среда пресетов](./preset-environment)
- [Context Tool](./context-tool)
- [Budget Layer](./provider-budgeting)

## Repo-local validation skills

Перед приёмкой больших foundation-срезов используй project-local `.codex` validators:

- `preset-environment-validator`
- `context-tool-validator`
- `provider-budget-validator`
- `agent-ux-validator`
- `editorial-release-validator`

Эти skills нужны, чтобы acceptance не держался только на памяти прошлых фиксов и ручных проверках.
