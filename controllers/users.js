const User = require("../models/user");

// module.exports.createUser = (req, res) => {
//   const { name, about, avatar } = req.body;

//   User.create({ name, about, avatar })
//     .then((user) => res.send({ data: user }))
//     .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
// };

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: true }
  )
    .then((user) => res.status(200).send({ user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: true }
  )
    .then((user) => res.status(200).send({ user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUserInfo,
  updateAvatar,
};
