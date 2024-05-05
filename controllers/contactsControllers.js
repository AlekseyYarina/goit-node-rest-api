import Contact from "../models/modelContact.js";

// import contactsService from "../services/contactsServices.js"; hw2
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const handleSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

// export const getAllContacts = async (req, res, next) => {
//   try {
//     const contacts = await contactsService.listContacts();
//     handleSuccess(res, contacts);
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.send(contacts);
  } catch (error) {
    next(error);
  }
};

// export const getOneContact = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const contact = await contactsService.getContactById(id);
//     if (contact !== null) {
//       handleSuccess(res, { contact });
//     } else {
//       throw HttpError(404, "Contact not found");
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (contact !== null) {
      handleSuccess(res, { contact });
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
    const deletedContact = await contactsService.removeContact(id);
    if (deletedContact) {
      handleSuccess(res, { deletedContact });
    } else {
      throw HttpError(404, "Contact not found");
    }
  } catch (error) {
    next(error);
  }
};

// export const createContact = async (req, res, next) => {
//   try {
//     const { error, value } = createContactSchema.validate(req.body);
//     if (error) {
//       throw HttpError(400, error.message);
//     }
//     const { name, email, phone } = value;
//     const newContact = await contactsService.addContact({ name, email, phone });
//     handleSuccess(res, { newContact }, 201);
//   } catch (error) {
//     next(error);
//   }
// };

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
    const { name, email, phone } = value;
    const updatedContact = await contactsService.updateContact(id, {
      name,
      email,
      phone,
    });
    handleSuccess(res, { updatedContact });
  } catch (error) {
    next(error);
  }
};
