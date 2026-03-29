---
id: install
title: Установка
---

# Установка

Здесь описан самый простой путь, чтобы ARC заработал локально.

## Что нужно заранее

Минимальный набор:

- Go
- Git
- `rg` (ripgrep)

Дополнительно:

- `codex`, если хочешь live-запуски через Codex
- `claude`, если хочешь использовать Claude
- `ast-grep`, если нужен более сильный структурный поиск

## Сборка CLI

```bash
make build
```

После этого появится:

- `./bin/arc`

## Сборка desktop preview

```bash
make build-desktop
make desktop-preview
```

Desktop preview откроется по адресу из терминала.

## Сборка native desktop app

Если у тебя установлен Wails:

```bash
go build -tags wails ./cmd/arc-desktop-wails
cd cmd/arc-desktop-wails
wails build -tags wails -clean
```

## Установка документации локально

```bash
make docs-install
make docs-dev
```

## Первая проверка

После сборки проверь:

```bash
./bin/arc doctor
```

Если всё в порядке, переходи на [Быстрый старт](./quickstart.md).
