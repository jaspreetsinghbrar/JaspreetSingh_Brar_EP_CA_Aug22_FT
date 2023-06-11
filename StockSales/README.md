# REST API - Course Assignment

# Application Installation and Usage Instructions

change the env variables if its needed

A MySQL Database called “StockSalesDB” is to be created for this web application.
Use the following SQL script to create an “admin” Database User with all database privileges:
CREATE USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';
ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';
GRANT ALL PRIVILEGES ON database_name.\* TO 'admin'@'localhost'

To run the app navigate to the folder StockSales and run the following commands

npm install
npm start
npm run test - to run test cases (**tests**/Todos.test.js)

# Environment Variables

HOST = "localhost"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "P@ssw0rd"
DATABASE_NAME = "StockSalesDB"
DIALECT = "mysql"
PORT = "3000"
TOKEN_SECRET='V8Z4H4pOj3qB61Xb1K94F3rNpP3oqPf6GZU6ml1L6b2fzR1M9X'

# Additional Libraries/Packages

    "supertest": "^6.3.3"
    "jest": "^29.5.0",
    "bcrypt": "^5.1.0",

# NodeJS Version Used

v16.16.0

# POSTMAN Documentation link

https://documenter.getpostman.com/view/25399698/2s93sc4CKp
