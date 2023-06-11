module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define('Role', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  });

  Role.associate = function (models) {
    Role.hasMany(models.User);
  };


  return Role;
};

