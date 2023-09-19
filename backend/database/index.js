const mysql = require("mysql");
const { eq } = require("lodash");
const bcrypt = require("bcrypt");
const fs = require("fs");

const {
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
    "CREATE TABLE IF NOT EXISTS `users` (	`id` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL,	`password` VARCHAR(255) NOT NULL, `created_at` DATETIME(6) NOT NULL, 	PRIMARY KEY (`id`));",
    queryCallback
  );
};

const initDatabaseConnection = () => {
  con.connect(function (err) {
    if (err) {
      console.log("Failed to connect to mySQL server due to error: ", err);
    }

    console.log("Connected to mySQL server!");

    createTables();
  });
};

module.exports = {
  initDatabaseConnection,
  executeQuery,
  getQueryResult,
};
