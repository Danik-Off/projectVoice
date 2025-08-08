const bcrypt = require('bcryptjs');
const { User } = require('./models');

async function createAdminUser() {
    try {
        console.log('🔧 Создание админской учетной записи...\n');

        // Проверяем, существует ли уже админ
        const existingAdmin = await User.findOne({ 
            where: { email: 'admin@projectvoice.com' } 
        });

        if (existingAdmin) {
            console.log('✅ Админская учетная запись уже существует:');
            console.log(`   Email: ${existingAdmin.email}`);
            console.log(`   Username: ${existingAdmin.username}`);
            console.log(`   Role: ${existingAdmin.role}`);
            console.log(`   Active: ${existingAdmin.isActive}`);
        } else {
            console.log('❌ Админская учетная запись не найдена');
        }

        // Создаем дополнительную админскую учетную запись
        const adminData = {
            username: 'superadmin',
            email: 'superadmin@projectvoice.com',
            password: await bcrypt.hash('admin123', 10),
            role: 'admin',
            isActive: true
        };

        const newAdmin = await User.create(adminData);
        
        console.log('\n✅ Создана дополнительная админская учетная запись:');
        console.log(`   Email: ${newAdmin.email}`);
        console.log(`   Username: ${newAdmin.username}`);
        console.log(`   Password: admin123`);
        console.log(`   Role: ${newAdmin.role}`);

        console.log('\n📋 Все админские учетные записи:');
        const allAdmins = await User.findAll({ 
            where: { role: 'admin' },
            attributes: ['id', 'username', 'email', 'role', 'isActive']
        });
        
        allAdmins.forEach((admin, index) => {
            console.log(`   ${index + 1}. ${admin.username} (${admin.email}) - ${admin.isActive ? 'Active' : 'Inactive'}`);
        });

    } catch (error) {
        console.error('❌ Ошибка при создании админской учетной записи:', error);
    }
}

// Запускаем создание админа
createAdminUser();
