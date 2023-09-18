const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getQueryResult } = require("../database");
const { genOrderReadyEmailCopy } = require("../modules/checkout");
const { SECRET_KEY, ONE_DAY } = require("../modules/constants");
const { sendEmail } = require("../modules/email");
const { sendTextMessage } = require("../modules/text_message");
const { generateRandomID } = require("../modules/utils");

const loginRoute = async (req, res) => {
  const result = await getQueryResult(
    `SELECT id, password FROM admin_users WHERE username = "${req.body.username}"`
  );
  if (!result[0]) return res.send(null);

  const validPass = await bcrypt.compare(req.body.password, result[0].password);
  if (!validPass) return res.send(null);

  const token = jwt.sign({ id: result[0].id, time: Date.now() }, SECRET_KEY);
  res.header("auth-token", token).send(token);
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

const getUserObjectRoute = (req, res) => {
  verifyCallback(req, res, async () => {
    const token = req.header("auth-token");
    const { id } = jwt.decode(token, SECRET_KEY);

    const result = await getQueryResult(
      `SELECT id, username FROM admin_users WHERE id = "${id}"`
    );
    if (!result[0]) return res.status(400).send("User not found");

    res.send(result[0]);
  });
};

const getMenusRoute = (req, res) => {
  verifyCallback(req, res, async () => {
    const result = await getQueryResult(`SELECT * FROM menus`);

    res.send(result);
  });
};

const getMenuRoute = (req, res) => {
  verifyCallback(req, res, async () => {
    const { id } = req.body;

    const result = await getQueryResult(`SELECT * FROM menus WHERE id = ${id}`);

    res.send(result[0] ?? null);
  });
};

const addMenuRoute = (req, res) => {
  verifyCallback(req, res, async () => {
    const { name } = req.body;

    const id = generateRandomID(3);

    await getQueryResult(`
      INSERT INTO menus (id, name, created_at, published) 
      VALUES (${id}, "${name}", "${new Date()
      .toJSON()
      .slice(0, 19)
      .replace("T", " ")}", ${false})`);

    const result2 = await getQueryResult(
      `SELECT * FROM menus WHERE id = "${id}"`
    );

    res.status(200).send(result2[0]);
  });
};

const updateMenuRoute = (req, res) => {
  verifyCallback(req, res, async () => {
    const { id, name, published } = req.body;

    await getQueryResult(`
      UPDATE menus SET name="${name}", published=${published}
      WHERE id = ${id}
    `);

    res.send({});
  });
};

const deleteMenuRoute = (req, res) => {
  verifyCallback(req, res, async () => {
    const { id } = req.body;

    await getQueryResult(`
      DELETE FROM menus WHERE id = ${id}
    `);

    res.send(200);
  });
};

const getMenuItemsRoute = (req, res) => {
  verifyCallback(req, res, async () => {
    const { menu_id } = req.body;
    const result = await getQueryResult(
      `SELECT * FROM items WHERE menu_id = "${menu_id}"`
    );
    if (!result[0]) return res.status(200).send([]);

    res.send(result);
  });
};

const addMenuItemRoute = (req, res) => {
  verifyCallback(req, res, async () => {
    const { menu_id, name, description, price } = req.body;

    const result1 = await getQueryResult(
      `SELECT COUNT(*) AS count FROM menus WHERE id = "${menu_id}"`
    );

    if (result1[0] && result1[0].count) {
      const id = generateRandomID(4);

      await getQueryResult(`
        INSERT INTO items (id, menu_id, name, description, price, created_at)
        VALUES (${id}, ${menu_id}, "${name}", "${description}", ${price}, "${new Date()
        .toJSON()
        .slice(0, 19)
        .replace("T", " ")}")`);

      const result2 = await getQueryResult(
        `SELECT * FROM items WHERE id = "${id}"`
      );

      res.status(200).send(result2[0]);
    } else {
      return res.status(400).send("No Menu with this id Found");
    }
  });
};

const updateMenuItemRoute = (req, res) => {
  verifyCallback(req, res, async () => {
    const { id, name, menu_id, description, price, published } = req.body;

    const result1 = await getQueryResult(
      `SELECT COUNT(*) AS count FROM menus WHERE id = "${menu_id}"`
    );

    if (result1[0] && result1[0].count) {
      await getQueryResult(`
        UPDATE items SET name = "${name}", description = "${description}", price = "${price}", published = "${published}" 
        WHERE id = "${id}"`);

      res.send(200);
    } else {
      return res.status(400).send("No Menu with this id Found");
    }
  });
};

const deleteMenuItemRoute = (req, res) => {
  verifyCallback(req, res, async () => {
    const { id } = req.body;

    await getQueryResult(`
      DELETE FROM items WHERE id = ${id}
    `);

    res.sendStatus(200);
  });
};

const getOrdersRoute = (req, res) => {
  verifyCallback(req, res, async () => {
    const result = await getQueryResult(`SELECT * FROM orders`);
    if (!result[0]) return res.status(200).send([]);

    res.send(result);
  });
};

const updateOrderRoute = (req, res) => {
  verifyCallback(req, res, async () => {
    const { id, fulfilled, email, phone } = req.body;

    await getQueryResult(`
        UPDATE orders SET fulfilled = "${fulfilled}" 
        WHERE id = "${id}"`);

    const subject = `Your Order (${id}) is ready for Pickup!`;

    sendEmail(email, subject, genOrderReadyEmailCopy(id));

    sendTextMessage(phone, subject);

    res.json({});
  });
};

const deleteOrderRoute = (req, res) => {
  verifyCallback(req, res, async () => {
    const { id } = req.body;

    await getQueryResult(`
      DELETE FROM orders WHERE id = ${id}
    `);

    res.send(200);
  });
};

const bind = (app) => {
  app.post("/admin/login", loginRoute);

  app.get("/admin/get-user", getUserObjectRoute);

  app.get("/admin/get-menus", getMenusRoute);

  app.post("/admin/get-menu", getMenuRoute);

  app.post("/admin/add-menu", addMenuRoute);

  app.post("/admin/update-menu", updateMenuRoute);

  app.post("/admin/delete-menu", deleteMenuRoute);

  app.post("/admin/get-menu-items", getMenuItemsRoute);

  app.post("/admin/add-menu-item", addMenuItemRoute);

  app.post("/admin/update-menu-item", updateMenuItemRoute);

  app.post("/admin/delete-menu-item", deleteMenuItemRoute);

  app.get("/admin/get-orders", getOrdersRoute);

  app.post("/admin/update-order", updateOrderRoute);

  app.post("/admin/delete-order", deleteOrderRoute);
};

module.exports = { bind };
