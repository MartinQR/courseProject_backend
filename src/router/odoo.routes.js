const router = require('express').Router();
const odooController = require("../controllers/odoo.controller");

// To get all surveys
router.get('/fetchSurveys', async (req, res) => {
    try {
        const surveys = await odooController.fetchSurveys();
        res.json({
            message: 'Encuestas obtenidas exitosamente',
            surveys,
        });
    } catch (error) {
        res.status(error.code || 400).json({ error: error.message });
    }
});

// To get the results of a survey by its ID
router.get('/fetchSurveysResultById/:surveyId', async (req, res) => {
    try {
        const { surveyId } = req.params;
        const surveyResults = await odooController.fetchSurveysResultById(surveyId);
        res.json({
            message: 'Resultados de la encuesta obtenidos exitosamente',
            surveyResults,
        });
    } catch (error) {
        res.status(error.code || 400).json({ error: error.message });
    }
});

// To get the details of the questions of a survey by its ID
router.get('/fetchSurveyQuestionsDetails/:surveyId', async (req, res) => {
    const { surveyId } = req.params;
    try {
        const questionsDetails = await odooController.fetchSurveyQuestionsDetails(surveyId);
        res.status(200).json({
            message: 'Detalles de preguntas obtenidos con éxito',
            data: questionsDetails,
        });
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        res.status(500).json({ error: 'Error al obtener preguntas de la encuesta' });
    }
});

module.exports = router;