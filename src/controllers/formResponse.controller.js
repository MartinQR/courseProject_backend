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
      const form = await Form.findByPk(formId);
      if (!form) {
        throw new Error("Form not found");
      }

      if (!form.isPublic && !form?.allowedUsers?.includes(userId)) {
        throw new Error("You are not allowed to fill out this form");
      }


      await FormResponse.sync();
      const existingFormResponses = await FormResponse.findAll({
        where: {
          formId,
          userId,
        },
      });

      if (existingFormResponses.length > 0) {
        throw new Error("You have already filled out this form");
      }

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
      attributes: ["formId", "createdAt"],
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

const getAllFilledOutFormsByUserId = async (userId) => {

  try {
    const formResponses = await FormResponse.findAll({
      where: {
        userId,
      },
      attributes: ["id", "createdAt"],
      include: [
        {
          model: Form,
          as: "form",
          attributes: ["id", "title", "description",],
          include: [
            {
              model: User,
              as: "creator",
              attributes: ["id", "email", "firstName", "lastName"],
            },
          ],
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
  getAllFilledOutFormsByUserId,
};