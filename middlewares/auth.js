const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/unauthorized-error");
const ForbiddenError = require("../errors/forbidden-error");

const { JWT_SECRET } = process.env;
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.headers.cookie) {
    return next(new ForbiddenError("Необходима авторизация"));
  }
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("С токеном что-то не так."));
  }

  req.user = payload;

  next();
};
