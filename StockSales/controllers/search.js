const db = require("../models/index");
const axios = require("axios");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

exports.search = async (req, res) => {
  const { type, keyword, categoryName } = req.body;
  if (type === "item") {
    const items = await db.Items.findAll({
      where: {
        name: {
          [Op.like]: `%${keyword}%`,
        },
      },
    });
    return res.status(200).json(items);
  }

  if (type === "item_category") {
    const category = await db.Category.findOne({
      where: {
        name: categoryName,
      },
    });

    if (!category) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid Category" });
    }

    const items = await db.Items.findAll({
      where: {
        name: {
          [Op.like]: `%${keyword}%`,
        },
        CategoryId: category.id,
      },
    });
    return res.status(200).json(items);
  }

  if (type === "product_code") {
    const items = await db.Items.findOne({
      where: {
        sku: keyword,
      },
    });
    return res.status(200).json(items);
  }

  if (type === "category") {
    const category = await db.Category.findOne({
      where: {
        name: keyword,
      },
    });

    if (!category) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid Category" });
    }

    const items = await db.Items.findAll({
      where: {
        CategoryId: category.id,
      },
    });

    return res.status(200).json(items);
  }

  return res.status(404).json({ message: "No Data" });
};
