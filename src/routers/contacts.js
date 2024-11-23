import express from 'express';
import {
  createContactsController,
  deleteContactByIdController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post('/', jsonParser, ctrlWrapper(createContactsController));

router.patch('/:contactId', jsonParser, ctrlWrapper(patchContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactByIdController));

export default router;
