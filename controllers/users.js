/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const ConflictError = require("../errors/conflict-error");

const {
  JWT_SECRET = "0b268613ed8c3f6f16a8280368d7df3e510fe7ae0a8fa32bd7b4f6d9982fdbed",
} = process.env;

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return User.create({ name, about, avatar, email, password: hash });
    })
    .then((user) => {
      // eslint-disable-next-line no-shadow
      const { name, about, avatar, email } = user;
      res.status(201).send({ user: { name, about, avatar, email } });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError(
            "Переданы некорректные данные при создании пользователя."
          )
        );
      } else if (err.name === "MongoServerError" && err.code === 11000) {
        return next(new ConflictError("Данный email уже существует."));
      }
      return next(err);
    });
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findUser(req.user._id, res, next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findUser(userId, res, next);
};

const updateUserInfo = (req, res, next) => {
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
        return next(
          new NotFoundError("Пользователь по указанному _id не найден.")
        );
      } else if (err.name === "ValidationError") {
        return next(
          new BadRequestError(
            "Переданы некорректные данные при обновлении профиля."
          )
        );
      } else if (err.name === "CastError") {
        return next(
          new BadRequestError("Передан некорректный id пользователя.")
        );
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

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
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Введена неправильная ссылка"));
      } else if (err.message === "NotFoundUserId") {
        return next(
          new NotFoundError("Пользователь по указанному _id не найден.")
        );
      } else if (err.name === "CastError") {
        return next(
          new BadRequestError("Передан некорректный id пользователя.")
        );
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserbyCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("jwt", token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).send({ message: "Вы успешно вошли" });
    })
    .catch((err) => {
      if (err.message === "Unauthorized") {
        return next(new UnauthorizedError("Неправильные почта или пароль."));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUserInfo,
  updateAvatar,
  login,
  getUserById,
};
