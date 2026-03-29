# Branding Source

Канонический brand source для ARC лежит в этой папке.

Текущий исходник:

- `assets/branding/arc-logo-source.svg`

Правило:

- UI logo, docs logo и desktop app icon должны собираться из одного исходного изображения
- допускаются только технические операции вроде resize, padding и safe-area crop
- нельзя рисовать новый логотип "по мотивам"

Сейчас derived assets собираются локально скриптом:

- `python3 scripts/build_brand_assets.py`

Он обновляет:

- `cmd/arc-desktop-wails/build/appicon.png`
- `cmd/arc-desktop-wails/build/darwin/iconfile.icns`

Для Dock/Finder используется mark-only вариант из того же исходника. Полный знак остаётся для интерфейса и документации.
