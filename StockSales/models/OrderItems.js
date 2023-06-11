module.exports = (sequelize, Sequelize) => {
  const OrderItems = sequelize.define('OrderItems', {
    item_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });


  OrderItems.associate = function (models) {
    OrderItems.belongsTo(models.Orders, { foreignKey: 'order_id' , onDelete: 'CASCADE'});
    OrderItems.belongsTo(models.Items, {
      foreignKey: 'item_id',
    });
  };

  return OrderItems;
};

