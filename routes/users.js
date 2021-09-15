const express = require("express");

const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUser,
  updateUserInfo,
  updateAvatar,
} = require("../controllers/users");

router.post("/users", createUser);

router.get("/users", getAllUsers);

router.get("/users/me", getUser);

router.patch("/users/me", updateUserInfo);

router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
