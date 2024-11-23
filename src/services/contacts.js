import { contactsCollection } from '../db/models/contacts.js';

export const getAllContacts = () => {
  return contactsCollection.find();
};

export const getContactById = (contactId) => {
  return contactsCollection.findById(contactId);
};

export const createContact = (contact) => {
  return contactsCollection.create(contact);
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await contactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = (contactId) => {
  return contactsCollection.findByIdAndDelete(contactId);
};
