const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// 6130ff6c0c76abb25061e811 - id
app.use(userRoutes);

app.listen(PORT);
