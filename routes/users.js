/* eslint-disable comma-dangle */
const express = require("express");

const { celebrate, Joi } = require("celebrate");

const validator = require("validator");

const validateUrl = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error("Неправильный формат ссылки");
  }
  return value;
};

const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUserInfo,
  updateAvatar,
  getUserById,
} = require("../controllers/users");

router.get("/users", getAllUsers);

router.get("/users/me", getUser);

router.get(
  "/users/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex(),
    }),
  }),
  getUserById
);

router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateUserInfo
);

router.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateUrl),
    }),
  }),
  updateAvatar
);

module.exports = router;
