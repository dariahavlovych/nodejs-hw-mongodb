import { registerUser } from '../services/auth.js';

export const registerUserController = async (req, res, next) => {
  const registeredUser = await registerUser(req.body);

  res.status(201).send({
    status: 201,
    message: 'Successfully registered a user!',
    data: registeredUser,
  });
};
