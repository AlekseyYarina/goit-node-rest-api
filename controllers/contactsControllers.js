import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const handleSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    req.contacts = contacts;
    next();
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (contact !== null) {
      req.contact = contact;
      next();
    } else {
      throw new HttpError(404, "Contact not found");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id);
    if (deletedContact) {
      req.deletedContact = deletedContact;
      next();
    } else {
      throw new HttpError(404, "Contact not found");
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error, value } = createContactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.details[0].message);
    }
    const { name, email, phone } = value;
    const newContact = await contactsService.addContact({ name, email, phone });
    req.newContact = newContact;
    next();
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = updateContactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.details[0].message);
    }
    const { name, email, phone } = value;
    if (!name && !email && !phone) {
      throw new HttpError(400, "Body must have at least one field");
    }
    const updatedContact = await contactsService.updateContact(id, {
      name,
      email,
      phone,
    });
    req.updatedContact = updatedContact;
    next();
  } catch (error) {
    next(error);
  }
};
