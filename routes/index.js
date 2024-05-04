import express from "express";
import contactRoutes from "./contactsRouter.js";

const routes = express.Router();

routes.use("/contacts", contactRoutes);

export default routes;
