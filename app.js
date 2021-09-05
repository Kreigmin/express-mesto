const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const userRoutes = require("./routes/users");
const cardRoutes = require("./routes/cards");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "6130ff6c0c76abb25061e811",
  };

  next();
});

app.use(userRoutes);

app.use(cardRoutes);

app.use((req, res) => {
  const NOT_FOUND_ERROR_CODE = 404;
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Запрашиваемый ресурс не найден" });
});

app.listen(PORT);
