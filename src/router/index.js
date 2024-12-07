const router = require('express').Router();
const userController = require("../controllers/user.controller");

router.get('/router', (req, res) => {
  res.send('router');
});

router.get('/user', async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user", async (req, res) => {

  try {
    const user = await userController.createUser(req.body)

    return res.json(user);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }

});





module.exports = router;