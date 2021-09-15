const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const helmet = require("helmet");
const userRoutes = require("./routes/users");
const cardRoutes = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);

app.use(userRoutes);

app.use(cardRoutes);

app.use((req, res) => {
  const NOT_FOUND_ERROR_CODE = 404;
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Запрашиваемый ресурс не найден" });
});

app.listen(PORT);
