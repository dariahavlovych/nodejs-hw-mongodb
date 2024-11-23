import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import contactsRouter from './routers/contacts.js';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

export const setupServer = () => {
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());

  app.use(contactsRouter);

  // app.get('/contacts', async (req, res) => {
  //   const contacts = await getAllContacts();
  //   res.status(200).send({
  //     status: 200,
  //     message: 'Successfully found contacts!',
  //     data: contacts,
  //   });
  // });

  // app.get('/contacts/:contactId', async (req, res) => {
  //   const { contactId } = req.params;
  //   const contact = await getContactById(contactId);

  //   if (contact === null) {
  //     return res.status(404).send({ message: 'Contact not found' });
  //   }

  //   res.status(200).send({
  //     status: 200,
  //     message: `Successfully found contact with id ${contactId}!`,
  //     data: contact,
  //   });
  // });

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
