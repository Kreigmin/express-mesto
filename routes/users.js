/* eslint-disable comma-dangle */
const express = require("express");

const { celebrate, Joi } = require("celebrate");

const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUser,
  updateUserInfo,
  updateAvatar,
} = require("../controllers/users");

router.post(
  "/users",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    }),
  }),
  createUser
);

router.get("/users", getAllUsers);

router.get("/users/me", getUser);

router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserInfo
);

router.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string(),
    }),
  }),
  updateAvatar
);

module.exports = router;
