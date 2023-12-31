import dotenv from 'dotenv'
import path from 'path'
import Joi from 'joi'

dotenv.config({
  path: path.join(__dirname, '../../../.env')
})

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),

    DATABASE_TYPE: Joi.string().required().description('Database Type'),
    DATABASE_NAME: Joi.string().required().description('Database Name'),
    DATABASE_HOST: Joi.string().required().description('Database Host'),
    DATABASE_USER: Joi.string().required().description('Database USER'),
    DATABASE_PASS: Joi.string().required().description('Database PASS'),
    DATABASE_PORT: Joi.string().required().description('Database PORT'),

    URL_WEB: Joi.string().required().description('Url web'),
    URL_API: Joi.string().required().description('Url api'),

    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description(
      'the from field in the emails sent by the app'
    )
  })
  .unknown()

const { value: envVars } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env)

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  logs: envVars.NODE_ENV === 'production' ? 'combined' : 'development',
  url: {
    web: envVars.URL_WEB,
    api: envVars.URL_API
  },
  base_url: envVars.BASE_URL,
  database: {
    type: envVars.DATABASE_TYPE,
    host: envVars.DATABASE_HOST,
    port: envVars.DATABASE_PORT,
    username: envVars.DATABASE_USER,
    password: envVars.DATABASE_PASS,
    database: envVars.DATABASE_NAME
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD
      }
    },
    from: envVars.EMAIL_FROM
  },
  twilio: {
    accountSid: envVars.TWILIO_ACCOUNT_SID,
    authToken: envVars.TWILIO_AUTH_TOKEN
  },
  language: {
    default: envVars.DEFAULT_LANGUAGE
  }
}
