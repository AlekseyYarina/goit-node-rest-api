import express from "express";
import contactsRoutes from "./contactsRouter.js";
import authRoutes from "./authRouter.js";

const routes = express.Router();

routes.use("/contacts", contactsRoutes);
routes.use("/auth", authRoutes);

export default routes;
