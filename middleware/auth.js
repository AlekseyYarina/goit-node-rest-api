import jwt from "jsonwebtoken";

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (typeof authorizationHeader === "undefined") {
    return res.status(401).send({ message: "Invalid token" });
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);

  if (bearer !== "bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }
  });
  next();
}
export default auth;
