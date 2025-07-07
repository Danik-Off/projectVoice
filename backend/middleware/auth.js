const jwt = require('jsonwebtoken');

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
    console.log('🔐 Аутентификация запроса:', req.method, req.url);
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('❌ Токен не предоставлен');
        return res.status(401).json({ error: 'Токен не предоставлен.' });
    }

    console.log('🔑 Токен получен, проверяем...');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('❌ Недействительный токен:', err.message);
            return res.status(403).json({ error: 'Недействительный токен.' });
        }
        
        console.log('✅ Токен валиден, пользователь:', user);
        
        // Преобразуем userId в id для совместимости
        req.user = {
            ...user,
            id: user.userId
        };
        next();
    });
};

module.exports = { authenticateToken };
