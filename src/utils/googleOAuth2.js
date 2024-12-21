import { OAuth2Client } from 'google-auth-library';
import createHttpError from 'http-errors';

const googleOAuthClient = new OAuth2Client({
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
});

export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  try {
    const response = await googleOAuthClient.getToken(code);

    if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');

    const ticket = await googleOAuthClient.verifyIdToken({
      idToken: response.tokens.id_token,
    });

    return ticket;
  } catch (error) {
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status <= 499
    ) {
      throw createHttpError(401, 'Unauthorized');
    }

    throw error;
  }
};
