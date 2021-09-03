const Card = require("../models/card");

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.body;
  Card.findByIdAndDelete(cardId)
    .then(() => res.status(200).send({ message: "Пост удалён" }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const likeCard = (req, res) => {
  const { cardId } = req.body;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const dislikeCard = (req, res) => {
  const { cardId } = req.body;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
