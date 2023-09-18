const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const { initDatabaseConnection } = require("./database");
const { PORT } = require("./modules/constants");

app.use(bodyParser.json());
app.use(cors());

require("./controller/adminController").bind(app);

app.listen(PORT, () => {
  try {
    console.log(`Server started on port ${PORT}`);

    initDatabaseConnection();
    initTransporter();
    initTextClient();
  } catch (err) {
    console.log("Server encountered error: ", err);
  }
});
