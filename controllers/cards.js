const Card = require("../models/card");

const BAD_REQUEST_ERROR_CODE = 400;
const BASE_ERROR_CODE = 500;
const NOT_FOUND_ERROR_CODE = 404;

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res
        .status(BASE_ERROR_CODE)
        .send({ message: "На сервере произошла ошибка." });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "Переданы некорректные данные для создания карточки.",
        });
      } else {
        res
          .status(BASE_ERROR_CODE)
          .send({ message: "На сервере произошла ошибка." });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail(new Error("NotFoundCardId"))
    .then(() => {
      res.status(200).send({ message: "Пост удалён" });
    })
    .catch((err) => {
      if (err.message === "NotFoundCardId") {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Карточка с указанным _id не найдена." });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "Переданы некорректные данные для удаления карточки.",
        });
      } else {
        res
          .status(BASE_ERROR_CODE)
          .send({ message: "На сервере произошла ошибка." });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: false }
  )
    .orFail(new Error("NotFoundCardId"))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === "NotFoundCardId") {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Карточка с указанным _id не найдена." });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "Переданы некорректные данные для постановки лайка.",
        });
      } else {
        res
          .status(BASE_ERROR_CODE)
          .send({ message: "На сервере произошла ошибка." });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: false }
  )
    .orFail(new Error("NotFoundCardId"))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === "NotFoundCardId") {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: "Карточка с указанным _id не найдена." });
      } else if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({
          message: "Переданы некорректные данные для постановки лайка.",
        });
      } else {
        res
          .status(BASE_ERROR_CODE)
          .send({ message: "На сервере произошла ошибка." });
      }
    });
};

module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
