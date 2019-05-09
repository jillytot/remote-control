const express = require("express");
const router = express.Router();
const apiVersion = "v0";

router.use(`/api/${apiVersion}`, require("./api"));

module.exports = router;
