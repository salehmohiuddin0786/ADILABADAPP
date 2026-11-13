/**
 * ADILABAD APP — BACKEND SECURITY CONFIGURATION
 */

const dotenv = require('dotenv');
dotenv.config();

const SECURITY_CONFIG = Object.freeze({
  JWT: {
    SECRET: process.env.JWT_SECRET || 'adilabad_superapp_jwt_production_secret_2026',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    REFRESH_EXPIRES_IN: '30d'
  },
  BCRYPT_SALT_ROUNDS: 12,
  RATE_LIMITS: {
    GENERAL: {
      windowMs: 15 * 60 * 1000, // 15 mins
      max: 300,
      message: 'Too many requests from this IP, please try again later.'
    },
    AUTH: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 15,
      message: 'Too many login attempts, please try again in an hour.'
    },
    BOOKINGS: {
      windowMs: 15 * 60 * 1000,
      max: 30,
      message: 'Booking request limit reached, please try again later.'
    }
  },
  COOKIES: {
    HTTP_ONLY: true,
    SECURE: process.env.NODE_ENV === 'production',
    SAME_SITE: 'lax',
    MAX_AGE: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  SENSITIVE_FIELDS: [
    'password',
    'password_hash',
    'aadhaar_number',
    'pan_number',
    'id_proof_url',
    'bank_account_number'
  ]
});

module.exports = SECURITY_CONFIG;
