/* eslint-disable comma-dangle */
const { Joi, celebrate } = require("celebrate");
const express = require("express");

const router = express.Router();

const {
  createCard,
  getAllCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.get(
  "/cards",
  celebrate({
    headers: Joi.object()
      .keys({
        "Content-Type": Joi.string().required,
      })
      .unknown(true),
  }),
  getAllCards
);

router.post(
  "/cards",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
    }),
  }),
  createCard
);

router.delete(
  "/cards/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  deleteCard
);

router.put(
  "/cards/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  likeCard
);
router.delete(
  "/cards/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  dislikeCard
);

module.exports = router;
