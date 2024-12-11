const sequelize = require("../db");
const { Form, Input, Tag } = sequelize.models;
const { createInput } = require("./input.controller");
const { createTag } = require("./tag.controller");


const getAllForms = async () => {
  try {
    const forms = await Form.findAll();
    return forms;

  } catch (error) {
    throw error;
  }
};

const createForm = async ({
  title,
  description,
  topicId,
  collaboratorIds,
  tags,
  inputs,
  userId,
  isPublic,
  allowedUsers = [],
}) => {

  try {

    if (tags.length > 10) {
      throw new Error("Tags should not exceed 10");
    }

    const response = await sequelize.transaction(async (transaction) => {
      const form = await Form.create({
        title,
        description,
        topicId,
        collaboratorIds,
        tags,
        isPublic,
        allowedUsers,
        userId,
      }, { transaction });

      if (inputs.length) {
        const inputsData = inputs.map(input => ({
          ...input,
          userId,
          formId: form.id,
        }));

        await Input.sync();
        await Input.bulkCreate(inputsData, { transaction });
      }

      if (tags.length) {
        for await (const tag of tags) {
          await createTag({
            name: tag,
          });
        }
      }

      return form;
    });

    return response;

  } catch (error) {
    throw error;
  }
};


const getFormById = async (id) => {
  try {
    const form = await Form.findByPk(id, {
      include: [
        {
          model: Input,
          as: "inputs",
        },
      ],
    });
    return form;

  } catch (error) {
    throw error;
  }
};

const getFormByUserId = async (userId) => {
  try {
    const forms = await Form.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Input,
          as: "inputs",
        },
      ],
    });

    return forms;

  } catch (error) {
    throw error;
  }
};




module.exports = {
  getAllForms,
  createForm,
  getFormById,
  getFormByUserId
};