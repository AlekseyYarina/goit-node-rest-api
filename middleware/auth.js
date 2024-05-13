import jwt, { decode } from "jsonwebtoken";
import User from "../middleware/auth.js";

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (typeof authorizationHeader === "undefined") {
    return res.status(401).send({ message: "Invalid token" });
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }

    try {
      const user = await User.finedById(decode.id);

      if (user === null) {
        res.status(401).send({ message: "Invalid token" });
      }

      if (user.token !== token) {
        res.status(401).send({ message: "Invalid token" });
      }
      req.user = {
        id: decode.id,
        email: decode.email,
      };
      next();
    } catch (error) {
      next(error);
    }
  });
}
export default auth;