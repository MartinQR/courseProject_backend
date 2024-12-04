const sequelize = require("../db");
const User = sequelize.models.User;


const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;

  } catch (error) {
    throw error;
  }
};

const createUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {

  try {
    await User.sync();
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });
    return user;

  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getAllUsers,
}