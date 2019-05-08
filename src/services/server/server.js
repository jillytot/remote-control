const express = require("express");
const path = require("path");
//const db = require("../db/db");
const { serverPort } = require("../../config/serverSettings");

const app = express();
const port = serverPort;

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.post("/", (req, res) => {
  res.send("Got a POST request");
});
