import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  APP_PORT: Joi.string().default(3000),
  SYNCHRONIZE: Joi.boolean().default(true),
  FRONT_URL: Joi.string().required(),
  BACKOFFICE_URL: Joi.string().required(),
  TZ: Joi.string().default('America/Santiago'),
  DB_TYPE: Joi.string().default('mysql'),
  DB_USERNAME: Joi.string().default('root'),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(3306),
  DB_NAME: Joi.string().default('calypso_db'),
  DB_PASSWORD: Joi.string().allow(null, '').default(''),
  MAIL_HOST: Joi.string().default('mail.calypsospa.cl'),
  MAIL_PORT: Joi.number().default(465),
  MAIL_USER: Joi.string().email().required(),
  MAIL_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  ADMIN_EMAIL: Joi.string().email().required(),
  ADMIN_PHONE: Joi.string().required(),
});
