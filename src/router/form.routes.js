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
    const formId = req.query.id;
    const form = await formController.getFormById(formId);

    return res.json(form);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getFormsByUserId", async (req, res) => {
  try {
    const userId = req.query.userId;
    const forms = await formController.getFormsByUserId(userId);

    return res.json(forms);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getFormComments", async (req, res) => {
  try {
    const formId = req.body.formId;
    const comments = await formController.getFormComments(formId);

    return res.json(comments);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getFormLikesCount", async (req, res) => {
  try {
    const formId = req.body.formId;
    const likesCount = await formController.getFormLikesCount(formId);

    return res.json(likesCount);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/likeForm", async (req, res) => {
  try {
    const { userId, formId } = req.body;
    const like = await formController.likeForm({ userId, formId });

    return res.json(like);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/unlikeForm", async (req, res) => {
  try {
    const { userId, formId } = req.body;
    const like = await formController.unlikeForm({ userId, formId });

    return res.json(like);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/commentForm", async (req, res) => {
  try {
    const { userId, formId, content } = req.body;
    const comment = await formController.commentForm({ userId, formId, content });

    return res.json(comment);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;