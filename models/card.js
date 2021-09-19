/* eslint-disable object-shorthand */
const mongoose = require("mongoose");

// eslint-disable-next-line operator-linebreak
const regExpForUrl =
  // eslint-disable-next-line no-useless-escape
  /(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      // eslint-disable-next-line func-names
      validator: function (value) {
        // if (!regExpForUrl.test(value)) {
        //   return new Error("InvalidUrl");
        // }
        // return true;
        if (!regExpForUrl.test(value)) {
          throw new Error("InvalidUrl");
        }
      },
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("card", cardSchema);
