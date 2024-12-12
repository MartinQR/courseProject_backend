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

const deleteUser = async ({ adminId, userId }) => {
  try {
    const admin = await User.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new Error("Admin not found");
    }

    if (!admin.isAdmin) {
      throw new Error("You are not authorized to delete a user");
    }

    const user = await User.destroy({ where: { id: userId } });
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUser = async ({
  userId,
  firstName,
  lastName,
  email,
  password,
}) => {
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return user;

  } catch (error) {
    throw error;
  }
};

const updateAdminStatus = async ({ adminId, userId }) => {
  try {
    const admin = await User.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new Error("Admin not found");
    }

    if (!admin.isAdmin) {
      throw new Error("You are not authorized to update admin status");
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isAdmin && adminId !== userId) {
      throw new Error("You cannot update admin status of another admin");
    }

    await user.update({ isAdmin: !user.isAdmin });
    return user;

  } catch (error) {
    throw error;
  }
};

const updateBlockedStatus = async ({ adminId, userId }) => {
  try {
    const admin = await User.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new Error("Admin not found");
    }

    if (!admin.isAdmin) {
      throw new Error("You are not authorized to update blocked status");
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isAdmin && adminId !== userId) {
      throw new Error("You cannot update blocked status of another admin");
    }

    await user.update({ isBlocked: !user.isBlocked });
    return user;

  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  deleteUser,
  updateUser,
  updateAdminStatus,
  updateBlockedStatus,
};