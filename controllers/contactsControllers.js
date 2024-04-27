import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema } from "./contactsSchemas.js";

const handleSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

const handleError = (res, error) => {
  console.error("Error:", error);
  res
    .status(error.status || 500)
    .json({ message: error.message || "Internal server error" });
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.listContacts();
    handleSuccess(res, contacts);
  } catch (error) {
    handleError(res, error);
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (contact !== null) {
      handleSuccess(res, contact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id);
    if (deletedContact) {
      handleSuccess(res, deletedContact);
    } else {
      throw new HttpError(404, "Not found");
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const createContact = async (req, res) => {
  try {
    const { error, value } = createContactSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, error.details[0].message);
    }
    const { name, email, phone } = value;
    const newContact = await contactsService.addContact({ name, email, phone });
    handleSuccess(res, newContact, 201);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateContact = async (req, res) => {
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
    if (updatedContact) {
      handleSuccess(res, updatedContact);
    } else {
      throw new HttpError(404, "Not found");
    }
  } catch (error) {
    handleError(res, error);
  }
};
