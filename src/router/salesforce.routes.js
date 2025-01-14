const router = require('express').Router();
const salesforceController = require("../controllers/salesforce.controller");

router.get('/getAccesToken', async (req, res) => {
  try {
    const tag = await salesforceController.getAccesToken(req.body);
    res.json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/createAccountAndContact', async (req, res) => {
  try {
    const tags = await salesforceController.createAccountAndContact(req.body);
    res.json(tags);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;