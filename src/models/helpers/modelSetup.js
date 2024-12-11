const modelSetup = (sequelize) => {
  const {
    User,
    Form,
    Input,
    Answer,
    FormResponse,
    Topic,
  } = sequelize.models;

  User.hasMany(Form, { foreignKey: 'userId' });
  User.hasMany(Input, { foreignKey: 'userId' });
  User.hasMany(Answer, { foreignKey: 'userId' });
  User.hasMany(FormResponse, { foreignKey: 'userId' });

  Topic.hasMany(Form, { foreignKey: 'topicId' });

  Form.belongsTo(User, { foreignKey: 'userId' });
  Form.belongsTo(Topic, { foreignKey: 'topicId' });
  Form.hasMany(Input, { foreignKey: 'formId', as: 'inputs' });
  Form.hasMany(Answer, { foreignKey: 'formId' });
  Form.hasMany(FormResponse, { foreignKey: 'formId' });

  Input.belongsTo(Form, { foreignKey: 'formId' });
  Input.belongsTo(User, { foreignKey: 'userId' });
  Input.hasMany(Answer, { foreignKey: 'inputId' });

  FormResponse.belongsTo(User, { foreignKey: 'userId' });
  FormResponse.belongsTo(Form, { foreignKey: 'formId' });

  Answer.belongsTo(User, { foreignKey: 'userId' });
  Answer.belongsTo(Form, { foreignKey: 'formId' });
  Answer.belongsTo(Input, { foreignKey: 'inputId' });

};

module.exports = { modelSetup };