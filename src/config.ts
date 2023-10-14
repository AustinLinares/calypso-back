import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    DB_USERNAME: process.env.DB_USERNAME,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    APP_PORT: process.env.APP_PORT,
  };
});
