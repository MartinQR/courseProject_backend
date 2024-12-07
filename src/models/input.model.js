const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Input', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    placeholder: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('text', 'number', 'email', 'date', 'textarea', 'select', 'checkbox', 'radio'),
      allowNull: false,
    },
    values: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    formId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },

  });
}