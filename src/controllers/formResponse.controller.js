const sequelize = require("../db");
const { FormResponse, Form, User, Answers } = sequelize.models;


const createFormResponse = async ({
  userId,
  formId,
}) => {

  try {
    await FormResponse.sync();

    const response = await sequelize.transaction(async (transaction) => {
      const formResponse = await FormResponse.create({
        userId,
        formId,
      }, { transaction });

      return formResponse;
    });

    return response

  } catch (error) {
    throw error;
  }
};


const completeForm = async (formId, userId, answers) => {
  try {
    const response = await sequelize.transaction(async (transaction) => {
      await FormResponse.sync();
      const formResponse = await FormResponse.create({
        userId,
        formId,
      }, { transaction });

      const answersToBulkCreate = answers.map(answer => ({
        ...answer,
        userId,
        formId,
      }));

      await Answers.sync();
      const answersCreated = await Answers.bulkCreate(answersToBulkCreate, { transaction });

      return answersCreated;
    });

    return response;

  } catch (error) {
    throw error;
  }
};



module.exports = {
  createFormResponse,
  completeForm,
};