const sequelize = require("../db");
const { Form, Input } = sequelize.models;
const { createInput } = require("./input.controller");


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
  topic,
  collaboratorIds,
  tags,
  inputs,
  userId,
}) => {

  try {
    await Form.sync();
    const form = await Form.create({
      title,
      description,
      topic,
      collaboratorIds,
      tags,
      userId,
    });

    if (inputs.length) {
      for await (const input of inputs) {
        await createInput({
          ...input,
          userId,
          formId: form.id,
        });
      }
    }

    return form;

  } catch (error) {
    throw error;
  }
};


const getForm = async (id) => {
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

module.exports = {
  getAllForms,
  createForm,
  getForm,
};