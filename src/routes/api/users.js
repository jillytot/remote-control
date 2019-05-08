const router = require("express").Router();

const data = {
  users: ["me", "myself", "and", "I"]
};

router.get("/", (req, res) => {
  const apiData = JSON.stringify(data);
  return res.send(apiData);
});

module.exports = router;
