module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: [3, 25],
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [6, 100],
                },
            },
            profilePicture: {
                type: DataTypes.STRING,
                allowNull: true, // Можно изменить на false, если поле обязательно
            },
            bio: {
                type: DataTypes.TEXT,
                allowNull: true, // Можно изменить на false, если поле обязательно
            },
        },
        {
            timestamps: true,
        }
    );


    User.associate = (models) => {
        User.hasMany(models.ServerMember, { foreignKey: 'userId', as: 'serverMembers' }); // Пользователь может быть участником множества серверов
    };
    
    return User;
};
