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
                'background-color': '#36393f',
                'sidebar-bg': '#2f3136',
                'text-color': '#ffffff',
                'secondary-text-color': '#b9bbbe',
                'button-bg': '#5865f2',
                'button-hover-bg': '#4752c4',
                'button-text': '#ffffff',
                'message-bg': '#2f3136',
                'message-text': '#ffffff',
                'input-bg': '#202225',
                'input-text': '#dcddde',
                'placeholder-text': '#72767d',
                'box-bg': '#2f3136',
                'link-color': '#5865f2',
                'primary-text': '#ffffff',
                'secondary-text': '#b9bbbe',
                'border-color': '#202225',
                'card-bg': 'rgba(47, 49, 54, 0.95)',
                'card-border': 'rgba(255, 255, 255, 0.1)',
                'shadow-color': 'rgba(0, 0, 0, 0.3)',
                'hover-bg': '#40444b',
                'accent-color': '#5865f2',
                'success-color': '#43b581',
                'error-color': '#f04747',
                'warning-color': '#faa61a'
            };
        } else {
            return {
                'background-color': '#ffffff',
                'sidebar-bg': '#f5f6f8',
                'text-color': '#2f3136',
                'secondary-text-color': '#5e6a73',
                'button-bg': '#5865f2',
                'button-hover-bg': '#4752c4',
                'button-text': '#ffffff',
                'message-bg': '#f0f2f5',
                'message-text': '#2f3136',
                'input-bg': '#ffffff',
                'input-text': '#2f3136',
                'placeholder-text': '#72767d',
                'box-bg': '#f5f6f8',
                'link-color': '#5865f2',
                'primary-text': '#2f3136',
                'secondary-text': '#5e6a73',
                'border-color': '#e3e5e8',
                'card-bg': 'rgba(255, 255, 255, 0.95)',
                'card-border': 'rgba(0, 0, 0, 0.1)',
                'shadow-color': 'rgba(0, 0, 0, 0.1)',
                'hover-bg': '#e8eaed',
                'accent-color': '#5865f2',
                'success-color': '#43b581',
                'error-color': '#f04747',
                'warning-color': '#faa61a'
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