const sequelize = require("../db");
const { FormResponse, Form, User, Answer } = sequelize.models;


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


const filloutForm = async ({ formId, userId, answers }) => {
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

      await Answer.sync();
      const answersCreated = await Answer.bulkCreate(answersToBulkCreate, { transaction });

      return answersCreated;
    });

    return response;

  } catch (error) {
    throw error;
  }
};

const getAllFilledOutFormsByFormId = async (formId) => {

  try {
    const formResponses = await FormResponse.findAll({
      where: {
        formId,
      },
      attributes: ["id", "createdAt"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "firstName", "lastName"],
        },
      ],
    });


    return formResponses;
  } catch (error) {
    throw error;

  }

};



module.exports = {
  createFormResponse,
  filloutForm,
  getAllFilledOutFormsByFormId,
};