module.exports = (sequelize, Sequelize) => {
  const CartItems = sequelize.define('CartItems', {
    item_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cart_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  });


  CartItems.associate = function (models) {
    CartItems.belongsTo(models.Carts, { foreignKey: 'cart_id' , onDelete: 'CASCADE'});
    CartItems.belongsTo(models.Items, {
      foreignKey: 'item_id',
    });
  };

  return CartItems;
};

