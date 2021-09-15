/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { JWT_SECRET } = process.env;

const BAD_REQUEST_ERROR_CODE = 400;
const BASE_ERROR_CODE = 500;
const NOT_FOUND_ERROR_CODE = 404;
const UNAUTHORIZED_ERROR_CODE = 401;

const createUser = (req, res) => {
  // eslint-disable-next-line object-curly-newline
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      // eslint-disable-next-line object-curly-newline
      return User.create({ name, about, avatar, email, password: hash });
    })
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
  User.findById(req.user._id)
    .orFail(new Error("NotFoundUserId"))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === "NotFoundUserId") {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Пользователь по указанному _id не найден." });
      } else if (err.name === "CastError") {
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
    .orFail(new Error("NotFoundUserId"))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === "NotFoundUserId") {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Пользователь по указанному _id не найден." });
      } else if (err.name === "ValidationError") {
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
    .orFail(new Error("NotFoundUserId"))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === "NotFoundUserId") {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Пользователь по указанному _id не найден." });
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

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserbyCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("jwt", token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.status(200).send({ message: "Всё хорошо" });
    })
    .catch((err) => {
      if (err.message === "Unauthorized") {
        res
          .status(UNAUTHORIZED_ERROR_CODE)
          .send({ message: "Неправильные почта или пароль" });
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
  login,
};
