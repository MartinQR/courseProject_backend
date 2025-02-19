const modelSetup = (sequelize) => {
  const {
    User,
    Form,
    Input,
    Answer,
    FormResponse,
    Topic,
    Comment,
    Like,
  } = sequelize.models;

  //To relate the models

  User.hasMany(Form, { foreignKey: 'userId' });
  User.hasMany(Input, { foreignKey: 'userId' });
  User.hasMany(Answer, { foreignKey: 'userId' });
  User.hasMany(FormResponse, { foreignKey: 'userId' });
  User.hasMany(Comment, { foreignKey: 'userId' });
  User.hasMany(Like, { foreignKey: 'userId' });

  Topic.hasMany(Form, { foreignKey: 'topicId' });

  Form.belongsTo(User, { foreignKey: 'userId', as: "creator" });
  Form.belongsTo(Topic, { foreignKey: 'topicId', as: "topic" });
  Form.hasMany(Input, { foreignKey: 'formId', as: 'inputs' });
  Form.hasMany(Answer, { foreignKey: 'formId' });
  Form.hasMany(FormResponse, { foreignKey: 'formId' });
  Form.hasMany(Comment, { foreignKey: 'formId', as: 'comments' });
  Form.hasMany(Like, { foreignKey: 'formId' });

  Input.belongsTo(Form, { foreignKey: 'formId' });
  Input.belongsTo(User, { foreignKey: 'userId' });
  Input.hasMany(Answer, { foreignKey: 'inputId' });

  FormResponse.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  FormResponse.belongsTo(Form, { foreignKey: 'formId', as: 'form' });

  Answer.belongsTo(User, { foreignKey: 'userId' });
  Answer.belongsTo(Form, { foreignKey: 'formId' });
  Answer.belongsTo(Input, { foreignKey: 'inputId', as: 'input' });

  Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Comment.belongsTo(Form, { foreignKey: 'formId' });

  Like.belongsTo(User, { foreignKey: 'userId' });
  Like.belongsTo(Form, { foreignKey: 'formId' });

};

module.exports = { modelSetup };