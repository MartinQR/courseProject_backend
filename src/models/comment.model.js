const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Comment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    formId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });
};