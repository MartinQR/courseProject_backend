const sequelize = require("../db");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const User = sequelize.models.User;


const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;

  } catch (error) {
    throw error;
  }
};

const getAvailableUsersByQuery = async (query) => {
  try {

    let users = [];
    if (!query) {
      users = await User.findAll({
        where: { isBlocked: false },
        limit: 20,
        attributes: ["id", "firstName", "lastName", "email"],
      });

    } else {
      users = await User.findAll({
        where: {
          isBlocked: false,
          [Op.or]: [
            { firstName: { [Op.like]: `%${query}%` } },
            { lastName: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
          ],
        },
        attributes: ["id", "firstName", "lastName", "email"],
      });
    }


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

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
      throw new Error("Please provide all required fields");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.sync();
    const user = await User.create({
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim(),
      password: hashedPassword,
    });
    return user;

  } catch (error) {

    if (error?.parent?.code === "ER_DUP_ENTRY") {
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

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      isBlocked: user.isBlocked,
      userId: user.id,
    };

  } catch (error) {
    throw error;
  }
};

const deleteUser = async ({ adminId, usersId }) => {
  try {
    const admin = await User.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new Error("Admin not found");
    }

    for await (const userId of usersId) {
      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }

      // if (user.isAdmin && user.id !== adminId) {
      //   throw new Error(`You cannot delete an admin ${user.email}`);
      // }

      await user.destroy();
    }

    return { message: "Users deleted successfully" };


  } catch (error) {
    throw error;
  }
};


const updateAdminStatus = async ({ adminId, usersId, action }) => {
  const isAdmin = action === "MAKE";

  try {
    const admin = await User.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new Error("Admin not found");
    }

    if (!admin.isAdmin) {
      throw new Error("You are not authorized to update admin status");
    }

    for await (const userId of usersId) {
      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }

      // if (user.isAdmin && user.id !== adminId) {
      //   throw new Error(`You cannot update an admin ${user.email}`);
      // }

      await user.update({ isAdmin });
    }

    return { message: "Admin status updated successfully" };

  } catch (error) {
    throw error;
  }
};

const updateBlockedStatus = async ({ adminId, usersId, action }) => {

  const isBlocked = action === "BLOCK_USERS";

  try {
    const admin = await User.findOne({ where: { id: adminId } });
    if (!admin) {
      throw new Error("Admin not found");
    }

    if (!admin.isAdmin) {
      throw new Error("You are not authorized to update blocked status");
    }

    for await (const userId of usersId) {
      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        throw new Error(`User with id ${userId} not found`);
      }

      // if (user.isAdmin && user.id !== adminId) {
      //   throw new Error(`You cannot block an admin ${user.email}`);
      // }

      await user.update({ isBlocked });
    }

    return { message: "Blocked status updated successfully" };

  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getAvailableUsersByQuery,
  loginUser,
  getAllUsers,
  deleteUser,
  updateAdminStatus,
  updateBlockedStatus,
};