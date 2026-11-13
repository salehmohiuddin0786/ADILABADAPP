/**
 * ADILABAD APP — INPUT VALIDATION & SANITIZATION MIDDLEWARE
 */

function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];
    for (const [field, rules] of Object.entries(schema)) {
      const val = req.body[field];

      if (rules.required && (val === undefined || val === null || val === '')) {
        errors.push(`${field} is required.`);
        continue;
      }

      if (val !== undefined && val !== null && val !== '') {
        if (rules.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) errors.push(`${field} must be a valid email address.`);
        }
        if (rules.type === 'phone') {
          const cleanPhone = String(val).replace(/\D/g, '');
          if (cleanPhone.length < 10 || cleanPhone.length > 12) {
            errors.push(`${field} must be a valid 10-digit mobile number.`);
          }
        }
        if (rules.type === 'number' && isNaN(Number(val))) {
          errors.push(`${field} must be a valid numeric value.`);
        }
        if (rules.minLength && String(val).length < rules.minLength) {
          errors.push(`${field} must be at least ${rules.minLength} characters.`);
        }
        if (rules.maxLength && String(val).length > rules.maxLength) {
          errors.push(`${field} must not exceed ${rules.maxLength} characters.`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors
      });
    }

    next();
  };
}

module.exports = {
  validateBody
};
