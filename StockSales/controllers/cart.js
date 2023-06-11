const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const db = require("../models/index");

exports.insertCart = async (req, res) => {
  const { item_id, quantity } = req.body;

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const user_id = decodedToken.userId;

  try {
    const [cart, created] = await db.Carts.findOrCreate({
      where: { user_id: user_id },
      defaults: {
        user_id: user_id,
        total_price: 0,
      },
    });

    const { price, stockQuantity } = await db.Items.findOne({
      where: { id: item_id },
    });

    if (!price) {
      return res.status(404).json({ status: "fail", message: "Invalid Item" });
    }

    if (stockQuantity < quantity) {
      return res
        .status(404)
        .json({ status: "fail", message: "Not enough stock" });
    }

    const newItem = {
      item_id: item_id,
      cart_id: cart.cart_id,
      quantity: quantity,
      price: quantity * price,
    };

    const cartItem = await db.CartItems.create(newItem);
    const sum = await db.CartItems.sum("price", {
      where: { cart_id: cart.cart_id },
    });

    cart.total_price = sum || 0;
    await cart.save();

    return res.status(200).json({
      status: "success",
      message: "Cart updated successfully",
      data: cartItem,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ status: "fail", message: "Error Updating Cart", error: error });
  }
};

exports.viewCart = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;

    console.log("userId", userId);
    const Cart = await db.Carts.findOne({
      where: { user_id: userId },
      include: [db.CartItems],
    });

    return res.status(201).json(Cart);
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "Error Retrieving Cart", error: err });
  }
};

exports.viewAllCart = async (req, res) => {
  try {
    const query =
      "SELECT DISTINCT carts.cart_id, users.username, items.name as `cart_items.name`, items.price as `cart_items.price` ,  cart_items.quantity as `cart_items.quantity` FROM carts JOIN users ON carts.user_id = users.id \n \
      JOIN cart_items ON carts.cart_id = cart_items.cart_id JOIN items ON items.id = cart_items.item_id;";

    const Cart = await db.sequelize.query(query, {
      nest: true,
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(201).json(Cart);
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: "Error Retrieving All Cart",
      error: err,
    });
  }
};

exports.editCart = async (req, res) => {
  const { quantity } = req.body;
  const item_id = req.params.id;

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const user_id = decodedToken.userId;

  const { price, stockQuantity } = await db.Items.findOne({
    where: { id: item_id },
  });

  if (stockQuantity < quantity) {
    return res
      .status(404)
      .json({ status: "fail", message: "Not enough stock" });
  }

  db.Carts.findOne({
    where: { user_id: user_id },
  })
    .then(async (cart) => {
      const result = await db.CartItems.update(
        {
          quantity: quantity,
          price: quantity * price,
        },
        {
          where: {
            cart_id: cart.cart_id,
            item_id: item_id,
          },
        }
      );

      if (result[0] !== 1) {
        return res
          .status(404)
          .json({ status: "fail", message: "Cart Item not found" });
      }

      return res
        .status(200)
        .json({ status: "success", message: "Cart Item updated successfully" });
    })
    .catch((error) => {
      return res
        .status(404)
        .json({
          status: "fail",
          message: "Error Updating Cart Item",
          error: error,
        });
    });
};

exports.deleteCartItem = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const user_id = decodedToken.userId;

  const { cart_id } = await db.Carts.findOne({
    where: { user_id: user_id },
  });

  if (!cart_id) {
    return res.status(404).json({
      status: "fail",
      message: "Cart not found",
    });
  }

  db.CartItems.destroy({
    where: {
      item_id: req.params.id,
      cart_id: cart_id,
    },
  })
    .then((result) => {
      if (result === 1) {
        return res
          .status(200)
          .json({
            status: "success",
            message: "Cart Item deleted successfully",
          });
      } else {
        return res.status(404).json({
          status: "fail",
          message: "Cart Item not found",
        });
      }
    })
    .catch((err) => {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Error deleting Cart Item",
          error: err,
        });
    });
};

exports.deleteCart = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const user_id = decodedToken.userId;

  db.Carts.destroy({
    where: { user_id: user_id },
  })
    .then((result) => {
      if (result === 1) {
        return res
          .status(200)
          .json({ status: "success", message: "Cart  deleted successfully" });
      } else {
        return res.status(404).json({
          status: "fail",
          message: "Cart not found",
        });
      }
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ status: "error", message: "Error deleting Cart", error: err });
    });
};
