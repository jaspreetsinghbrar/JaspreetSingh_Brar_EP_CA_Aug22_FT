module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("Category", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Category.associate = function (models) {
    Category.hasMany(models.Items, {
      foreignKey: {
        name: 'CategoryId',
        allowNull: false 
      },
      onDelete: 'RESTRICT',
      hooks: true
    });
  };

  return Category;
};
