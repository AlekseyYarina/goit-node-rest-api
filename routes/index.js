import express from "express";
import authMiddleware from "../middleware/auth.js";
import contactsRoutes from "./contactsRouter.js";
import authRoutes from "./authRouter.js";
import userRoutes from "./usersRouter.js";

const routes = express.Router();

routes.use("/contacts", authMiddleware, contactsRoutes);
routes.use("/auth", authRoutes);
routes.use("/users", authMiddleware, userRoutes); // may by add authMiddleware,

export default routes;
