---
id: troubleshooting
title: Проблемы и диагностика
---

# Проблемы и диагностика

## `arc doctor` ругается на отсутствующие инструменты

Сначала запусти:

```bash
arc doctor
```

Что означает:

- нет `codex` -> live Codex runs не пойдут
- нет `claude` -> Claude adapter не проверишь
- нет `ast-grep` -> AST-aware search ограничен, но базовый индекс всё равно работает

## Run завис или провайдер упал

Смотри:

- `arc run status --path .`
- `.arc/runs/<run-id>/provider_transcript.jsonl`
- `.arc/runs/<run-id>/provider_stderr.log`
- `.arc/runs/<run-id>/trace.jsonl`

## Run завершился как `failed`

Это не всегда проблема `arc`.

Возможные причины:

- provider runtime упал
- timeout сработал
- provider CLI несовместим по флагам
- локальный runtime сломан или не залогинен

При этом `arc` всё равно должен оставить:

- verification report
- review report
- docs delta
- trace

## Локальная проблема текущего workspace

На этой машине live `codex` может паниковать внутри своего OTEL/system-configuration слоя в более жёстко ограниченном окружении. Это внешний provider runtime issue, а не поломка chat-модели ARC. Обычный chat path в ARC теперь остаётся reply-only, корректно показывает failure reason и умеет материализовывать miniapp/diagram outputs, если внешний provider runtime доходит до ответа.

На 2026-03-29 этот же structured-output chat path был отдельно подтверждён вне constrained sandbox: `codex` вернул `arc-simulation html`, ARC материализовал HTML-артефакт и поднял live preview в `.arc/live_apps/`.

## Docusaurus не открывается

Проверь:

```bash
cd docs-site
npm run build
```

Если нужен локальный сайт:

```bash
npm run serve
```

Или раздавай `docs-site/build/` любым простым HTTP server.
