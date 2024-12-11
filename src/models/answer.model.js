const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Answer', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    inputId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    formId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    value: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });
};