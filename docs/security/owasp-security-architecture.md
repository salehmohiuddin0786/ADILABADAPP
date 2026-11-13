# OWASP Security Architecture & Best Practices Checklist — Adilabad App

Reference: [OWASP Cheat Sheet Series](https://github.com/OWASP/CheatSheetSeries)

This security framework establishes non-negotiable security controls across all 5 panels of the Adilabad App (Public Website, Customer Panel, Owner Panel, Admin Panel, and Staff Panel).

---

## 1. Authentication & Session Management Cheat Sheet

- **Token Storage**: JWTs must never be stored in accessible insecure local cookies without `HttpOnly` and `SameSite=Strict`.
- **Session Expiration**: Enforce reasonable token expiry (e.g. 7 days max for standard users, 12 hours for admin/staff).
- **Session Revocation**: Invalidate tokens on password reset, role alteration, or explicit logout.
- **Brute-Force Protection**: Enforce exponential backoff or IP rate-limiting on `/api/v1/auth/login` and `/api/v1/auth/register` (max 5 failed attempts per 15 minutes).

## 2. Password Storage Cheat Sheet

- **Hashing Algorithm**: Use `bcryptjs` with a work factor of minimum 10 rounds (`bcrypt.hash(password, 10)`).
- **Password Complexity**: Minimum 8 characters, requiring at least one number and special character.
- **Plaintext Ban**: Never log, echo, or store raw passwords or verification pins in application logs or error stack traces.

## 3. Access Control & Authorization (Backend Files Only)

- **Principle of Least Privilege**: Access control must be validated on **every protected backend route** via `authenticate.js` and `authorize.js`.
- **Zero Frontend Trust**: Never trust roles, permissions, or user IDs passed in request bodies or query parameters. Derive identity exclusively from verified JWT payload (`req.user.id`, `req.user.role`).
- **Resource Ownership Verification**: Every owner/customer mutating an object must be verified against database ownership:
  ```javascript
  // Example OWASP Ownership Check
  const [listing] = await db.query('SELECT user_id FROM listings WHERE id = ?', [id]);
  if (!listing || listing.user_id !== req.user.id && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ success: false, message: 'Forbidden: You do not own this resource' });
  }
  ```
- **Panel Separation**: Administrative routes (`/api/v1/admin/*`) and Staff routes (`/api/v1/staff/*`) must strictly reject `CUSTOMER`, `INDIVIDUAL_OWNER`, and `BUSINESS_OWNER` roles.

## 4. SQL Injection Prevention Cheat Sheet

- **Parameterized Queries**: 100% of queries in `mysql2/promise` must use positional `?` placeholders or ORM parameter binding.
  - **Strictly Banned**: String concatenation or template literals (`SELECT * FROM users WHERE id = ${id}`).

## 5. File Upload Security Cheat Sheet

- **MIME & Extension Whitelisting**: Accept only validated image formats (`image/jpeg`, `image/png`, `image/webp`).
- **File Renaming**: Rename uploaded files to UUIDv4 or random cryptographic hashes (`${Date.now()}-${crypto.randomBytes(8).toString('hex')}.webp`). Never retain client-supplied original filenames.
- **Directory Isolation**: Store files outside web server execution roots; serve statically with `X-Content-Type-Options: nosniff`.
- **Size Limits**: Enforce maximum file size (5MB per image).

## 6. Input Validation & Data Sanitization

- **Type & Length Checks**: Validate phone numbers (E.164 / Indian format `+91 XXXXX XXXXX`), emails, and strings using centralized validation middleware before database interaction.
- **Cross-Site Scripting (XSS)**: Next.js automatically escapes JSX bindings. For any raw HTML or user content, sanitize with DOMPurify.

## 7. Security Headers (OWASP Secure Headers Project)

- `X-Frame-Options: DENY` (Prevent Clickjacking)
- `X-Content-Type-Options: nosniff` (Prevent MIME-type sniffing)
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (Force HTTPS)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`: Restrict unauthorized script execution and style injection.
