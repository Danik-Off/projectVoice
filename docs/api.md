# API Документация для социальной сети (аналог Discord)

## Содержание

- [Аутентификация](#аутентификация)
  - [Регистрация пользователя](#регистрация-пользователя)
  - [Логин пользователя](#логин-пользователя)
  - [Получение информации о пользователе](#получение-информации-о-пользователе)
- [Пользователи](#пользователи)
  - [Получение списка пользователей](#получение-списка-пользователей)
  - [Обновление информации о пользователе](#обновление-информации-о-пользователе)
- [Сервера](#сервера)
  - [Создание сервера](#создание-сервера)
  - [Получение списка серверов](#получение-списка-серверов)
  - [Получение информации о сервере](#получение-информации-о-сервере)
  - [Удаление сервера](#удаление-сервера)
- [Каналы](#каналы)
  - [Создание канала](#создание-канала)
  - [Получение списка каналов](#получение-списка-каналов)
  - [Получение информации о канале](#получение-информации-о-канале)
  - [Удаление канала](#удаление-канала)
- [Сообщения](#сообщения)
  - [Отправка сообщения](#отправка-сообщения)
  - [Получение сообщений канала](#получение-сообщений-канала)
  - [Удаление сообщения](#удаление-сообщения)
- [Участники серверов](#участники-серверов)
  - [Добавление участника на сервер](#добавление-участника-на-сервер)
  - [Удаление участника с сервера](#удаление-участника-с-сервера)

## Аутентификация

### Регистрация пользователя

- **POST** `/api/auth/register`
- **Тело запроса**:

 ```
  {
      "username": "your_username",
      "email": "your_email@example.com",
      "password": "your_password"
  }
 ```

- **Ответ**:

  - **201 Created**
   ```
    {
        "token": "your_jwt_token"
    }
   ```
  - **400 Bad Request**
   ```
    {
        "error": "Пользователь с таким email уже существует."
    }
   ```

### Логин пользователя

- **POST** `/api/auth/login`
- **Тело запроса**:

 ```
  {
      "email": "your_email@example.com",
      "password": "your_password"
  }
 ```

- **Ответ**:

  - **200 OK**
   ```
    {
        "token": "your_jwt_token"
    }
   ```
  - **404 Not Found**
   ```
    {
        "error": "Пользователь не найден."
    }
   ```
  - **400 Bad Request**
   ```
    {
        "error": "Неверный пароль."
    }
   ```

### Получение информации о пользователе

- **GET** `/api/users/:id` или `/api/users/me`
- **Заголовки**: `Authorization: Bearer your_jwt_token`

- **Ответ**:

  - **200 OK**
   ```
    {
        "id": 1,
        "username": "your_username",
        "email": "your_email@example.com"
    }
   ```

## Пользователи

### Получение списка пользователей

- **GET** `/api/users`
- **Заголовки**: `Authorization: Bearer your_jwt_token`

- **Ответ**:

  - **200 OK**
   ```
    [
        {
            "id": 1,
            "username": "user1",
            "email": "user1@example.com"
        },
        {
            "id": 2,
            "username": "user2",
            "email": "user2@example.com"
        }
    ]
   ```

### Обновление информации о пользователе

- **PUT** `/api/users/:id`
- **Заголовки**: `Authorization: Bearer your_jwt_token`
- **Тело запроса**:

 ```
  {
      "username": "new_username",
      "email": "new_email@example.com"
  }
 ```

- **Ответ**:

  - **200 OK**
   ```
    {
        "message": "Информация о пользователе обновлена."
    }
   ```

## Сервера

### Создание сервера

- **POST** `/api/servers`
- **Заголовки**: `Authorization: Bearer your_jwt_token`
- **Тело запроса**:

 ```
  {
      "name": "Server Name",
      "description": "Server Description"
  }
 ```

- **Ответ**:

  - **201 Created**
   ```
    {
        "id": 1,
        "name": "Server Name",
        "description": "Server Description"
    }
   ```

### Получение списка серверов

- **GET** `/api/servers`
- **Заголовки**: `Authorization: Bearer your_jwt_token`

- **Ответ**:

  - **200 OK**
   ```
    [
        {
            "id": 1,
            "name": "Server Name",
            "description": "Server Description"
        }
    ]
   ```

### Получение информации о сервере

- **GET** `/api/servers/:id`
- **Заголовки**: `Authorization: Bearer your_jwt_token`

- **Ответ**:

  - **200 OK**
   ```
    {
        "id": 1,
        "name": "Server Name",
        "description": "Server Description"
    }
   ```

### Удаление сервера

- **DELETE** `/api/servers/:id`
- **Заголовки**: `Authorization: Bearer your_jwt_token`

- **Ответ**:

  - **204 No Content**

## Каналы

### Создание канала

- **POST** `/api/servers/:serverId/channels`
- **Заголовки**: `Authorization: Bearer your_jwt_token`
- **Тело запроса**:

 ```
  {
      "name": "Channel Name",
      "type": "text" // или "voice"
  }
 ```

- **Ответ**:

  - **201 Created**
   ```
    {
        "id": 1,
        "name": "Channel Name",
        "type": "text"
    }
   ```

### Получение списка каналов

- **GET** `/api/servers/:serverId/channels`
- **Заголовки**: `Authorization: Bearer your_jwt_token`

- **Ответ**:

  - **200 OK**
   ```
    [
        {
            "id": 1,
            "name": "Channel Name",
            "type": "text"
        }
    ]
   ```

### Получение информации о канале

- **GET** `/api/channels/:id`
- **Заголовки**: `Authorization: Bearer your_jwt_token`

- **Ответ**:

  - **200 OK**
   ```
    {
        "id": 1,
        "name": "Channel Name",
        "type": "text"
    }
   ```

### Удаление канала

- **DELETE** `/api/channels/:id`
- **Заголовки**: `Authorization: Bearer your_jwt_token`

- **Ответ**:

  - **204 No Content**

## Сообщения

### Отправка сообщения

- **POST** `/api/channels/:channelId/messages`
- **Заголовки**: `Authorization: Bearer your_jwt_token`
- **Тело запроса**:

 ```
  {
      "content": "Hello, world!"
  }
 ```

- **Ответ**:

  - **201 Created**
   ```
    {
        "id": 1,
        "content": "Hello, world!",
        "timestamp": "2024-10-24T12:00:00Z"
    }
   ```

### Получение сообщений канала

- **GET** `/api/channels/:channelId/messages`
- **Заголовки**: `Authorization: Bearer your_jwt_token`

- **Ответ**:

  - **200 OK**
   ```
    [
        {
            "id": 1,
            "content": "Hello, world!",
            "timestamp": "2024-10-24T12:00:00Z"
        }
    ]
   ```

### Удаление сообщения

- **DELETE** `/api/messages/:id`
- **Заголовки**: `Authorization: Bearer your_jwt_token`

- **Ответ**:

  - **204 No Content**

## Участники серверов

### Добавление участника на сервер

- **POST** `/api/servers/:serverId/members`
- **Заголовки**: `Authorization: Bearer your_jwt_token`
- **Тело запроса**:

 ```
  {
      "userId": 1
  }
 ```

- **Ответ**:

  - **201 Created**
   ```
    {
        "message": "Пользователь добавлен на сервер."
    }
   ```

### Удаление участника с сервера

- **DELETE** `/api/servers/:serverId/members/:userId`
- **Заголовки**: `Authorization: Bearer your_jwt_token`

- **Ответ**:

  - **204 No Content**
