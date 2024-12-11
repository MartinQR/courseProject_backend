const router = require('express').Router();
const userController = require("../controllers/user.controller");
const formController = require("../controllers/form.controller");

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

router.post("/login", async (req, res) => {
  try {
    const user = await userController.loginUser(req.body);

    return res.json(user);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/form", async (req, res) => {
  try {
    const form = await formController.createForm(req.body);

    return res.json(form);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/formById", async (req, res) => {
  try {
    const formId = req.body.id;
    const form = await formController.getFormById(formId);

    return res.json(form);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/formByUserId", async (req, res) => {
  try {
    const userId = req.body.userId;
    const forms = await formController.getFormByUserId(userId);

    return res.json(forms);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;