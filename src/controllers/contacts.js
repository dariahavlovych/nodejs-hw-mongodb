import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (contact === null) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).send({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactsController = async (req, res) => {
  //   const contact = {
  //     name: req.body.name,
  //     phoneNumber: req.body.phoneNumber,
  //     email: req.body.email,
  //     isFavourite: req.body.isFavourite,
  //     contactType: req.body.contactType,
  //   };

  const result = await createContact(req.body);

  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: result,
  });
};

export const deleteContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const result = await deleteContact(contactId);

  if (result === null) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};
