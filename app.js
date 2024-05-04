import "dotenv/config";

// import express, { json } from "express"; hw2
import express from "express";
import morgan from "morgan";
import cors from "cors";

// import contactsRouter from "./routes/contactsRouter.js"; hw2
import routes from "./routes/index.js";

import "./db/db.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// app.use("/api/contacts", contactsRouter); hw2
app.use("/api", routes);

// app.use((_, res) => { hw2
// res.status(404).json({ message: "Route not found" }); hw2
app.use((req, res, next) => {
  res.status(404).send("Not found");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  // res.status(status).json({ message }); hw2
  console.log(err);
  res.status(status).send("Internal server error");
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
