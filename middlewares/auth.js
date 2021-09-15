const jwt = require("jsonwebtoken");

const FORBIDDEN_ERROR_CODE = 403;
const UNAUTHORIZED_ERROR_CODE = 401;

const { JWT_SECRET } = process.env;
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.headers.cookie) {
    return res
      .status(FORBIDDEN_ERROR_CODE)
      .send({ message: "Необходима авторизация" });
  }
  const token = req.headers.cookie.replace("jwt=", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZED_ERROR_CODE)
      .send({ message: "С токеном что-то не так" });
  }

  req.user = payload;

  next();
};
