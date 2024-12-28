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
const { Op } = require("sequelize");
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

const updateForm = async ({ formId, inputsData, userId }) => {
  try {
    const form = await Form.findByPk(formId);

    if (!form) {
      throw new Error("Form not found");
    }
    const user = await User.findByPk(userId);

    if (form.userId !== userId && !user.isAdmin) {
      throw new Error("You are not authorized to update this form");
    }

    const existingFormResponses = await FormResponse.findAll({
      where: {
        formId,
      },
    });

    if (existingFormResponses.length) {
      throw new Error("Form has responses, cannot update");
    }

    const response = await sequelize.transaction(async (transaction) => {
      await Input.sync();
      await Input.destroy({
        where: {
          formId,
        },
        transaction,
      });

      if (inputsData?.length) {
        const inputs = inputsData?.map(input => ({
          ...input,
          values: input.options,
          display: input.displayed,
          userId,
          formId,
        }));

        await Input.bulkCreate(inputs, { transaction });
      }

      return { message: "Form updated successfully" };
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
    await Comment.sync();
    const comments = await Comment.findAll({
      where: {
        formId,
      },
      attributes: ["id", "content", "createdAt"],
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["firstName", "lastName", "email"],
        },
      ],
    });

    return comments;

  } catch (error) {
    throw error;
  }
};

const getFormLikesCount = async (formId) => {
  try {
    await Like.sync();
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

const likeForm = async ({ formId, userId }) => {
  try {
    const form = await Form.findByPk(formId);

    if (!form) {
      throw new Error("Form not found");
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    await Like.sync();

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

const unlikeForm = async ({ formId, userId }) => {
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

const hasUserLikedForm = async ({ formId, userId }) => {
  try {
    const existingLike = await Like.findOne({
      where: {
        formId,
        userId,
      },
    });

    return Boolean(existingLike);
  } catch (error) {
    throw error;
  }
};

const commentForm = async ({ formId, userId, content }) => {
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

    const user = await User.findByPk(userId, {
      attributes: ["firstName", "lastName", "email"],
    });

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
      user: user.toJSON(),
    };

    return formWithAnswers;

  } catch (error) {
    throw error;
  }
};

const searchForms = async (query) => {
  try {
    let forms = [];

    if (!query) {
      forms = await Form.findAll({
        attributes: ["id", "title", "description", "createdAt", "tags"],
        limit: 10,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: "creator",
            attributes: [],
            required: false,
          },
          {
            model: Topic,
            as: "topic",
            attributes: ["name"],
            required: false,
          },
        ],
      });

      return forms;
    }
    forms = await Form.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
          // look for tags in JSON array
          sequelize.where(sequelize.fn('JSON_CONTAINS', sequelize.col('tags'), JSON.stringify(query)), true),
          { '$topic.name$': { [Op.like]: `%${query}%` } },
          { '$inputs.title$': { [Op.like]: `%${query}%` } },
          { '$inputs.description$': { [Op.like]: `%${query}%` } },
          { '$comments.content$': { [Op.like]: `%${query}%` } },
        ],
      },
      attributes: ["id", "title", "description", "createdAt", "tags"],
      include: [
        {
          model: User,
          as: "creator",
          attributes: [],
          required: false,
        },
        {
          model: Topic,
          as: "topic",
          attributes: [],
          required: false,
        },
        {
          model: Input,
          as: "inputs",
          attributes: [],
          required: false,
        },
        {
          model: Comment,
          as: "comments",
          attributes: [],
          required: false,
        },
      ],
    });

    return forms;

  } catch (error) {
    throw error;
  }
};

const updateFilledOutForm = async ({ formId, userId, inputs }) => {
  try {
    const form = await Form.findByPk(formId);

    if (!form) {
      throw new Error("Form not found");
    }

    const formResponse = await FormResponse.findOne({
      where: {
        formId,
        userId,
      },
    });

    if (!formResponse) {
      throw new Error("Form not found");
    }

    const response = await sequelize.transaction(async (transaction) => {
      for (const input of inputs) {
        const [answer, created] = await Answer.findOrCreate({
          where: {
            formId,
            userId,
            inputId: input.id,
          },
          defaults: {
            value: input.answer,
          },
          transaction,
        });

        if (!created) {
          await answer.update({ value: input.answer }, { transaction });
        }
      }

      return { message: "Form updated successfully" };
    });

    return response;

  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createForm,
  updateForm,
  getFormById,
  getFormsByUserId,
  getFormComments,
  getFormLikesCount,
  likeForm,
  unlikeForm,
  commentForm,
  getLastFivePublicForms,
  getFilledOutFormByUserId,
  searchForms,
  hasUserLikedForm,
  updateFilledOutForm,
};