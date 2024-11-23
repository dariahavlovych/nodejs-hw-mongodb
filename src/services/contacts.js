import { contactsCollection } from '../db/models/contacts.js';

export const getAllContacts = () => {
  return contactsCollection.find();
};

export const getContactById = (id) => {
  return contactsCollection.findById(id);
};

export const createContact = (contact) => {
  return contactsCollection.create(contact);
};

export const deleteContact = (id) => {
  return contactsCollection.findByIdAndDelete(id);
};
