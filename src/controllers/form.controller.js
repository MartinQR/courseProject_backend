const sequelize = require("../db");
const {
  Form,
  Input,
  Tag,
  Comment,
  Like,
  User,
  Topic,
  Answer,
  FormResponse,
} = sequelize.models;
const tagController = require("./tag.controller");
const commentController = require("./comment.controller");


const createForm = async ({
  title,
  description,
  topicId,
  tags = [],
  inputsData,
  userId,
  isPublic,
  allowedUsers = [],
}) => {

  try {
    if (tags.length > 10) {
      throw new Error("Tags should not exceed 10");
    }

    const response = await sequelize.transaction(async (transaction) => {
      await Form.sync();
      const form = await Form.create({
        title,
        description,
        topicId,
        tags,
        isPublic,
        allowedUsers,
        userId,
      }, { transaction });

      if (inputsData?.length) {
        const inputs = inputsData?.map(input => ({
          ...input,
          values: input.options,
          display: input.displayed,
          userId,
          formId: form.id,
        }));

        await Input.sync();
        await Input.bulkCreate(inputs, { transaction });
      }

      if (tags?.length) {
        for await (const tag of tags) {
          await tagController.createTag({
            name: tag,
            userId,
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
          attributes: {
            exclude: ["formId", "createdAt", "updatedAt", "userId"],
          },
        },
        {
          model: User,
          as: "creator",
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: Topic,
          as: "topic",
          attributes: ["name"],
        }
      ],
      attributes: {
        exclude: ["topicId"],
      },
    });

    return form;

  } catch (error) {
    throw error;
  }
};

const getFormsByUserId = async (userId) => {
  try {
    const forms = await Form.findAll({
      attributes: ["id", "title", "description", "createdAt"],
      where: {
        userId,
      },
    });

    return forms;

  } catch (error) {
    throw error;
  }
};

const getFormComments = async (formId) => {
  try {
    const comments = await Comment.findAll({
      where: {
        formId,
      },
    });

    return comments;

  } catch (error) {
    throw error;
  }
};

const getFormLikesCount = async (formId) => {
  try {
    const likes = await Like.count({
      where: {
        formId,
      },
    });

    return likes;

  } catch (error) {
    throw error;
  }
};

const likeForm = async (formId, userId) => {
  try {
    const form = await Form.findByPk(formId);

    if (!form) {
      throw new Error("Form not found");
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const existingLike = await Like.findOne({
      where: {
        formId,
        userId,
      },
    });

    if (existingLike) {
      throw new Error("You have already liked this form");
    }

    const like = await Like.create({
      formId,
      userId,
    });

    return like;

  } catch (error) {
    throw error;
  }
};

const unlikeForm = async (formId, userId) => {
  try {
    const form = await Form.findByPk(formId);

    if (!form) {
      throw new Error("Form not found");
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const existingLike = await Like.findOne({
      where: {
        formId,
        userId,
      },
    });

    if (!existingLike) {
      throw new Error("You have not liked this form");
    }

    await existingLike.destroy();

    return { message: "Form unliked successfully" };

  } catch (error) {
    throw error;
  }
};

const commentForm = async (formId, userId, content) => {
  try {
    const form = await Form.findByPk(formId);

    if (!form) {
      throw new Error("Form not found");
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!content || !content.trim()) {
      throw new Error("Content is required");
    }

    const newComment = await commentController.createComment({
      userId,
      formId,
      content,
    });

    return newComment;

  } catch (error) {
    throw error;
  }
};

const getLastFivePublicForms = async () => {
  try {
    const forms = await Form.findAll({
      where: {
        isPublic: true,
      },
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "title", "description",],
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "email"],
        },
        {
          model: Topic,
          as: "topic",
          attributes: ["name"],
        }
      ],
    });

    return forms;

  } catch (error) {
    throw error;
  }
};

const getFilledOutFormByUserId = async ({ formId, userId }) => {
  try {
    const formResponse = await FormResponse.findOne({
      where: {
        formId,
        userId,
      },
    });

    if (!formResponse) {
      throw new Error("Form not found");
    }

    const form = await getFormById(formId);

    const inputAnswers = await Answer.findAll({
      where: {
        formId,
        userId,
      },
      attributes: ["inputId", "value"],
    });

    const formInputs = form.inputs.map(input => ({
      ...input.toJSON(),
      answer: inputAnswers.find(answer => answer.inputId === input.id)?.value,
    }));

    const formWithAnswers = {
      ...form.toJSON(),
      inputs: formInputs,
    };

    return formWithAnswers;

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
      attributes: ["formId"],
    });


    const formIds = formResponses.map(response => response.formId);

    const forms = await Form.findAll({
      where: {
        id: formIds,
      },
      attributes: ["id", "title", "description", "createdAt"],
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: Topic,
          as: "topic",
          attributes: ["name"],
        }
      ],
    });

    return forms || [];

  } catch (error) {
    throw error;
  }
};




module.exports = {
  createForm,
  getFormById,
  getFormsByUserId,
  getFormComments,
  getFormLikesCount,
  likeForm,
  unlikeForm,
  commentForm,
  getLastFivePublicForms,
  getFilledOutFormByUserId,
  getAllFilledOutFormsByUserId,
};