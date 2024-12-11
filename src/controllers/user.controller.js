const sequelize = require("../db");
const bcrypt = require("bcrypt");
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
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.sync();
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    return user;

  } catch (error) {

    if (error.parent.code === "ER_DUP_ENTRY") {
      throw new Error("Email already exists");
    }
    throw new Error(error);
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return user;

  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
}