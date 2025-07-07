import { makeAutoObservable } from 'mobx';

export type Theme = 'light' | 'dark';

class ThemeStore {
    currentTheme: Theme = 'dark';

    constructor() {
        makeAutoObservable(this);
        this.loadTheme();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            this.currentTheme = savedTheme;
        } else {
            // Определяем тему по системным настройкам
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.currentTheme = prefersDark ? 'dark' : 'light';
        }
        this.applyTheme();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    setTheme(theme: Theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme();
    }

    private applyTheme() {
        const root = document.documentElement;
        root.setAttribute('data-theme', this.currentTheme);
        
        // Динамически загружаем CSS переменные для темы
        const themeColors = this.getThemeColors();
        Object.entries(themeColors).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
        });
    }

    private getThemeColors() {
        if (this.currentTheme === 'dark') {
            return {
                // Основные цвета фона
                'background-primary': '#36393f',
                'background-secondary': '#2f3136',
                'background-tertiary': '#202225',
                
                // Цвета текста
                'text-primary': '#ffffff',
                'text-muted': '#b9bbbe',
                
                // Цвета границ
                'border-color': '#202225',
                
                // Акцентные цвета
                'accent-color': '#5865f2',
                'success-color': '#43b581',
                'error-color': '#f04747',
                'warning-color': '#faa61a',
                
                // Цвета кнопок
                'button-bg': '#5865f2',
                'button-hover-bg': '#4752c4',
                'button-text': '#ffffff',
                
                // Цвета полей ввода
                'input-bg': '#202225',
                'input-text': '#dcddde',
                'placeholder-text': '#72767d',
                
                // Цвета карточек
                'card-bg': 'rgba(47, 49, 54, 0.95)',
                'card-border': 'rgba(255, 255, 255, 0.1)',
                
                // Тени
                'shadow-color': 'rgba(0, 0, 0, 0.3)',
                
                // Hover эффекты
                'hover-bg': '#40444b',
                
                // Устаревшие переменные для совместимости
                'background-color': '#36393f',
                'sidebar-bg': '#2f3136',
                'text-color': '#ffffff',
                'secondary-text-color': '#b9bbbe',
                'box-bg': '#2f3136',
                'link-color': '#5865f2',
                'primary-text': '#ffffff',
                'secondary-text': '#b9bbbe',
                'message-bg': '#2f3136',
                'message-text': '#ffffff'
            };
        } else {
            return {
                // Основные цвета фона
                'background-primary': '#ffffff',
                'background-secondary': '#f8f9fa',
                'background-tertiary': '#ffffff',
                
                // Цвета текста
                'text-primary': '#2f3136',
                'text-muted': '#5e6a73',
                
                // Цвета границ
                'border-color': '#e9ecef',
                
                // Акцентные цвета
                'accent-color': '#5865f2',
                'success-color': '#43b581',
                'error-color': '#f04747',
                'warning-color': '#faa61a',
                
                // Цвета кнопок
                'button-bg': '#5865f2',
                'button-hover-bg': '#4752c4',
                'button-text': '#ffffff',
                
                // Цвета полей ввода
                'input-bg': '#ffffff',
                'input-text': '#2f3136',
                'placeholder-text': '#72767d',
                
                // Цвета карточек
                'card-bg': 'rgba(255, 255, 255, 0.95)',
                'card-border': 'rgba(0, 0, 0, 0.1)',
                
                // Тени
                'shadow-color': 'rgba(0, 0, 0, 0.1)',
                
                // Hover эффекты
                'hover-bg': '#e8eaed',
                
                // Устаревшие переменные для совместимости
                'background-color': '#ffffff',
                'sidebar-bg': '#f5f6f8',
                'text-color': '#2f3136',
                'secondary-text-color': '#5e6a73',
                'box-bg': '#f5f6f8',
                'link-color': '#5865f2',
                'primary-text': '#2f3136',
                'secondary-text': '#5e6a73',
                'message-bg': '#f0f2f5',
                'message-text': '#2f3136'
            };
        }
    }

    get isDark() {
        return this.currentTheme === 'dark';
    }

    get isLight() {
        return this.currentTheme === 'light';
    }
}

export const themeStore = new ThemeStore(); 