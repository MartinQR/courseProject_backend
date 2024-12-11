const sequelize = require("../db");
const Input = sequelize.models.Input;


const getAllInput = async () => {
  try {
    const inputs = await Input.findAll();
    return inputs;

  } catch (error) {
    throw error;
  }
};

const createInput = async ({
  userId,
  title,
  description,
  type,
  values,
  isRequired,
  formId,
  display,
}) => {

  try {

    await Input.sync();
    const response = await sequelize.transaction(async (transaction) => {
      const input = await Input.create({
        userId,
        title,
        description,
        type,
        values,
        isRequired,
        formId,
        display,
      }, { transaction });

      return input;
    });

  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllInput,
  createInput,
};