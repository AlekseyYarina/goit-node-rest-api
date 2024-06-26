import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;
async function run() {
  try {
    await mongoose.connect(DB_URI);
    console.info("Database connection successful");
  } finally {
  }
}
run().catch((error) => {
  console.error(error);
  process.exit(1);
});
