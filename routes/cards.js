/* eslint-disable comma-dangle */
const { Joi, celebrate } = require("celebrate");
const express = require("express");
const validator = require("validator");

const router = express.Router();

const {
  createCard,
  getAllCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get("/cards", getAllCards);

router.post(
  "/cards",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .custom((value) => {
          if (!validator.isURL(value, { require_protocol: true })) {
            throw new Error("Неправильный формат ссылки");
          }
          return value;
        }),
    }),
  }),
  createCard
);

router.delete(
  "/cards/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  deleteCard
);

router.put(
  "/cards/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  likeCard
);
router.delete(
  "/cards/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  dislikeCard
);

module.exports = router;
