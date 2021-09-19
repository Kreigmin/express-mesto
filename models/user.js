/* eslint-disable object-shorthand */
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const validator = require("validator");

// eslint-disable-next-line operator-linebreak
const regExpForUrl =
  // eslint-disable-next-line no-useless-escape
  /(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

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
      // eslint-disable-next-line func-names
      validator: function (value) {
        if (!regExpForUrl.test(value)) {
          return new Error("InvalidUrl");
        }
        return true;
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

module.exports = mongoose.model("user", userSchema);
