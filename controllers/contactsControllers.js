import { Contact, ContactStatus } from "../models/modelContact.js";

import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactShema,
} from "../schemas/contactsSchemas.js";

const handleSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (contact !== null) {
      handleSuccess(res, { contact });
      res.send(id);
    } else {
      throw HttpError(404, "Contact not found");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (deletedContact) {
      handleSuccess(res, { deletedContact });
    } else {
      // throw HttpError(404, "Contact not found");
      return res.status(404).send("Contact not found");
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error, value } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const contact = {
      name: value.name,
      email: value.email,
      phone: value.phone,
      favorite: value.favorite,
    };

    try {
      const result = await Contact.create(contact);

      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const contact = {
      name: value.name,
      email: value.email,
      phone: value.phone,
      favorite: value.favorite,
    };
    try {
      const result = await Contact.findByIdAndUpdate(id, contact, {
        new: true,
      });
      if (result === null) {
        return res.status(404).send("Contact not found");
      }
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = updateStatusContactShema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const contactStatus = {
      favorite: value.favorite,
    };
    try {
      const result = await ContactStatus.findByIdAndUpdate(id, contactStatus, {
        new: true,
      });
      if (result === null) {
        return res.status(404).send("Contact not found");
      }
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
