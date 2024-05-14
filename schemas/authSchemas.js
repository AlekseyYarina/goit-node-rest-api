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
