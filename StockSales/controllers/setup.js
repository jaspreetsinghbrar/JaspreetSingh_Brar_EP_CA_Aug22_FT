const db = require("../models/index");
const axios = require("axios");
const bcrypt = require("bcrypt");

exports.setup = async (req, res) => {

  const itemCount = await db.Items.count();

  if (!itemCount) {
    axios
      .get("http://143.42.108.232:8888/items/stock")
      .then((response) => response.data.data)
      .then(async (data) => {
        // Process the data returned from the API
        const categories = [...new Set(data.map((item) => item.category))];
        const mappedCategories = categories.map((category) => ({
          name: category,
        }));

        db.Category.bulkCreate(mappedCategories)
          .then(() => {
            console.log("records inserted successfully.");
          })
          .catch((error) => {
            console.error("Error inserting records:", error);
          });

        data.forEach(async (el) => {
          const { id } = await db.Category.findOne({
            where: { name: el.category },
          });
          await db.Items.create({
            name: el.item_name,
            sku: el.sku,
            price: el.price,
            CategoryId: id,
            stockQuantity: el.stock_quantity,
          });
        });

        db.Role.bulkCreate([
          { name: 'Admin' },
          { name: 'Registered' },
          { name: 'Guest' }
        ])
          .then(() => {
            console.log('records inserted successfully.');
          })
          .catch((error) => {
            console.error('Error inserting records:', error);
          });
      
        bcrypt.genSalt(10).then((salt) => {
          bcrypt.hash("P@ssword2023", salt).then((hashedPassword) => {
            db.User.create({
              username: "Admin",
              email: "admin@admin.io",
              RoleId: 1,
              encryptedPassword: hashedPassword,
              salt: salt,
            })
              .then(() => {
                console.log("records inserted successfully.");
              })
              .catch((error) => {
                console.error("Error inserting records:", error);
              });
          });
        });

        return res.status(200).json({
          status: "success",
          data: "Setup successful",
        });
      })
      .catch((error) => {
        // Handle any errors that occur during the API call
        return res.status(401).json({
          status: "fail",
          error: error,
        });
      });
  } else {
    return res.status(400).json({
      status: "fail",
      message: "Items table is not empty",
    });
  }

  //   return res.status(200).json({
  //     status: "fail",
  //     message: "Item table not empty",
  //   });
};
