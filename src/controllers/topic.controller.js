const sequelize = require("../db");
const { Topic } = sequelize.models;


const getAllTopics = async () => {
  try {
    const topics = await Topic.findAll();
    return topics;

  } catch (error) {
    throw error;
  }
};

const createTopic = async ({
  name,
}) => {

  try {
    await Topic.sync();
    const topic = await Topic.create({
      name,
    });
    return topic;

  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTopic,
  getAllTopics,
};