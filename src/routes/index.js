const router = require("express").Router();

//Routing Test
router.get("/", (req, res) => {
  res.status(200).json({ greeting: "Oh hi there." });
});

router.use(`/api/dev`, require("./api"));

module.exports = router;
