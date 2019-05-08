//Plan to replace sockets.js with this at some point : ]

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { serverPort } = require("../../config/serverSettings");
const jwt = require("express-jwt");

const app = express();
const port = serverPort;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//models and routes:
app.use(require("../../routes"));

// app.get("/", (req, res) => res.send("Hello World!"));

// app.post("/signup", (req, res) => {
//   res.send("Got a POST ... maybe");
// });

// app.get("/protected", jwt({ secret: "shhhhhhared-secret" }), (req, res) => {
//   if (!req.user.admin) return res.sendStatus(401);
//   res.sendStatus(200);
// });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
