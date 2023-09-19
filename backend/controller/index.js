const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getQueryResult } = require("../database");
const { SECRET_KEY, ONE_DAY } = require("../modules/constants");
const { generateRandomID, getCurDate } = require("../modules/utils");

const loginRoute = async (req, res) => {
  const result = await getQueryResult(
    `SELECT id, password FROM users WHERE email = "${req.body.email}"`
  );
  if (!result[0]) return res.send({ message: "invalid email/password" });

  const validPass = await bcrypt.compare(req.body.password, result[0].password);
  if (!validPass) return res.send({ message: "invalid email/password" });

  const token = jwt.sign({ id: result[0].id, time: Date.now() }, SECRET_KEY);
  res.header("auth-token", token).send({ token: token });
};

const registerRoute = async (req, res) => {
  const { email, password } = req.body;

  const search = await getQueryResult(
    `SELECT * FROM users WHERE email = "${email}"`
  );

  if (search[0]) {
    res
      .status(200)
      .send({ message: "An account with this email already exists" });
  } else {
    const id = generateRandomID();
    const passToSave = await bcrypt.hashSync(password, 10);

    await getQueryResult(`
      INSERT INTO users (id, email, password, created_at)
      VALUES ("${id}", "${email}", "${passToSave}", "${getCurDate()}")`);

    const token = jwt.sign({ id: id, time: Date.now() }, SECRET_KEY);
    res.header("auth-token", token).send({ token: token });
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
