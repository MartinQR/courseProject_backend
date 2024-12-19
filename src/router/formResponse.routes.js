const router = require('express').Router();
const formController = require("../controllers/form.controller");
const formResponseController = require("../controllers/formResponse.controller");

router.get("/getAllFilledOutFormsByFormId", async (req, res) => {
  try {
    const formId = req.query.formId;
    const forms = await formResponseController.getAllFilledOutFormsByFormId(formId);

    return res.json(forms);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


module.exports = router;