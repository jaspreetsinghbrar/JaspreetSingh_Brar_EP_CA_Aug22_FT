const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.ADMIN_USERNAME,
  process.env.ADMIN_PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    define: {
      timestamps: true, // Enable timestamps
      underscored: true, // Use snake_case for table and column names
    },
  }
);
const db = {};
db.sequelize = sequelize;
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });
Object.keys(db).forEach((modelName) => {
  console.log(modelName);
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// sequelize
//   .query(`CREATE USER 'admin'@'localhost' IDENTIFIED BY 'P@ssw0rd';`)
//   .then(() => {
//     console.log("User created successfully.");
//     return sequelize.query(
//       `GRANT ALL PRIVILEGES ON database_name.* TO 'admin'@'localhost';`
//     );
//   })
//   .then(() => {
//     console.log("Privileges granted successfully.");
//   })
//   .catch((error) => {
//     console.error("Error executing SQL script:", error);
//   });

module.exports = db;
