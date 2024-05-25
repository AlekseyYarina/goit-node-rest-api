import express from "express";
import UserController from "../controllers/userControllers.js";
import uploadMiddleware from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";

import validateBody from "../schemas/authSchemas.js";
import { resendVerificationEmailSchema } from "../schemas/authSchemas.js";

const router = express.Router();

router.get("/verify/:verificationToken", UserController.verify);
router.post(
  "/verify",
  validateBody(resendVerificationEmailSchema),
  UserController.resendVerificationEmail
);

router.patch(
  "/avatar",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  UserController.uploadAvatar
);

router.get("/avatar", authMiddleware, UserController.getAvatar);

export default router;
