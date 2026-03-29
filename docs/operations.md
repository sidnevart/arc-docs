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
