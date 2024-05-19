import express from "express";
import UserController from "../controllers/userControllers.js";
import uploadMiddleware from "../middleware/upload.js";

const router = express.Router();

router.patch(
  "/avatar",
  uploadMiddleware.single("avatar"),
  UserController.uploadAvatar
);

export default router;
