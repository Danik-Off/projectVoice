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
            role: {
                type: DataTypes.ENUM('user', 'moderator', 'admin'),
                allowNull: false,
                defaultValue: 'user',
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            profilePicture: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            tag:{
                type:DataTypes.TEXT,
                allowNull: true,
            }
        },
        {
            timestamps: true,
        }
    );

    User.associate = (models) => {
        User.hasMany(models.ServerMember, {
            foreignKey: 'userId',
            as: 'serverMembers',
        });
        User.belongsToMany(models.Server, {
            through: models.ServerMember,
            foreignKey: 'userId',
            otherKey: 'serverId',
            as: 'servers',
        });
    };

    return User;
};
