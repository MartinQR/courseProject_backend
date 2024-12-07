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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    collaboratorIds: {
      type: DataTypes.ARRAY(DataTypes.UUID),
    },
  });
}