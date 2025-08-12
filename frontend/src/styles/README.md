# VoiceVerse Design System

## Обзор

VoiceVerse Design System - это комплексная система дизайна для создания современного, доступного и визуально привлекательного интерфейса платформы голосового общения.

## Структура файлов

```
styles/
├── _colors.scss      # Цветовая система
├── _sizes.scss       # Система размеров и отступов
├── _animations.scss  # Анимации и эффекты
├── _utilities.scss   # Утилитарные классы
├── _typography.scss  # Типографика
├── _basic.scss       # Базовые стили
├── main.scss         # Главный файл стилей
└── theme/            # Темы оформления
    ├── _dark.scss    # Темная тема
    └── _light.scss   # Светлая тема
```

## Цветовая система

### Основные цвета
- `$primary-bg: #1a1a1a` - Основной фон
- `$secondary-bg: #2a2a2a` - Вторичный фон
- `$tertiary-bg: #333333` - Третичный фон
- `$accent-bg: #404040` - Акцентный фон

### Акцентные цвета
- `$primary-accent: #64b5f6` - Основной акцент (синий)
- `$secondary-accent: #e57373` - Вторичный акцент (красный)
- `$tertiary-accent: #81c784` - Третичный акцент (зеленый)
- `$success-accent: #81c784` - Цвет успеха
- `$warning-accent: #ffb74d` - Цвет предупреждения

### Градиенты
- `$gradient-primary` - Основной градиент (сине-фиолетовый)
- `$gradient-secondary` - Вторичный градиент (розово-фиолетовый)
- `$gradient-accent` - Акцентный градиент (голубой)
- `$gradient-dark` - Темный градиент

### Тени и свечения
- `$shadow-light` - Легкая тень
- `$shadow-medium` - Средняя тень
- `$shadow-heavy` - Тяжелая тень
- `$glow-primary` - Основное свечение
- `$glow-secondary` - Вторичное свечение

## Система размеров

### Отступы (Spacing)
- `$spacing-xs: 4px` - Очень маленький отступ
- `$spacing-sm: 8px` - Маленький отступ
- `$spacing-md: 16px` - Средний отступ
- `$spacing-lg: 24px` - Большой отступ
- `$spacing-xl: 32px` - Очень большой отступ
- `$spacing-2xl: 48px` - Двойной большой отступ
- `$spacing-3xl: 64px` - Тройной большой отступ

### Радиусы скругления
- `$border-radius: 12px` - Основной радиус
- `$border-radius-small: 8px` - Маленький радиус
- `$border-radius-large: 20px` - Большой радиус
- `$border-radius-xl: 28px` - Очень большой радиус
- `$border-radius-round: 50%` - Круглый радиус

### Размеры компонентов
- `$avatar-size: 40px` - Размер аватара
- `$button-height: 44px` - Высота кнопки
- `$input-height: 44px` - Высота поля ввода
- `$icon-size: 18px` - Размер иконки

## Анимации

### Основные анимации
- `pulse` - Пульсация
- `ripple` - Волновой эффект
- `shimmer` - Мерцание
- `wave` - Волна
- `blink` - Моргание
- `rotate` - Вращение
- `expandWidth` - Расширение ширины
- `speaking` - Индикатор речи

### Классы анимаций
- `.animate-pulse` - Пульсация
- `.animate-ripple` - Волновой эффект
- `.animate-shimmer` - Мерцание
- `.animate-wave` - Волна
- `.animate-blink` - Моргание
- `.animate-rotate` - Вращение

### Задержки анимаций
- `.animate-delay-1` - Задержка 0.1s
- `.animate-delay-2` - Задержка 0.2s
- `.animate-delay-3` - Задержка 0.3s
- `.animate-delay-4` - Задержка 0.4s
- `.animate-delay-5` - Задержка 0.5s

## Утилитарные классы

### Отступы
- `.p-{size}` - Padding для всех сторон
- `.pt-{size}` - Padding сверху
- `.pr-{size}` - Padding справа
- `.pb-{size}` - Padding снизу
- `.pl-{size}` - Padding слева
- `.px-{size}` - Padding по горизонтали
- `.py-{size}` - Padding по вертикали

### Размеры
- `.w-{size}` - Ширина
- `.h-{size}` - Высота
- `.min-w-{size}` - Минимальная ширина
- `.min-h-{size}` - Минимальная высота
- `.max-w-{size}` - Максимальная ширина
- `.max-h-{size}` - Максимальная высота

### Цвета фона
- `.bg-primary` - Основной фон
- `.bg-secondary` - Вторичный фон
- `.bg-tertiary` - Третичный фон
- `.bg-accent` - Акцентный фон

### Градиенты
- `.bg-gradient-primary` - Основной градиент
- `.bg-gradient-secondary` - Вторичный градиент
- `.bg-gradient-accent` - Акцентный градиент
- `.bg-gradient-dark` - Темный градиент

### Цвета текста
- `.text-primary` - Основной текст
- `.text-secondary` - Вторичный текст
- `.text-muted` - Приглушенный текст
- `.text-disabled` - Отключенный текст
- `.text-accent` - Акцентный текст

### Границы
- `.border-primary` - Основная граница
- `.border-secondary` - Вторичная граница
- `.border-accent` - Акцентная граница
- `.border-1` - Толщина границы 1px
- `.border-2` - Толщина границы 2px
- `.border-4` - Толщина границы 4px

### Радиусы
- `.rounded` - Основной радиус
- `.rounded-sm` - Маленький радиус
- `.rounded-lg` - Большой радиус
- `.rounded-xl` - Очень большой радиус
- `.rounded-full` - Круглый радиус

### Тени
- `.shadow-light` - Легкая тень
- `.shadow-medium` - Средняя тень
- `.shadow-heavy` - Тяжелая тень
- `.shadow-glow` - Свечение

### Позиционирование
- `.relative` - Относительное позиционирование
- `.absolute` - Абсолютное позиционирование
- `.fixed` - Фиксированное позиционирование
- `.sticky` - Липкое позиционирование

### Отображение
- `.block` - Блочное отображение
- `.inline-block` - Строчно-блочное отображение
- `.inline` - Строчное отображение
- `.flex` - Flexbox отображение
- `.grid` - Grid отображение
- `.hidden` - Скрытое отображение

### Flexbox
- `.flex-row` - Горизонтальное направление
- `.flex-col` - Вертикальное направление
- `.items-center` - Выравнивание по центру
- `.justify-center` - Выравнивание по центру
- `.flex-1` - Растягивание

### Размеры
- `.w-full` - Полная ширина
- `.h-full` - Полная высота
- `.w-screen` - Ширина экрана
- `.h-screen` - Высота экрана

### Overflow
- `.overflow-hidden` - Скрытый overflow
- `.overflow-auto` - Автоматический overflow
- `.overflow-scroll` - Скроллируемый overflow

### Курсор
- `.cursor-pointer` - Указатель
- `.cursor-default` - По умолчанию
- `.cursor-not-allowed` - Запрещено
- `.cursor-grab` - Захват
- `.cursor-grabbing` - Захватывание

### Z-index
- `.z-0` - Базовый z-index
- `.z-10` - Z-index 10
- `.z-20` - Z-index 20
- `.z-30` - Z-index 30
- `.z-40` - Z-index 40
- `.z-50` - Z-index 50

### Backdrop-filter
- `.backdrop-blur-sm` - Легкое размытие
- `.backdrop-blur` - Размытие
- `.backdrop-blur-md` - Среднее размытие
- `.backdrop-blur-lg` - Большое размытие
- `.backdrop-blur-xl` - Очень большое размытие

### Переходы
- `.transition` - Основной переход
- `.transition-fast` - Быстрый переход
- `.transition-slow` - Медленный переход
- `.transition-colors` - Переход цветов
- `.transition-transform` - Переход трансформации
- `.transition-opacity` - Переход прозрачности
- `.transition-shadow` - Переход теней

### Трансформации
- `.transform` - Базовая трансформация
- `.scale-90` - Масштаб 0.9
- `.scale-95` - Масштаб 0.95
- `.scale-100` - Масштаб 1.0
- `.scale-105` - Масштаб 1.05
- `.scale-110` - Масштаб 1.1

### Вращение
- `.rotate-0` - Без вращения
- `.rotate-90` - Поворот на 90°
- `.rotate-180` - Поворот на 180°
- `.rotate-270` - Поворот на 270°

### Смещение
- `.translate-x-0` - Без смещения по X
- `.translate-x-1` - Смещение по X на 4px
- `.translate-x-2` - Смещение по X на 8px
- `.translate-x-4` - Смещение по X на 16px
- `.translate-x-8` - Смещение по X на 24px

- `.translate-y-0` - Без смещения по Y
- `.translate-y-1` - Смещение по Y на 4px
- `.translate-y-2` - Смещение по Y на 8px
- `.translate-y-4` - Смещение по Y на 16px
- `.translate-y-8` - Смещение по Y на 24px

### Hover эффекты
- `.hover:scale-105` - Масштаб при наведении
- `.hover:scale-110` - Масштаб при наведении
- `.hover:-translate-y-1` - Подъем при наведении
- `.hover:-translate-y-2` - Подъем при наведении
- `.hover:bg-secondary` - Фон при наведении
- `.hover:bg-tertiary` - Фон при наведении
- `.hover:bg-accent` - Фон при наведении
- `.hover:text-accent` - Текст при наведении
- `.hover:text-primary` - Текст при наведении
- `.hover:border-accent` - Граница при наведении
- `.hover:shadow-medium` - Тень при наведении
- `.hover:shadow-glow` - Свечение при наведении

### Focus эффекты
- `.focus:outline-none` - Убрать outline при фокусе
- `.focus:ring` - Кольцо при фокусе
- `.focus:ring-2` - Кольцо при фокусе (2px)
- `.focus:ring-4` - Кольцо при фокусе (4px)

### Active эффекты
- `.active:scale-95` - Масштаб при нажатии
- `.active:translate-y-1` - Смещение при нажатии

### Disabled состояния
- `.disabled:opacity-50` - Прозрачность при отключении
- `.disabled:cursor-not-allowed` - Курсор при отключении
- `.disabled:pointer-events-none` - Отключить события при отключении

### Скроллбары
- `.scrollbar-thin` - Тонкий скроллбар

### Градиентный текст
- `.gradient-text` - Градиентный текст

### Стеклянный эффект
- `.glass` - Стеклянный эффект

### Фокус
- `.focus-visible:ring` - Кольцо при фокусе (только для клавиатуры)

### Группировка
- `.group:hover .group-hover:opacity-100` - Прозрачность при наведении на группу
- `.group:hover .group-hover:scale-105` - Масштаб при наведении на группу
- `.group:hover .group-hover:translate-y-0` - Смещение при наведении на группу

### Адаптивность
- `.sm:block` - Блочное отображение на мобильных
- `.md:flex` - Flexbox отображение на планшетах
- `.lg:grid` - Grid отображение на десктопах
- `.xl:w-full` - Полная ширина на больших экранах

## Использование

### В SCSS файлах
```scss
@import 'styles/colors';
@import 'styles/sizes';
@import 'styles/animations';
@import 'styles/utilities';

.my-component {
    background: $primary-bg;
    padding: $spacing-md;
    border-radius: $border-radius;
    animation: pulse 2s ease-in-out infinite;
}
```

### В компонентах React
```tsx
import 'styles/main.scss';

const MyComponent = () => (
    <div className="bg-primary p-md rounded animate-pulse">
        <h1 className="text-primary text-accent">Заголовок</h1>
        <button className="btn btn-accent hover:scale-105">
            Кнопка
        </button>
    </div>
);
```

### Комбинирование классов
```tsx
<div className="
    bg-secondary 
    p-lg 
    rounded-lg 
    shadow-medium 
    hover:shadow-glow 
    transition-all 
    animate-fade-in
">
    Контент
</div>
```

## Принципы дизайна

1. **Консистентность** - Все компоненты используют единую систему цветов, размеров и анимаций
2. **Доступность** - Цвета подобраны для комфортного восприятия глаз
3. **Производительность** - Анимации оптимизированы для плавности
4. **Масштабируемость** - Система легко расширяется новыми компонентами
5. **Адаптивность** - Поддержка различных размеров экранов

## Расширение системы

### Добавление новых цветов
```scss
// В _colors.scss
$new-color: #ff6b6b;
$new-gradient: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
```

### Добавление новых размеров
```scss
// В _sizes.scss
$spacing-4xl: 80px;
$border-radius-2xl: 36px;
```

### Добавление новых анимаций
```scss
// В _animations.scss
@keyframes newAnimation {
    0% { opacity: 0; }
    100% { opacity: 1; }
}

.animate-new {
    animation: newAnimation 1s ease-out;
}
```

### Добавление новых утилит
```scss
// В _utilities.scss
.new-utility {
    property: value;
}
```

## Совместимость

- **Браузеры**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **React**: 16.8+ (с hooks)
- **SCSS**: 1.32+
- **Node.js**: 14+

## Лицензия

MIT License - свободное использование в коммерческих и некоммерческих проектах.
