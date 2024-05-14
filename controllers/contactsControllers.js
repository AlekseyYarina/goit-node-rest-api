import { Contact } from "../models/modelContact.js";
import HttpError from "../helpers/HttpError.js";

const handleSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

export const getAllContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const isFavorite = req.query.favorite === "true";

    const startIndex = (page - 1) * limit;

    let query = { ownerId: req.user.id };
    if (isFavorite) {
      query.favorite = true;
    }

    const totalCount = await Contact.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const contacts = await Contact.find(query).skip(startIndex).limit(limit);

    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      totalContacts: totalCount,
    };

    res.send({ contacts, pagination });
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findOne({ _id: id, ownerId: req.user.id });
    if (!contact) {
      return res.status(404).send({ message: "Contact not found" });
    }
    handleSuccess(res, { contact });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findOneAndDelete({
      _id: id,
      ownerId: req.user.id,
    });
    if (!contact) {
      return res.status(404).send({ message: "Contact not found" });
    }
    handleSuccess(res, { deletedContact: contact });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
    ownerId: req.user.id,
  };

  try {
    const result = await Contact.create(contact);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: id, ownerId: req.user.id },
      { name, email, phone, favorite },
      { new: true }
    );
    if (!contact) {
      return res.status(404).send({ message: "Contact not found" });
    }
    handleSuccess(res, { updatedContact: contact });
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: id, ownerId: req.user.id },
      { favorite },
      { new: true }
    );
    if (!contact) {
      return res.status(404).send({ message: "Contact not found" });
    }
    handleSuccess(res, { updatedContact: contact });
  } catch (error) {
    next(error);
  }
};
