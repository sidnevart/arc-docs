---
id: modes
title: Режимы
---

# Режимы

Главная пользовательская идея `arc`: одна и та же задача должна вести себя по-разному в зависимости от режима.

## `study`

Когда использовать:

- учишься
- хочешь понять систему или тему
- не хочешь, чтобы агент сразу решал за тебя

Как ведёт себя агент:

- сначала уточняет
- не должен сразу выдавать готовое решение
- должен фиксировать пробелы в понимании
- может давать подсказки по лестнице помощи

Типовые артефакты:

- `learning_goal.md`
- `current_understanding.md`
- `knowledge_gaps.md`
- `challenge_log.md`
- `practice_tasks.md`

Пример:

```bash
arc learn "Объясни deterministic state machine в этом проекте"
arc learn quiz --path .
```

## `work`

Когда использовать:

- работаешь в реальном проекте
- хочешь, чтобы агент помог разобраться, а не просто кодил вслепую
- нужен баланс между поддержкой и контролем

Как ведёт себя агент:

- сначала картирует систему
- показывает unknowns
- помогает выстроить flow задачи
- может делать рутину и подготовительные части

Типовые артефакты:

- `task_map.md`
- `system_flow.md`
- `solution_options.md`
- `unknowns.md`
- `validation_checklist.md`

Пример:

```bash
arc task plan --path . --mode work "Рефакторинг provider adapter boundaries"
```

## `hero`

Когда использовать:

- хочешь максимально автономный режим
- задача достаточно понятная и bounded
- ты готов принимать approval-gated действия отдельно

Как ведёт себя агент:

- проходит deterministic pipeline
- строит spec
- выполняет implementation stage
- затем verification, review и docs
- risky actions блокируются approval gate

Типовые артефакты:

- `ticket_spec.md`
- `business_spec.md`
- `tech_spec.md`
- `question_bundle.md`
- `implementation_log.md`
- `verification_report.md`
- `review_report.md`
- `docs_delta.md`

Пример:

```bash
arc task run --path . --mode hero --provider codex --provider-timeout 30s "Добавить команду и обновить документацию"
```

## Как выбрать режим быстро

- бери `study`, если цель понять
- бери `work`, если цель двигать проект без потери инженерного мышления
- бери `hero`, если цель закрыть bounded task максимально автономно
