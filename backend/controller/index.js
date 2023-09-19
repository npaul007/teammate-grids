const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getQueryResult } = require("../database");
const { SECRET_KEY, ONE_DAY } = require("../modules/constants");
const { generateRandomID } = require("../modules/utils");

const loginRoute = async (req, res) => {
  const result = await getQueryResult(
    `SELECT id, password FROM users WHERE email = "${req.body.email}"`
  );
  if (!result[0]) return res.send(null);

  const validPass = await bcrypt.compare(req.body.password, result[0].password);
  if (!validPass) return res.send(null);

  const token = jwt.sign({ id: result[0].id, time: Date.now() }, SECRET_KEY);
  res.header("auth-token", token).send(token);
};

const registerRoute = async (req, res) => {
  const { email, password } = req.body;

  const search = await getQueryResult(
    `SELECT * FROM users WHERE email = "${email}"`
  );

  if (search[0]) {
    res
      .status(400)
      .send({ message: "An account with this email already exists" });
  } else {
    await getQueryResult(`
      INSERT INTO users (id, email, password, created_at)
      VALUES (${generateRandomID}, ${email}, "${password}", "${new Date()
      .toJSON()
      .slice(0, 19)
      .replace("T", " ")}")`);
    return res.status(200).send({});
  }
};

const verifyCallback = (req, res, _callback) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const { time } = jwt.verify(token, SECRET_KEY);

    if (Date.now() - time < ONE_DAY) {
      _callback();
    } else {
      return res.status(401).send("Token expired");
    }
  } catch (err) {
    console.log("Encountered error", err);
    res.status(401).send(err);
  }
};

const bind = (app) => {
  app.post("/login", loginRoute);

  app.post("/register", registerRoute);
};

module.exports = { bind };
