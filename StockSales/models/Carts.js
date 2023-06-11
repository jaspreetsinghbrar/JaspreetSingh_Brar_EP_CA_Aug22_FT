module.exports = (sequelize, Sequelize) => {
  const Carts = sequelize.define('Carts', {
    cart_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    total_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  });


  Carts.associate = function (models) {
    Carts.hasMany(models.CartItems, { foreignKey: 'cart_id' , onDelete: 'CASCADE' });
    Carts.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
  };

  return Carts;
};

