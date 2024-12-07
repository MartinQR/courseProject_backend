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
  label,
  placeholder,
  type,
  values,
  isRequired,
  formId,
}) => {

  try {
    await Input.sync();
    const user = await Input.create({
      userId,
      label,
      placeholder,
      type,
      values,
      isRequired,
      formId,
    });
    return user;

  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllInput,
  createInput,
};