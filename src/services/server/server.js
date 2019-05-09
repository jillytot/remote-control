//Plan to replace sockets.js with this at some point : ]

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { serverPort } = require("../../config/serverSettings");
const jwt = require("express-jwt");

const app = express();
const port = serverPort;

//setup express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//models and routes:
app.use(require("../../routes"));

//run server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
