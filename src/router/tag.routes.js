const router = require('express').Router();
const tagController = require("../controllers/tag.controller");

router.post('/create', async (req, res) => {
  try {
    const tag = await tagController.createTag(req.body);
    res.json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/getAll', async (req, res) => {
  try {
    const tags = await tagController.getAllTags();
    res.json(tags);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;