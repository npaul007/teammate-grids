const mysql = require("mysql");
const { eq } = require("lodash");
const bcrypt = require("bcrypt");
const fs = require("fs");

const {
  ADMIN_PASSWORD,
  DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_SSL,
} = require("../modules/constants");

let sqlConfigs = {
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
};

if (JSON.parse(DATABASE_SSL)) {
  sqlConfigs["ssl"] = {
    ca: fs.readFileSync(__dirname + "/certs/DigiCertGlobalRootCA.crt.pem"),
  };
}

const con = mysql.createConnection(sqlConfigs);

const executeQuery = (query, _callback) => {
  con.query(query, _callback);
};

const queryCallback = (error, result) => {
  if (error) {
    console.log("Failed to run sql query due to error: ", error);
  } else {
    console.log("Query executed successfully:", result);
  }
};

const getQueryResult = (query) => {
  return new Promise((resolve, reject) => {
    executeQuery(query, (error, result) => {
      if (error) {
        reject("Failed to run sql query due to error: " + error);
      } else {
        resolve(result);
      }
    });
  });
};

const createTables = () => {
  executeQuery(
    "CREATE TABLE IF NOT EXISTS `users` (	`id` INT(255) NOT NULL, `email` VARCHAR(255) NOT NULL,	`password` VARCHAR(255) NOT NULL, `created_at` DATETIME(6) NOT NULL, 	PRIMARY KEY (`id`));",
    queryCallback
  );

  executeQuery(
    "CREATE TABLE IF NOT EXISTS`orders` (	`id` VARCHAR(255) NOT NULL,	`email` VARCHAR(255) NOT NULL,	`total` FLOAT NOT NULL,	`subtotal` FLOAT NOT NULL,	`items` LONGTEXT NOT NULL,	`created_at` DATETIME(6) NOT NULL,	`phone` VARCHAR(255),	`fulfilled` TINYINT(1) DEFAULT '0',	PRIMARY KEY (`id`));",
    queryCallback
  );

  executeQuery(
    "CREATE TABLE IF NOT EXISTS`menus` (	`id` INT(255) NOT NULL,	`name` VARCHAR(255) NOT NULL, `created_at` DATETIME(6) NOT NULL, `published` TINYINT(1) DEFAULT '0',	PRIMARY KEY (`id`));",
    queryCallback
  );

  executeQuery(
    "CREATE TABLE IF NOT EXISTS `items` (	`id` INT(255) NOT NULL,`menu_id` INT(255) NOT NULL,	`name` VARCHAR(255) NOT NULL, `description` VARCHAR(255) NOT NULL, `price` FLOAT NOT NULL, `created_at` DATETIME(6) NOT NULL,	PRIMARY KEY (`id`));",
    queryCallback
  );
};

const addAdminUser = () => {
  executeQuery(
    "SELECT COUNT(*) AS count FROM `admin_users` ",
    async (error, result) => {
      if (error) {
        console.log("Failed to run sql query due to error: ", error);
      } else {
        if (result[0]) {
          const { count } = result[0];
          if (eq(count, 0)) {
            const password = await bcrypt.hashSync(ADMIN_PASSWORD, 10);

            executeQuery(
              `INSERT INTO admin_users (id, email, username, password, created_at) 
                VALUES (1,"admin@bonzanmi.com", "admin", "${password}" , "${
                new Date().toISOString().split("T")[0]
              }");`,
              queryCallback
            );
          }
        }
        console.log("Query executed successfully:", result);
      }
    }
  );
};

const initDatabaseConnection = () => {
  con.connect(function (err) {
    if (err) {
      console.log("Failed to connect to mySQL server due to error: ", err);
    }

    console.log("Connected to mySQL server!");

    createTables();
    addAdminUser();
  });
};

module.exports = {
  initDatabaseConnection,
  executeQuery,
  getQueryResult,
};
