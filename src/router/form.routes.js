const router = require('express').Router();
const formController = require("../controllers/form.controller");
const formResponseController = require("../controllers/formResponse.controller");

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

router.get("/getLastFivePublicForms", async (req, res) => {
  try {
    const forms = await formController.getLastFivePublicForms();

    return res.json(forms);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/filloutForm", async (req, res) => {
  try {
    const { userId, formId, answers } = req.body;
    const response = await formResponseController.filloutForm({ userId, formId, answers });

    return res.json(response);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getFilledOutFormByUserId", async (req, res) => {
  try {
    const { userId, formId } = req.query;
    const forms = await formController.getFilledOutFormByUserId({ userId, formId });

    return res.json(forms);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getAllFilledOutFormsByUserId", async (req, res) => {
  try {
    const userId = req.query.userId;
    const forms = await formController.getAllFilledOutFormsByUserId(userId);

    return res.json(forms);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;