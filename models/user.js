/* eslint-disable comma-dangle */
/* eslint-disable object-shorthand */
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const validator = require("validator");
const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Жак-Ив Кусто",
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: "Исследователь",
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator(link) {
        return validator.isURL(link);
      },
    },
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      // eslint-disable-next-line func-names
      validator: function (email) {
        if (!validator.isEmail(email)) {
          throw new Error("invalidEmail");
        }
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserbyCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Unauthorized"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Unauthorized"));
        }
        return user;
      });
    });
};

// eslint-disable-next-line func-names
userSchema.statics.findUser = function (userId, res, next) {
  return this.findById(userId)
    .orFail(new Error("NotFoundUserId"))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === "NotFoundUserId") {
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

module.exports = mongoose.model("user", userSchema);
