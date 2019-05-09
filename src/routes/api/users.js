const router = require("express").Router();

//mostly a test
const data = {
  users: ["me", "myself", "and", "I"]
};

router.get("/", (req, res) => {
  const apiData = JSON.stringify(data);
  return res.send(apiData);
});

module.exports = router;
