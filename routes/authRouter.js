import express from "express";
import AuthController from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import authMiddleware from "../middleware/auth.js";

import {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} from "../schemas/authSchemas.js";

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post(
  "/register",
  jsonParser,
  validateBody(registerSchema),
  AuthController.register
);
authRouter.post(
  "/login",
  jsonParser,
  validateBody(loginSchema),
  AuthController.login
);
authRouter.get("/logout", authMiddleware, AuthController.logout);
authRouter.patch(
  "/users",
  authMiddleware,
  validateBody(updateSubscriptionSchema),
  AuthController.updateSubscription
);

export default authRouter;
