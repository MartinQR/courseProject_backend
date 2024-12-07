const modelSetup = (sequelize) => {
  const {
    User,
    Form,
    Input,
  } = sequelize.models;

  User.hasMany(Form, { foreignKey: 'userId' });
  Form.belongsTo(User, { foreignKey: 'userId' });

  Form.hasMany(Input, { foreignKey: 'formId', as: 'inputs' });
  Input.belongsTo(Form, { foreignKey: 'formId' });

  User.hasMany(Input, { foreignKey: 'userId' });
  Input.belongsTo(User, { foreignKey: 'userId' });

};

module.exports = { modelSetup };