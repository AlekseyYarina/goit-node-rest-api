import express from "express";
import authMiddleware from "../middleware/auth.js";
import contactsRoutes from "./contactsRouter.js";
import authRoutes from "./authRouter.js";

const routes = express.Router();

routes.use("/contacts", authMiddleware, contactsRoutes);
routes.use("/auth", authRoutes);

export default routes;
