const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const db = require("../models/index");
const { where } = require("sequelize");

exports.insertOrder = async (req, res) => {
  // const { item_id, quantity } = req.body;
  const item_id = req.params.id;

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const user_id = decodedToken.userId;

  try {
    const order = await db.Orders.create({
      user_id: user_id,
      total_price: 0,
    });

    const cart = await db.Carts.findOne({
      where: { user_id: user_id },
    });

    if (!cart) {
      return res
        .status(404)
        .json({ status: "fail", message: "User has no cart items." });
    }

    const item = await db.CartItems.findOne({
      where: { item_id: item_id, cart_id: cart.cart_id },
    });

    const { stockQuantity } = await db.Items.findOne({
      where: { id: item_id },
    });

    if (!item) {
      return res.status(404).json({ status: "fail", message: "Invalid Item" });
    }

    console.log();
    if (stockQuantity < item.quantity) {
      return res
        .status(404)
        .json({ status: "fail", message: "Not enough stock" });
    }

    const user = await db.User.findOne({ where: { id: user_id } });
    const userCount = await db.User.count({ where: { email: user.email } });

    const discount = 1;

    if (userCount == 2) {
      discount = 0.9;
    } else if (userCount == 3) {
      discount = 0.7;
    } else if (userCount == 4) {
      discount = 0.6;
    }

    const newItem = {
      item_id: item_id,
      order_id: order.order_id,
      quantity: item.quantity,
      status: "inProgress",
      price: item.price * discount,
    };

    const orderItem = await db.OrderItems.create(newItem);
    // const sum = await db.OrderItems.sum("price", {
    //   where: { order_id: order.order_id },
    // });

    // order.total_price = sum || 0;
    // await order.save();

    await db.Items.update(
      {
        stockQuantity: item.stockQuantity - item.quantity,
      },
      {
        where: {
          id: item_id,
        },
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Order created successfully",
      data: orderItem,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ status: "fail", message: "Error creating order", error: error });
  }
};

exports.viewOrder = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;

    const Order = await db.Orders.findOne({
      where: { user_id: userId },
      include: [
        {
          model: db.OrderItems,
          where: { status: "Complete" },
        },
      ],
    });

    return res.status(201).json(Order);
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "Error Retrieving Order", error: err });
  }
};

exports.viewAllOrders = async (req, res) => {
  try {
    const query =
      "SELECT DISTINCT orders.order_id, users.username, items.name as `order_items.name`, items.price as `order_items.price` ,  order_items.quantity as `order_items.quantity` FROM orders JOIN users ON orders.user_id = users.id \n \
      JOIN order_items ON orders.order_id = order_items.order_id JOIN items ON items.id = order_items.item_id;";

    const Order = await db.sequelize.query(query, {
      nest: true,
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(201).json(Order);
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: "Error Retrieving All Orders",
      error: err,
    });
  }
};

exports.editOrder = async (req, res) => {
  const { status } = req.body;
  const order_id = req.params.id;

  try {
    const result = await db.OrderItems.update(
      {
        status: status,
      },
      {
        where: {
          order_id: order_id,
        },
      }
    );

    if (result[0] !== 1) {
      return res
        .status(404)
        .json({ status: "fail", message: "Order not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Order updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Error updating order",
      error: error,
    });
  }
};
