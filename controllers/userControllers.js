import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";

import User from "../models/modelUser.js";
import mail from "../mail.js";

async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "File not transferred" });
    }

    const avatarFilename = req.file.filename;
    const avatarURL = `/avatars/${avatarFilename}`;
    const avatarPath = path.resolve("public/avatars", avatarFilename);

    await fs.rename(req.file.path, avatarPath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL },
      { new: true }
    );

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    const avatar = await Jimp.read(avatarPath);
    await avatar.resize(250, 250).writeAsync(avatarPath);

    res.send(user);
  } catch (error) {
    next(error);
  }
}

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }
    if (user.avatarURL === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }
    res.sendFile(path.resolve("public", user.avatarURL));
  } catch (error) {
    next(error);
  }
}

async function verify(req, res, next) {
  const { verificationToken } = req.params;
  console.log(verificationToken);
  console.log(req.params);
  try {
    const user = await User.findOneAndUpdate(
      { verificationToken },
      { verify: true, verificationToken: null },
      { new: true }
    );

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
}

async function resendVerificationEmail(req, res, next) {
  const { email } = req.body;
  const emailInLowerCase = email.toLowerCase();

  if (!email) {
    return res.status(400).send({ message: "missing required field email" });
  }

  try {
    const user = await User.findOne({ email: emailInLowerCase });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .send({ message: "Verification has already been passed" });
    }

    const verificationToken = user.verificationToken || crypto.randomUUID();

    if (!user.verificationToken) {
      user.verificationToken = verificationToken;
      await user.save();
    }

    const emailMessage = mail.createVerificationEmail(
      emailInLowerCase,
      verificationToken
    );
    mail.sendMail(emailMessage);

    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}

export default { uploadAvatar, getAvatar, verify, resendVerificationEmail };
