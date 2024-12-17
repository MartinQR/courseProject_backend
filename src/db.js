require("dotenv").config();
const { Sequelize } = require("sequelize");
const { modelSetup } = require("./models/helpers/modelSetup");


const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  port: DB_PORT,
  //show the query in the console
  logging: false,
});

const modelDefiners = [
  require("./models/users.model"),
  require("./models/form.model"),
  require("./models/input.model"),
  require("./models/tag.model"),
  require("./models/answer.model"),
  require("./models/formResponse.model"),
  require("./models/topic.model"),
  require("./models/comment.model"),
  require("./models/like.model"),
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

modelSetup(sequelize);

// This will create the table if it doesn't exist (and will do nothing if it already exists)

// (async () => {
//   try {
//     await sequelize.sync({ alter: true });
//   } catch (error) {
//     console.error(error.message);
//   }
// })();


module.exports = sequelize;