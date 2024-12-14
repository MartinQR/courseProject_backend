const sequelize = require("../db");
const { User, Comment, Form } = sequelize.models;


const createComment = async ({
  userId,
  formId,
  content,
}) => {

  try {
    await Comment.sync();

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const form = await Form.findByPk(formId);
    if (!form) {
      throw new Error("Form not found");
    }

    if (!content?.trim()) {
      throw new Error("Please provide a comment");
    }

    const comment = await Comment.create({
      userId,
      formId,
      content,
    });
    return comment;

  } catch (error) {
    throw error;
  }
};

module.exports = {
  createComment,
};