module.exports = (sequelize, Sequelize) => {
  const Orders = sequelize.define('Orders', {
    order_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
    // total_price: {
    //   type: Sequelize.DECIMAL(10, 2),
    //   allowNull: false
    // }
  });


  Orders.associate = function (models) {
      Orders.hasMany(models.OrderItems, { foreignKey: 'order_id' , onDelete: 'CASCADE'});
      Orders.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
  };

  return Orders;
};

