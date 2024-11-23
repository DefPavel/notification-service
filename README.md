# NestJS + Kafka Notification Service

## Описание

Этот проект демонстрирует, как использовать **NestJS** для реализации микросервисной архитектуры с интеграцией **Apache Kafka**. Основная цель сервиса — отправлять уведомления (например, по email) через Kafka.

## Функциональность

- Отправка уведомлений через REST API с публикацией сообщений в Kafka.
- Обработка сообщений из Kafka для выполнения действий (например, отправка email).
- Поддержка повторных попыток при отправке email с помощью `nodemailer`.

---

## Установка

### Шаги установки

1. Клонируйте репозиторий:

```bash
git clone https://github.com/DefPavel/notification-service.git
cd notification-service
```

2. Установить зависимости:

```bash
npm i
```

3. Запуск:

```bash
docker compose up --build -d
```

---
