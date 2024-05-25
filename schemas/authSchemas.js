import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
});

const validSubscriptions = ["starter", "pro", "business"];
export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...validSubscriptions)
    .required()
    .messages({
      "any.required": "Subscription type is required.",
      "any.only": "Invalid subscription type.",
    }),
});

export const resendVerificationEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required field email",
    "string.email": "invalid email format",
  }),
});

export default function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
}
