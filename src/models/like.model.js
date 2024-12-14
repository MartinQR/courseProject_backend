const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Like', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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