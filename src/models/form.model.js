const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Form', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    collaboratorIds: {
      type: DataTypes.JSON,
    },
    tags: {
      type: DataTypes.JSON,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });
};