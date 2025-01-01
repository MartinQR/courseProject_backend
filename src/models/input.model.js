const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Input', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        'SINGLE-LINE',
        'MULTIPLE-LINE',
        'INTEGER',
        'CHECKBOX',
      ),
      allowNull: false,
    },
    values: {
      type: DataTypes.JSON,
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    display: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    formId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    dragIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });
};