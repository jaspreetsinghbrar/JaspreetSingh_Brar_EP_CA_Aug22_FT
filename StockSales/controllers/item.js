const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const db = require("../models/index");
const { Op } = require("sequelize");

exports.insertItem = async (req, res) => {
  const { name, sku, price, stockQuantity, categoryId } = req.body;

  try {
    const Item = await db.Items.create({
      name: name,
      price: price,
      stockQuantity: stockQuantity,
      sku: sku,
      CategoryId: categoryId,
    });

    return res.status(201).json(Item);
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "Error creating item", error: err });
  }
};

exports.editItem = async (req, res) => {
  const { name, price, stockQuantity, categoryId } = req.body;
  const id = req.params.id;

  try {
    const result = await db.Items.update(
      {
        name: name,
        price: price,
        stockQuantity: stockQuantity,
        CategoryId: categoryId,
      },
      {
        where: {
          id: id,
        },
      }
    );

    console.log("result", result[0]);
    if (result[0] !== 1) {
      return res
        .status(404)
        .json({ status: "fail", message: "Item not found" });
    }

    return res
      .status(200)
      .json({ status: "success", message: "Item updated successfully" });
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "Error updating item", error: err });
  }
};

exports.viewItems = async (req, res) => {
  try {
    const Items = await db.Items.findAll({
      where: { stockQuantity: { [Op.gt]: 0 } },
      include: [
        {
          model: db.Category,
          attributes: ["name"],
        },
      ],
    });

    return res.status(201).json(Items);
  } catch (err) {
    return res
      .status(400)
      .json({ status: "error", message: "Error Retrieving items", error: err });
  }
};

exports.deleteItem = async (req, res) => {
  db.Items.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((result) => {
      if (result === 1) {
        return res
          .status(200)
          .json({ status: "success", message: "Item deleted successfully" });
      } else {
        return res.status(404).json({
          status: "fail",
          message: "Item not found or user does not have permission",
        });
      }
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ status: "error", message: "Error deleting todo", error: err });
    });
};
