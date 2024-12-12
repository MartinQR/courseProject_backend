const router = require('express').Router();
const formController = require("../controllers/form.controller");

router.post("/create", async (req, res) => {
  try {
    const form = await formController.createForm(req.body);

    return res.json(form);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getFormById", async (req, res) => {
  try {
    const formId = req.body.id;
    const form = await formController.getFormById(formId);

    return res.json(form);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getFormByUserId", async (req, res) => {
  try {
    const userId = req.body.userId;
    const forms = await formController.getFormByUserId(userId);

    return res.json(forms);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;