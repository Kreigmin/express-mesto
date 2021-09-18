/* eslint-disable comma-dangle */
const mongoose = require("mongoose");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const ConflictError = require("../errors/conflict-error");
const Card = require("../models/card");
// const UnauthorizedError = require("../errors/unauthorized-error");
const ForbiddenError = require("../errors/forbidden-error");

// const { JWT_SECRET } = process.env;

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные при создании карточки."
          )
        );
      } else if (err.name === "MongoError" && err.code === 11000) {
        next(new ConflictError("Данный email уже существует."));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const objectCardId = mongoose.Types.ObjectId(cardId);
  Card.findById(cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        return next(new ForbiddenError("Нельзя удалять чужую карточку."));
      }
      Card.deleteOne(objectCardId)
        .orFail(new Error("NotFoundCardId"))
        .then(() => {
          res.status(200).send({ message: "Пост удалён" });
        })
        .catch((err) => {
          if (err.message === "NotFoundCardId") {
            next(new NotFoundError("Карточка с указанным _id не найдена."));
          } else if (err.name === "CastError") {
            next(
              new BadRequestError(
                "Переданы некорректные данные для удаления карточки."
              )
            );
          } else {
            next(err);
          }
        });
    });
};

const likeCard = (req, res, next) => {
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
        next(new NotFoundError("Карточка с указанным _id не найдена."));
      } else if (err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные для постановки лайка."
          )
        );
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
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
        next(new NotFoundError("Карточка с указанным _id не найдена."));
      } else if (err.name === "CastError") {
        next(
          new BadRequestError(
            "Переданы некорректные данные для удаления лайка."
          )
        );
      } else {
        next(err);
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
