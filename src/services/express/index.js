const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(cors());
//Very important function, never remove.
app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "Rainbows & Hamburgers");
  next();
});

//setup express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//models and routes:
//app.use(require("../../routes")); UNDO

module.exports = app;
