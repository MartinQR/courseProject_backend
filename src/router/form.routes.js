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

router.post("/update", async (req, res) => {
  try {
    const form = await formController.updateForm(req.body);

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
    const formId = req.query.formId;
    const comments = await formController.getFormComments(formId);

    return res.json(comments);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getFormLikesCount", async (req, res) => {
  try {
    const formId = req.query.formId;
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

router.get("/getFormsByTopicId", async (req, res) => {
  try {
    const topicId = req.query.topicId;
    const forms = await formController.getFormsByTopicId(topicId);

    return res.json(forms);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/hasUserLikedForm", async (req, res) => {
  try {
    const { userId, formId } = req.query;
    const like = await formController.hasUserLikedForm({ userId, formId });

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

router.get("/getMostRespondedForms", async (req, res) => {
  try {
    const forms = await formController.getMostRespondedForms();

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

router.get("/searchForms", async (req, res) => {
  try {
    const { query } = req.query;
    const forms = await formController.searchForms(query);

    return res.json(forms);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getFormsByTag", async (req, res) => {
  try {
    const { tag } = req.query;
    const forms = await formController.getFormsByTag(tag);

    return res.json(forms);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/updateFilledOutForm", async (req, res) => {
  try {
    const { userId, formId, inputs } = req.body;
    const response = await formController.updateFilledOutForm({ userId, formId, inputs });

    return res.json(response);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post("/deleteForm", async (req, res) => {
  try {
    const response = await formController.deleteForm(req.body);

    return res.json(response);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getAggregatedResponsesByFormId", async (req, res) => {
  try {
    const formId = req.query.formId;
    const responses = await formController.getAggregatedResponsesByFormId(formId);

    return res.json(responses);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;