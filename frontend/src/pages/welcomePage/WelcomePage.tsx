// src/components/WelcomePage.tsx
// import { useTranslation } from 'react-i18next';
import './WelcomePage.scss';

const WelcomePage: React.FC = () => {
    // const { t } = useTranslation();

    return (
        <div className="welcome-page">
            {/* Анимированный фон */}
            <div className="background-animation">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                </div>
                <div className="grid-pattern"></div>
            </div>

            {/* Главный контент */}
            <div className="welcome-container">
                {/* Герой секция */}
                <section className="hero-section">
                    <div className="hero-content">
                        <div className="hero-logo">
                            <div className="logo-container">
                                <span className="logo-icon">🎙️</span>
                                <div className="logo-rings">
                                    <div className="ring ring-1"></div>
                                    <div className="ring ring-2"></div>
                                    <div className="ring ring-3"></div>
                                </div>
                            </div>
                            <h1 className="hero-title">
                                <span className="title-text">ProjectVoice</span>
                                <div className="title-underline"></div>
                            </h1>
                        </div>
                        
                        <div className="hero-story">
                            <h2 className="story-title">История создания</h2>
                            <p className="story-text">
                                Один разработчик под ником <strong>Danik Off</strong> решил, что хочет сделать сервис для себя, 
                                своих друзей и всех желающих для общения на <strong>peer-to-peer WebRTC</strong>.
                            </p>
                            <p className="story-text">
                                Из-за блокировки популярных платформ для общения 
                                появился ProjectVoice — доступная альтернатива для качественного голосового общения.
                            </p>
                            <div className="development-status">
                                <span className="status-badge">🚧 Ранний этап разработки</span>
                                <p className="status-text">Проект активно развивается. Функционал может изменяться.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hero-visual">
                        <div className="visual-container">
                            <div className="developer-card">
                                <div className="developer-avatar">👨‍💻</div>
                                <div className="developer-info">
                                    <h3 className="developer-name">Danik Off</h3>
                                    <p className="developer-role">Разработчик & Геймер</p>
                                </div>
                                <div className="developer-glow"></div>
                            </div>
                            <div className="gaming-preview">
                                <div className="game-icon">🎮</div>
                                <div className="friends-icon">👥</div>
                                <div className="connection-line"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Секция мотивации */}
                <section className="motivation-section">
                    <div className="motivation-content">
                        <h2 className="motivation-title">Почему ProjectVoice?</h2>
                        <div className="motivation-grid">
                            <div className="motivation-item">
                                <div className="motivation-icon">🎯</div>
                                <h3>Личная потребность</h3>
                                <p>Создано из реальной необходимости общаться с друзьями во время игр</p>
                            </div>
                            <div className="motivation-item">
                                <div className="motivation-icon">🔒</div>
                                <h3>Независимость</h3>
                                <p>Больше никаких корпоративных ограничений и изменений в политике</p>
                            </div>
                            <div className="motivation-item">
                                <div className="motivation-icon">⚡</div>
                                <h3>Простота</h3>
                                <p>Минималистичный интерфейс без лишних функций</p>
                            </div>
                            <div className="motivation-item">
                                <div className="motivation-icon">🌍</div>
                                <h3>Открытость</h3>
                                <p>Открытый исходный код и прозрачная архитектура</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Секция технических деталей */}
                <section className="tech-section">
                    <div className="tech-content">
                        <h2 className="tech-title">Технические возможности</h2>
                        <p className="tech-subtitle">
                            Что уже работает в ProjectVoice
                        </p>
                        <div className="tech-grid">
                            <div className="tech-item">
                                <div className="tech-icon">🔗</div>
                                <h3>Peer-to-Peer</h3>
                                <p>Прямое соединение между пользователями без промежуточных серверов</p>
                                <div className="tech-benefits">
                                    <span className="benefit">Низкая задержка</span>
                                    <span className="benefit">Приватность</span>
                                </div>
                            </div>
                            <div className="tech-item">
                                <div className="tech-icon">🌐</div>
                                <h3>WebRTC</h3>
                                <p>Современный стандарт для передачи аудио в браузере</p>
                                <div className="tech-benefits">
                                    <span className="benefit">Высокое качество</span>
                                    <span className="benefit">Без плагинов</span>
                                </div>
                            </div>
                            <div className="tech-item">
                                <div className="tech-icon">⚙️</div>
                                <h3>Простая архитектура</h3>
                                <p>Минималистичная структура, которую легко поддерживать</p>
                                <div className="tech-benefits">
                                    <span className="benefit">Простота</span>
                                    <span className="benefit">Надежность</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Секция сообщества */}
                <section className="community-section">
                    <div className="community-content">
                        <h2 className="community-title">Присоединяйтесь к сообществу</h2>
                        <p className="community-subtitle">
                            ProjectVoice создан для тех, кто ценит простое и эффективное общение
                        </p>
                        <div className="community-features">
                            <div className="community-feature">
                                <span className="feature-icon">🎮</span>
                                <span className="feature-text">Игровые команды</span>
                            </div>
                            <div className="community-feature">
                                <span className="feature-icon">👥</span>
                                <span className="feature-text">Дружеские беседы</span>
                            </div>
                            <div className="community-feature">
                                <span className="feature-icon">💻</span>
                                <span className="feature-text">Рабочие встречи</span>
                            </div>
                            <div className="community-feature">
                                <span className="feature-icon">🎵</span>
                                <span className="feature-text">Музыкальные джемы</span>
                            </div>
                        </div>
                        
                        <div className="social-links">
                            <h3 className="social-title">Следите за развитием проекта</h3>
                            <div className="social-buttons">
                                <a href="https://t.me/projectvoice" target="_blank" rel="noopener noreferrer" className="social-btn telegram">
                                    <span className="social-icon">📱</span>
                                    <span className="social-text">Telegram</span>
                                </a>
                                <a href="https://github.com/Danik-Off/projectvoice" target="_blank" rel="noopener noreferrer" className="social-btn github">
                                    <span className="social-icon">🐙</span>
                                    <span className="social-text">GitHub</span>
                                </a>
                                <a href="https://vk.com/projectvoice" target="_blank" rel="noopener noreferrer" className="social-btn vk">
                                    <span className="social-icon">💙</span>
                                    <span className="social-text">VK</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Футер */}
                <footer className="welcome-footer">
                    <div className="footer-bottom">
                        <p className="copyright">
                            © 2025 ProjectVoice by Danik Off. Создано с ❤️ для геймеров.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default WelcomePage;
