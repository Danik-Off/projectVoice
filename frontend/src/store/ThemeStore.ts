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
        
        // Удаляем предыдущие классы тем
        root.classList.remove('theme-light', 'theme-dark');
        
        // Добавляем нужный класс темы
        root.classList.add(`theme-${this.currentTheme}`);
        
        // Устанавливаем атрибут data-theme для дополнительной совместимости
        root.setAttribute('data-theme', this.currentTheme);
        
        // Применяем тему к body для обратной совместимости
        document.body.className = `theme-${this.currentTheme}`;
        
        console.log(`Applied theme: ${this.currentTheme}`);
    }

    // Метод для получения системной темы
    getSystemTheme(): Theme {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Метод для применения системной темы
    applySystemTheme() {
        const systemTheme = this.getSystemTheme();
        this.setTheme(systemTheme);
    }

    get isDark() {
        return this.currentTheme === 'dark';
    }

    get isLight() {
        return this.currentTheme === 'light';
    }
}

export const themeStore = new ThemeStore(); 