const xmlrpc = require('xmlrpc');
const URL_ODOO = "formo.odoo.com";
const DB = "formo";
const USERNAME = "quirozrmartin@gmail.com";
const PASSWORD = "odooQuiroz.2";

const authenticate = () => {
    return new Promise((resolve, reject) => {
        const client = xmlrpc.createSecureClient({
            host: URL_ODOO,
            path: '/xmlrpc/2/common',
            port: 443,
        });

        client.methodCall('authenticate', [DB, USERNAME, PASSWORD, {}], (error, uid) => {
            if (error) return reject(new Error(`Error de autenticación: $ { error.message }`));
            if (!uid) return reject(new Error('Autenticación fallida. Verifica tus credenciales.'));
            resolve(uid);
        });
    });
};

const getSurveys = (uid) => {
    return new Promise((resolve, reject) => {
        const models = xmlrpc.createSecureClient({
            host: URL_ODOO,
            path: '/xmlrpc/2/object',
            port: 443,
        });

        models.methodCall(
            'execute_kw', [DB, uid, PASSWORD, 'survey.survey', 'search_read', [], {}],
            (error, surveys) => {
                if (error) return reject(new Error(`Error al obtener encuestas: $ { error.message }`));
                resolve(surveys);
            }
        );
    });
};

const getSurveyResults = (uid) => {
    return new Promise((resolve, reject) => {
        const models = xmlrpc.createSecureClient({
            host: URL_ODOO,
            path: '/xmlrpc/2/object',
            port: 443,
        });

        models.methodCall(
            'execute_kw', [DB, uid, PASSWORD, 'survey.user_input', 'search_read', [], {}],
            (error, results) => {
                if (error) return reject(new Error(`Error al obtener resultados: $ { error.message }`));
                resolve(results);
            }
        );
    });
};

const getSurveyQuestions = (uid, questionIds) => {
    return new Promise((resolve, reject) => {
        const models = xmlrpc.createSecureClient({
            host: URL_ODOO,
            path: '/xmlrpc/2/object',
            port: 443,
        });

        models.methodCall(
            'execute_kw', [DB, uid, PASSWORD, 'survey.question', 'read', [questionIds], {}],
            (error, questions) => {
                if (error) return reject(new Error(`Error al obtener preguntas: $ { error.message }`));
                resolve(questions);
            }
        );
    });
};

const getUserInputLines = (uid, userInputLineIds) => {
    return new Promise((resolve, reject) => {
        const models = xmlrpc.createSecureClient({
            host: URL_ODOO,
            path: '/xmlrpc/2/object',
            port: 443,
        });

        models.methodCall(
            'execute_kw', [DB, uid, PASSWORD, 'survey.user_input.line', 'read', [userInputLineIds], {}],
            (error, userInputs) => {
                if (error) return reject(new Error(`Error al obtener respuestas: $ { error.message }`));
                resolve(userInputs);
            }
        );
    });
};

const getSurveyAnswers = (uid, questionId) => {
    return new Promise((resolve, reject) => {
        const models = xmlrpc.createSecureClient({
            host: URL_ODOO,
            path: '/xmlrpc/2/object',
            port: 443,
        });

        models.methodCall(
            'execute_kw', [DB, uid, PASSWORD, 'survey.question.answer', 'search_read', [],
                {}
            ], (error, userInputs) => {
                if (error) return reject(new Error(`Error al obtener respuestas: $ { error.message }`));
                resolve(userInputs);
            }
        );
    });
};


const fetchSurveys = async() => {
    try {
        const uid = await authenticate();
        const surveys = await getSurveys(uid);
        return surveys;
    } catch (error) {
        throw error
    }
};

const fetchSurveysResultById = async(surveyId) => {
    try {
        const uid = await authenticate();
        const results = await getSurveyResults(uid);
        const filtered = results.filter(result => {
            return result.survey_id[0] === parseInt(surveyId);
        });
        return filtered;
    } catch (error) {
        throw error
    }
};

const fetchSurveyQuestionsDetails = async(surveyId) => {
    try {
        const uid = await authenticate();
        const surveys = await getSurveys(uid);
        const survey = surveys.find(survey => survey.id === parseInt(surveyId));
        const questionIds = survey.question_ids;
        const questions = await getSurveyQuestions(uid, questionIds);
        survey.question_ids = survey.question_ids.map(questionId => {
            return questions.find(question => question.id === questionId);
        });
        for await (const question of survey.question_ids) {
            const userInputLineIds = question.user_input_line_ids;
            const userInputLines = await getUserInputLines(uid, userInputLineIds);
            question.user_input_line_ids = userInputLines.map(userInputLine => {
                return {
                    answer_type: userInputLine.answer_type,
                    value: userInputLine[`value_${userInputLine.answer_type}`],
                }
            });
        }
        return survey;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    fetchSurveys,
    fetchSurveysResultById,
    fetchSurveyQuestionsDetails
};