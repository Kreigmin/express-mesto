const User = require("../models/user");

const BAD_REQUEST_ERROR_CODE = 400;
const BASE_ERROR_CODE = 500;
const NOT_FOUND_ERROR_CODE = 404;

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res
          .status(BASE_ERROR_CODE)
          .send({ message: "На сервере произошла ошибка." });
      }
    });
};

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res
        .status(BASE_ERROR_CODE)
        .send({ message: "На сервере произошла ошибка." });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Пользователь по указанному _id не найден." });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "Передан некорректный id пользователя.",
        });
      } else {
        res
          .status(BASE_ERROR_CODE)
          .send({ message: "На сервере произошла ошибка." });
      }
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Пользователь по указанному _id не найден." });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      } else if (err.name === "CastError") {
        res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Передан некорректный id пользователя." });
      } else {
        res
          .status(BASE_ERROR_CODE)
          .send({ message: "На сервере произошла ошибка." });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // eslint-disable-next-line operator-linebreak
  const regExpForUrl =
    // eslint-disable-next-line no-useless-escape
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  if (!avatar.match(regExpForUrl)) {
    res.status(BAD_REQUEST_ERROR_CODE).send({
      message: "Переданы некорректные данные при обновлении аватара.",
    });
  }
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Пользователь по указанному _id не найден." });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: "Передан некорректный id пользователя." });
      } else {
        res
          .status(BASE_ERROR_CODE)
          .send({ message: "На сервере произошла ошибка." });
      }
    });
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUserInfo,
  updateAvatar,
};
