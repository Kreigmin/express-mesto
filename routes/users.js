const express = require("express");

const router = express.Router();
const { createUser, getAllUsers, getUser } = require("../controllers/users");

router.post("/users", createUser);

router.get("/users", getAllUsers);

router.get("/users/:id", getUser);

module.exports = router;
