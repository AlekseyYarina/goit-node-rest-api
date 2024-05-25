import express from "express";
import UserController from "../controllers/userControllers.js";
import uploadMiddleware from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/verify/:verificationToken", UserController.verify);

router.patch(
  "/avatar",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  UserController.uploadAvatar
);

router.get("/avatar", authMiddleware, UserController.getAvatar);

export default router;
