import * as fs from "node:fs/promises";
import path from "node:path";

import User from "../models/modelUser.js";

async function uploadAvatar(req, res, next) {
  try {
    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: req.file.filename },
      { new: true }
    );

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }
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
    res.sendFile(path.resolve("public/avatars", user.avatarURL));
  } catch (error) {
    next(error);
  }
}

export default { uploadAvatar, getAvatar };
