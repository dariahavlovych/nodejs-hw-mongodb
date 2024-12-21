import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should be min 3 characters',
    'string.max': 'Name should be max 20 characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should be min 3 characters',
    'string.max': 'Phone number should be max 20 characters',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().min(3).max(40).messages({
    'string.base': 'Email should be a string',
    'string.min': 'Email should be min 3 characters',
    'string.max': 'Email should be max 40 characters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'string.base': 'Type should be a string',
      'string.min': 'Type should be min 3 characters',
      'string.max': 'Type should be max 20 characters',
      'any.required': 'Type is required',
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should be min 3 characters',
    'string.max': 'Name should be max 20 characters',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should be min 3 characters',
    'string.max': 'Phone number should be max 20 characters',
  }),
  email: Joi.string().min(3).max(40).messages({
    'string.base': 'Email should be a string',
    'string.min': 'Email should be min 3 characters',
    'string.max': 'Email should be max 40 characters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid('work', 'home', 'personal')
    .messages({
      'string.base': 'Type should be a string',
      'string.min': 'Type should be min 3 characters',
      'string.max': 'Type should be max 20 characters',
    }),
});
