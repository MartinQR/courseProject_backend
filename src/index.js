const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router/index');
const morgan = require('morgan');

const port = process.env.PORT || 4000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(router);