const router = require('express').Router();
const jiraController = require("../controllers/jira.controller");

router.post('/createAccount', async (req, res) => {

  const { email } = req.body;
  try {
    const tag = await jiraController.createAccount(email);
    res.json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/getAccesToken', async (req, res) => {
  try {
    const tag = await jiraController.getAccesToken(req.body);
    res.json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getUserAccountId", async (req, res) => {
  try {
    const { email } = req.query;
    const tags = await jiraController.getUserAccountId(email);
    res.json(tags);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/createIssue", async (req, res) => {
  try {
    const tags = await jiraController.createIssue(req.body);
    res.json(tags);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/getIssuesCreatedByUser", async (req, res) => {
  try {
    const { email } = req.query;
    const tags = await jiraController.getIssuesCreatedByUser(email);
    res.json(tags);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;