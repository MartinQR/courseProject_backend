const router = require('express').Router();
const userController = require("../controllers/user.controller");

router.get('/getAll', async (req, res) => {
  try {
    const users = await userController.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getAvailableUsersByQuery", async (req, res) => {
  try {
    const { query } = req.query;

    const users = await userController.getAvailableUsersByQuery(query);
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = await userController.createUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await userController.loginUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const user = await userController.deleteUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const user = await userController.updateUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/updateAdminStatus', async (req, res) => {
  try {
    const user = await userController.updateAdminStatus(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/updateBlockedStatus', async (req, res) => {
  try {
    const user = await userController.updateBlockedStatus(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;