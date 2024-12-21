import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import { randomBytes } from 'crypto';
import { UsersCollection } from '../db/models/user.js';
import {
  FIFTEEN_MINUTES,
  ONE_MONTH,
  TEMPLATES_DIR,
} from '../constants/index.js';
import { SessionCollection } from '../db/models/session.js';
import { sendEmails } from '../utils/sendEmails.js';
import { validateCode } from '../utils/googleOAuth2.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const encryptedPass = await bcrypt.hash(payload.password, 10);
  return await UsersCollection.create({
    ...payload,
    password: encryptedPass,
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_MONTH),
  };
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user === null) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  const isEqualPass = await bcrypt.compare(payload.password, user.password);

  if (!isEqualPass) {
    throw createHttpError(401, 'Email or password is incorrect');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const session = createSession();

  return await SessionCollection.create({
    userId: user._id,
    ...session,
  });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  const newSession = createSession();

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const sendResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '5m' },
  );

  const resetPassTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (await fs.readFile(resetPassTemplatePath)).toString();

  const emailTemplate = handlebars.compile(templateSource);

  const html = emailTemplate({
    name: user.name,
    link: `${process.env.APP_DOMAIN}/auth/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmails({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, process.env.JWT_SECRET);
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (user === null) {
    throw createHttpError(404, 'User not found');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const encryptedPass = await bcrypt.hash(payload.password, 10);

  await UsersCollection.findOneAndUpdate(
    { _id: user._id },
    { password: encryptedPass },
  );
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401, 'Unauthorized');

  let user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    const password = await bcrypt.hash(randomBytes(30).toString('base64'), 10);
    user = await UsersCollection.create({
      name: payload.name,
      email: payload.email,
      password,
    });
  }

  const session = createSession();

  await SessionCollection.deleteOne({ userId: user._id });

  return await SessionCollection.create({ userId: user._id, ...session });
};
