# Adilabad App — Local Advertising & Discovery Platform

> **Discover Adilabad. Discover Local.**  
> A high-performance, modern local advertising, business directory, and community event discovery platform built specifically for **Adilabad, Telangana**.

---

## 🌟 Key Architecture & Business Rules

1. **Administrator-Only Content Publishing**:
   - **ONLY Administrators** have permissions to create, edit, publish, schedule, or feature advertisements, businesses, events, and banners.
   - Normal users/visitors can **only browse, search, filter, view details, save favorites, share, call, WhatsApp, and get directions**.
   - **No "Post Ad" buttons exist for regular visitors.**
2. **Private & Non-Government**:
   - A dedicated private commercial platform built for the local economy of Adilabad.
   - Clean, modern, trustworthy branding without government seals or logos.
3. **Pure JavaScript Stack**:
   - Next.js (React 18), Tailwind CSS, Framer Motion (Motion Primitives), and Lucide icons on the frontend.
   - Node.js, Express.js, and MySQL (with connection pooling) on the backend.

---

## 🔐 Credentials & Default Accounts

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@adilabadapp.com` | `Admin@123456` | Full Control: Admin Dashboard, Ads, Businesses, Events, Banners, Users, Reports, Analytics, Settings |
| **Normal User** | `user@adilabadapp.com` | `User@123456` | Public browsing, Save Favorites, Search, Reports, Profile |

---

## 🚀 Running the Project

### Prerequisites
- Node.js v18+ (tested on Node.js v24)
- MySQL 8.0+ or MySQL 9.x (running locally on port `3306`)

### 1. Backend Setup (`/backend`)
```bash
cd backend
npm install

# Database initialization & seeding (executed once)
npm run init-db
npm run seed-db

# Start backend REST API server (runs on http://localhost:5000)
npm start
```

### 2. Frontend Setup (`/frontend`)
```bash
cd frontend
npm install

# Production build and run (runs on http://localhost:3000)
npm run build
npm run start

# Or development mode:
npm run dev
```

---

## 🗺️ Website Routes & Structure

### 🌐 Public Portal (`http://localhost:3000`)
- `/` — Homepage featuring Hero Search, Categories, Featured Ads, Latest Ads, Businesses, Events, and Explore Adilabad
- `/advertisements` — Full advertisement catalog with category/location filtering, sorting, and pagination
- `/advertisements/[slug]` — High-impact advertisement details with multi-image gallery, lightbox, phone/WhatsApp CTA, map directions, sharing, bookmarking, and fraud reporting
- `/categories` — Grid of all 13 local business and trade categories
- `/categories/[slug]` — Category-filtered listings
- `/businesses` — Local business directory featuring verified Adilabad establishments
- `/businesses/[slug]` — Detailed business profile with contact options, opening hours, services, and Google Maps directions
- `/events` — Upcoming community festivals, exhibitions, and fairs in Adilabad
- `/events/[slug]` — Event details with registration links and location maps
- `/explore` — Curated local guide (Kuntala Waterfalls, Mavala Lake, Jainath Temple, local bazaars)
- `/search` — Global instant search across advertisements, businesses, events, and categories
- `/favorites` — Saved advertisements, businesses, and events (synced with user account)
- `/login` — User authentication and registration
- `/profile` — User profile, saved listings, and notifications
- `/about` — About the Adilabad App platform
- `/contact` — Contact support form and inquiries
- `/privacy-policy` — Platform privacy policy
- `/terms` — Terms of service

### 🛡️ Admin Dashboard (`http://localhost:3000/admin`)
- `/admin/login` — Dedicated secure administrator login
- `/admin` — Overview Dashboard with KPI stats, activity feed, and growth metrics
- `/admin/advertisements` — Full advertisement management (Draft, Scheduled, Published, Expired, Archived)
- `/admin/advertisements/create` — Rich advertisement publisher with image uploads, pricing, expiry dates, and tags
- `/admin/advertisements/[id]/edit` — Edit existing advertisements
- `/admin/categories` — Category manager
- `/admin/businesses` & `/admin/businesses/create` — Local business directory manager
- `/admin/events` & `/admin/events/create` — Community event manager
- `/admin/banners` — Promotional homepage hero and banner manager
- `/admin/users` — User account management and status controls
- `/admin/reports` — Community content reports and fraud flags moderation
- `/admin/notifications` — Notification broadcast system
- `/admin/analytics` — Detailed engagement, view, and click analytics
- `/admin/settings` — Platform branding, contact info, and maintenance mode controls

---

## 📡 Backend REST API Endpoints (`http://localhost:5000`)

- **Health**: `GET /api/health`
- **Auth**:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- **Advertisements**:
  - `GET /api/advertisements` (Public list with filters & search)
  - `GET /api/advertisements/detail/:slug` (Public ad details)
  - `POST /api/advertisements/:id/click` (Interaction tracking)
  - `GET /api/advertisements/admin/list` (Admin listing)
  - `POST /api/advertisements/admin/create` (Admin create ad)
  - `PUT /api/advertisements/admin/update/:id` (Admin update ad)
  - `DELETE /api/advertisements/admin/delete/:id` (Admin delete ad)
  - `PATCH /api/advertisements/admin/:id/status` (Status change)
  - `PATCH /api/advertisements/admin/:id/feature` (Toggle featured)
- **Businesses**:
  - `GET /api/businesses`
  - `GET /api/businesses/detail/:slug`
  - `POST /api/businesses/admin/create`
  - `PUT /api/businesses/admin/update/:id`
  - `DELETE /api/businesses/admin/delete/:id`
- **Events**:
  - `GET /api/events`
  - `GET /api/events/detail/:slug`
  - `POST /api/events/admin/create`
  - `PUT /api/events/admin/update/:id`
  - `DELETE /api/events/admin/delete/:id`
- **Categories**: `GET /api/categories`, `GET /api/categories/:slug`
- **Banners**: `GET /api/banners`
- **Favorites**: `GET /api/favorites`, `POST /api/favorites/toggle`
- **Reports**: `POST /api/reports` (Public reporting), `GET /api/reports/admin/list` (Admin moderation)
- **Admin Management**:
  - `GET /api/admin/analytics/overview`
  - `GET /api/admin/users`
  - `GET /api/admin/audit-logs`
  - `GET /api/admin/settings`
  - `POST /api/admin/upload` (Secured multi-image upload with MIME verification)
# ADILABADAPP
