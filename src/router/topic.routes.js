const router = require('express').Router();
const topicController = require("../controllers/topic.controller");

router.post('/create', async (req, res) => {
  try {
    const topic = await topicController.createTopic(req.body);
    res.json(topic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/getAll', async (req, res) => {
  try {
    const topics = await topicController.getAllTopics();
    res.json(topics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;