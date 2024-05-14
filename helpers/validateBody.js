import HttpError from "./HttpError.js";

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(422).send({ message: errorMessage });
    }
    next();
  };

  return func;
};

export default validateBody;
