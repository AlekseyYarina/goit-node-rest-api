import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/modelUser.js";

async function register(req, res, next) {
  const { password, email, subscription, token } = req.body;
  const emailInLowerCase = email.toLowerCase();
  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "User allready registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      password: passwordHash,
      email: emailInLowerCase,
      subscription,
      token,
    });
    res.status(201).send({ message: "Registretion succesfully" });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });
    if (user === null) {
      console.log("Email");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }
    console.log(user);
    console.log(req.body);
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      console.log("Password");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.send({ token });
  } catch (error) {
    next(error);
  }
}

export default { register, login };
