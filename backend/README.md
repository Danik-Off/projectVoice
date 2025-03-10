# Backend Chat Application

Этот проект представляет собой бэкенд для приложения для общения, поддерживающего текстовые и голосовые
каналы, а также управление пользователями и серверами.

## Содержание

-   [Описание](#описание)
-   [Требования](#требования)
-   [Установка](#установка)
-   [Запуск приложения](#запуск-приложения)
-   [Миграция базы данных](#миграция-базы-данных)
-   [API](#api)
-   [Лицензия](#лицензия)

## Описание

Бэкенд построен с использованием Node.js и Express. Он поддерживает аутентификацию пользователей, управление
серверами, каналами и обмен сообщениями между пользователями.

## Требования

-   Node.js >= 14.x
-   npm >= 6.x
-   База данных (MySQL или PostgreSQL)

## Установка

1. Клонируйте репозиторий:

    ```
    git clone https://github.com/yourusername/chat-backend.git
    ```

2. Перейдите в директорию проекта:

    ```
    cd chat-backend
    ```

3. Установите зависимости:

    ```
    npm install
    ```

4. Создайте файл `.env` в корневой директории и добавьте ваши настройки:

    ```
    PORT=3000
    JWT_SECRET=your_jwt_secret
    DATABASE_URL=your_database_url
    ```

    Замените `your_jwt_secret` и `your_database_url` на соответствующие значения.

## Запуск приложения

Для запуска приложения в режиме разработки используйте:

```
npm run dev
```

Для запуска в продакшн-режиме используйте:

```
npm start
```

## Миграция базы данных

Чтобы применить миграции и создать необходимые таблицы в базе данных, используйте команду:

```
npm run db:migrate
```

Для отката последней миграции:

```
npm run db:migrate:undo
```

Для проверки статуса миграций:

```
npm run db:migrate:status
```

Чтобы заполнить базу данных начальными данными (если вы создали сиды):

```
npm run db:seed
```

## API

### Регистрация пользователя

-   **POST** `/api/auth/register`
-   **Тело запроса**:

    ```
    {
        "username": "your_username",
        "email": "your_email@example.com",
        "password": "your_password"
    }
    ```

### Логин пользователя

-   **POST** `/api/auth/login`
-   **Тело запроса**:

    ```
    {
        "email": "your_email@example.com",
        "password": "your_password"
    }
    ```

### Получение информации о пользователе

-   **GET** `/api/users/:id` или `/api/users/me`
-   **Заголовки**: `Authorization: Bearer your_jwt_token`

## Лицензия

Этот проект лицензирован под MIT License - смотрите файл [LICENSE](LICENSE) для подробностей.
