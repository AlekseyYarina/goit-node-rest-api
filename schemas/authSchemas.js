import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const validSubscriptions = ["starter", "pro", "business"];
export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...validSubscriptions)
    .required(),
});
