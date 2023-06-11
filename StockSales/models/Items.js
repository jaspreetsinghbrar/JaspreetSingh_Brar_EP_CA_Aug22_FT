module.exports = (sequelize, Sequelize) => {
  const Items = sequelize.define('Items', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    stockQuantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    sku: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });


  Items.associate = function (models) {
    Items.belongsTo(models.Category, {
      foreignKey: {
        name: 'CategoryId',
        allowNull: false 
      },
    });
    Items.hasMany(models.OrderItems, {
      foreignKey: 'item_id',
      onDelete: 'CASCADE',
    });
    Items.hasMany(models.CartItems, {
      foreignKey: 'item_id',
      onDelete: 'CASCADE',
    });
  };

  return Items;
};

