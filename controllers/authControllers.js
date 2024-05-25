import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import crypto from "node:crypto";

import User from "../models/modelUser.js";
import mail from "../mail.js";

async function register(req, res, next) {
  const { password, email, subscription, token } = req.body;
  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });
    if (user !== null) {
      return res.status(409).send({ message: "User already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const gravatarUrl = gravatar.url(emailInLowerCase, {
      s: "250",
      r: "pg",
      d: "mm",
    });

    const avatarURL = gravatarUrl;
    const verificationToken = crypto.randomUUID();

    const newUser = await User.create({
      password: passwordHash,
      email: emailInLowerCase,
      subscription,
      token,
      avatarURL,
      verificationToken,
    });

    mail.sendMail({
      to: emailInLowerCase,
      from: "aleksey.yarina@gmail.com",
      subject: "Welcome to our app!",
      html: `To confirm your email please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your email please popen the link http://localhost:3000/api/users/verify/${verificationToken}`,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
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
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    if (user.verify === false) {
      return res.status(401).send({ message: "Please verify your email" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { token: null });
    if (!user) {
      return res.status(401).send({ message: "Not authorized" });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function updateSubscription(req, res, next) {
  const { subscription } = req.body;
  const allowedSubscriptions = ["starter", "pro", "business"];

  if (!allowedSubscriptions.includes(subscription)) {
    return res.status(400).send({ message: "Invalid subscription type" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { subscription },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({
      message: "Subscription updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

export default { register, login, logout, updateSubscription };
