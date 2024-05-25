import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "node:path";

import routes from "./routes/index.js";
import "./db/db.js";

const app = express();

app.use("/avatars", express.static(path.resolve("public/avatars")));

app.use(morgan("tiny"));

app.use(cors());

app.use(express.json());

app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).send("Not found");
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  console.log(err);
  res.status(status).send("Internal server error");
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});

// const transport = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: process.env.MAILTRAP_USERNAME,
//     pass: process.env.MAILTRAP_PASSWORD,
//   },
// });

// const message = {
//   to: "aleksey.yarina@gmail.com",
//   from: "aleksey.yarina@gmail.com",
//   subject: "Test nodemailer",
//   html: `<h1 style="color: red">Click on link a get a 90% discount on brand new iPhone 15 Pro Max</h1>`,
//   text: `Click on link a get a 90% discount on brand new iPhone 15 Pro Max`,
// };

// transport.sendMail(message).then(console.log).catch(console.error);
