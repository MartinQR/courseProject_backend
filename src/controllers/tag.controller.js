const sequelize = require("../db");
const { User, Tag } = sequelize.models;


const getAllTags = async () => {
  try {
    const tags = await Tag.findAll({
      attributes: ["id", 'name'],
    });
    return tags;

  } catch (error) {
    throw error;
  }
};

const createTag = async ({
  userId,
  name,
}) => {

  try {
    await Tag.sync();
    const tag = await Tag.create({
      userId,
      name,
    });
    return tag;

  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTag,
  getAllTags,
};