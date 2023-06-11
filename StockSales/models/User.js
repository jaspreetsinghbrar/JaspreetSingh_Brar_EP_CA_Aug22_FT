const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    username: {
      type: Sequelize.DataTypes.STRING,

      allowNull: false,
      unique: true,
    },

    email: {
      type: Sequelize.DataTypes.STRING,

      allowNull: false,
    },

    encryptedPassword: {
      type: Sequelize.DataTypes.BLOB,

      allowNull: false,
    },

    salt: {
      type: Sequelize.DataTypes.BLOB,

      allowNull: false,
    },
    created_at: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    updated_at: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
  });

  User.associate = function (models) {
    User.belongsTo(models.Role);
    User.hasOne(models.Carts, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };


  return User;
};
