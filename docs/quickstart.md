---
id: quickstart
title: Быстрый старт
---

# Быстрый старт

Это самая короткая дорожка от нуля до первого полезного результата.

## 1. Собери ARC

```bash
make build
```

Если хочешь сразу собрать browser preview:

```bash
make build-desktop
```

## 2. Проверь окружение

```bash
./bin/arc doctor
```

Что желательно иметь:

- `git`
- `rg`
- `codex` для live-запусков через Codex
- `claude` только если хочешь работать через Claude

Если `ast-grep` не установлен, ARC всё равно будет работать.

## 3. Инициализируй проект

В корне проекта:

```bash
./bin/arc init --path .
```

После этого появится папка `.arc/`.

## 4. Выбери режим

```bash
./bin/arc mode set work --path .
```

Обычно:

- `study` — для обучения
- `work` — для обычной совместной работы
- `hero` — для максимально автономного режима

## 5. Сделай первый план

```bash
./bin/arc task plan --path . --mode work --provider codex "Посмотри проект и предложи следующее безопасное изменение"
```

## 6. Запусти безопасный сценарий

```bash
./bin/arc task run --path . --mode work --provider codex --dry-run "Проверь проект и подготовь маленькое безопасное изменение"
```

## 7. Посмотри результат

```bash
./bin/arc run list --path .
./bin/arc run status --path .
./bin/arc questions show --path .
```

## 8. Если хочешь работать через desktop

Сейчас основной путь — native app:

```bash
go build -tags wails ./cmd/arc-desktop-wails
```

Browser preview нужен только как временный fallback:

```bash
make desktop-preview
```

Открой адрес, который появится в терминале, и начни с экрана `Проект`.

## Куда идти дальше

- [Desktop для новичков](./desktop-guide.md)
- [CLI для новичков](./cli-guide.md)
- [Первый сценарий от начала до конца](./first-task.md)
