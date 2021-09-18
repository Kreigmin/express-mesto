/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const UnauthorizedError = require("../errors/unauthorized-error");

const { JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
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
        return next(
          new BadRequestError(
            "Переданы некорректные данные при создании пользователя."
          )
        );
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
  User.findById(req.user._id)
    .orFail(new Error("NotFoundUserId"))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === "NotFoundUserId") {
        next(new NotFoundError("Пользователь по указанному _id не найден."));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Передан некорректный id пользователя."));
      } else {
        next(err);
      }
    });
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
        next(new NotFoundError("Пользователь по указанному _id не найден."));
      } else if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при обновлении профиля."
          )
        );
      } else if (err.name === "CastError") {
        next(new BadRequestError("Передан некорректный id пользователя."));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  // eslint-disable-next-line operator-linebreak
  const regExpForUrl =
    // eslint-disable-next-line no-useless-escape
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  if (!avatar.match(regExpForUrl)) {
    next(
      new BadRequestError(
        "Переданы некорректные данные при обновлении аватара."
      )
    );
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
        next(new NotFoundError("Пользователь по указанному _id не найден."));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Передан некорректный id пользователя."));
      } else {
        next(err);
      }
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
      });
      res.status(200).send({ message: "Вы успешно вошли" });
    })
    .catch((err) => {
      if (err.message === "Unauthorized") {
        next(new UnauthorizedError("Неправильные почта или пароль."));
      } else {
        return next(err);
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
