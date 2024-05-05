import mongoose from "mongoose";

export const contactSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);

export const contactStatusSchema = mongoose.Schema(
  {
    favorite: {
      type: Boolean,
      default: false,
      required: [true],
    },
  },
  { versionKey: false }
);

export const ContactStatus = mongoose.model(
  "ContactStatus",
  contactStatusSchema
);
