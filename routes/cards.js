const express = require("express");

const router = express.Router();

const { createCard, getAllCards, deleteCard } = require("../controllers/cards");

router.get("/cards", getAllCards);
router.post("/cards", createCard);
router.delete("/cards/:cardId", deleteCard);

module.exports = router;
