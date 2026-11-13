-- ============================================================================
-- ADILABAD APP — COMPLETE DATABASE SCHEMA
-- Hyperlocal Discovery, Marketplace & Multi-Panel Operations
-- Dialect: MySQL 8.0+
-- ============================================================================

CREATE DATABASE IF NOT EXISTS adilabad_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE adilabad_app;

-- ----------------------------------------------------------------------------
-- 1. ACCESS CONTROL & USER IDENTITY
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  module VARCHAR(50) NOT NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500) NULL,
  role_id INT NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  is_verified TINYINT(1) DEFAULT 0,
  preferred_language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  bio TEXT NULL,
  date_of_birth DATE NULL,
  gender ENUM('male', 'female', 'other', 'undisclosed') DEFAULT 'undisclosed',
  aadhaar_masked VARCHAR(20) NULL,
  whatsapp_number VARCHAR(20) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_type ENUM('home', 'work', 'warehouse', 'other') DEFAULT 'home',
  street_address VARCHAR(255) NOT NULL,
  landmark VARCHAR(150) NULL,
  locality VARCHAR(100) NOT NULL,
  town VARCHAR(100) NOT NULL DEFAULT 'Adilabad',
  district VARCHAR(100) NOT NULL DEFAULT 'Adilabad',
  pincode VARCHAR(10) NOT NULL DEFAULT '504001',
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  is_default TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 2. OWNER VERIFICATION & CAPABILITIES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS owner_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  owner_type ENUM('individual', 'business', 'institution', 'agency') NOT NULL,
  business_legal_name VARCHAR(200) NULL,
  trade_name VARCHAR(200) NULL,
  gstin VARCHAR(30) NULL,
  pan_number VARCHAR(20) NULL,
  verification_status ENUM('unverified', 'pending', 'approved', 'rejected') DEFAULT 'pending',
  rejection_reason TEXT NULL,
  verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS owner_capabilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  capability ENUM('rentals', 'buy_sell', 'services', 'jobs', 'properties', 'business', 'agriculture', 'weddings') NOT NULL,
  is_approved TINYINT(1) DEFAULT 0,
  approved_at TIMESTAMP NULL,
  FOREIGN KEY (owner_id) REFERENCES owner_profiles(id) ON DELETE CASCADE,
  UNIQUE KEY unique_owner_capability (owner_id, capability)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS verification_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  document_type ENUM('aadhaar', 'pan', 'trade_license', 'gst_certificate', 'utility_bill', 'other') NOT NULL,
  document_url VARCHAR(500) NOT NULL,
  status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES owner_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 3. LOCATIONS & LOCAL GEOGRAPHY
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS districts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  state VARCHAR(100) NOT NULL DEFAULT 'Telangana',
  is_active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS towns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  district_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NULL,
  FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS localities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  town_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  landmark VARCHAR(150) NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  FOREIGN KEY (town_id) REFERENCES towns(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 4. ADVERTISEMENTS & CAMPAIGNS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS advertisement_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  icon VARCHAR(50) DEFAULT 'Tag',
  display_order INT DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS advertisements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(270) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  business_name VARCHAR(150) NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_whatsapp VARCHAR(20) NULL,
  website_url VARCHAR(300) NULL,
  location VARCHAR(150) NOT NULL,
  address TEXT NULL,
  image_url VARCHAR(500) NULL,
  banner_url VARCHAR(500) NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_featured TINYINT(1) DEFAULT 0,
  status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
  views_count INT DEFAULT 0,
  clicks_count INT DEFAULT 0,
  enquiries_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES advertisement_categories(id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 5. BUSINESS DIRECTORY
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS business_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  icon VARCHAR(50) DEFAULT 'Store',
  image_url VARCHAR(500) NULL,
  display_order INT DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS businesses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20) NULL,
  email VARCHAR(191) NULL,
  website VARCHAR(300) NULL,
  address TEXT NOT NULL,
  locality VARCHAR(100) NOT NULL,
  town VARCHAR(100) NOT NULL DEFAULT 'Adilabad',
  pincode VARCHAR(10) DEFAULT '504001',
  logo_url VARCHAR(500) NULL,
  cover_url VARCHAR(500) NULL,
  opening_time TIME NULL,
  closing_time TIME NULL,
  is_verified TINYINT(1) DEFAULT 0,
  is_featured TINYINT(1) DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  reviews_count INT DEFAULT 0,
  status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES business_categories(id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 6. RENT YOUR ITEMS MODULE (CORE SYSTEM)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS rental_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  icon VARCHAR(50) DEFAULT 'Layers',
  display_order INT DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rental_subcategories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  FOREIGN KEY (category_id) REFERENCES rental_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rental_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  category_id INT NOT NULL,
  subcategory_id INT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(270) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  item_condition ENUM('brand_new', 'like_new', 'good', 'fair') DEFAULT 'good',
  hourly_rate DECIMAL(10, 2) NULL,
  daily_rate DECIMAL(10, 2) NOT NULL,
  weekly_rate DECIMAL(10, 2) NULL,
  monthly_rate DECIMAL(10, 2) NULL,
  security_deposit DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  min_rental_days INT DEFAULT 1,
  max_rental_days INT DEFAULT 30,
  location VARCHAR(150) NOT NULL DEFAULT 'Adilabad',
  pickup_address TEXT NOT NULL,
  is_delivery_available TINYINT(1) DEFAULT 0,
  delivery_charge DECIMAL(10, 2) DEFAULT 0.00,
  cancellation_policy TEXT NULL,
  damage_policy TEXT NULL,
  terms_conditions TEXT NULL,
  status ENUM('draft', 'pending', 'approved', 'rejected', 'rented', 'inactive') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES rental_categories(id),
  FOREIGN KEY (subcategory_id) REFERENCES rental_subcategories(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rental_item_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rental_item_id INT NOT NULL,
  media_url VARCHAR(500) NOT NULL,
  media_type ENUM('image', 'video') DEFAULT 'image',
  is_primary TINYINT(1) DEFAULT 0,
  display_order INT DEFAULT 0,
  FOREIGN KEY (rental_item_id) REFERENCES rental_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rental_blocked_dates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rental_item_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(255) DEFAULT 'Reserved/Maintenance',
  FOREIGN KEY (rental_item_id) REFERENCES rental_items(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rental_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_code VARCHAR(30) NOT NULL UNIQUE,
  rental_item_id INT NOT NULL,
  customer_id INT NOT NULL,
  owner_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INT NOT NULL,
  daily_rate_snapshot DECIMAL(10, 2) NOT NULL,
  rental_fee DECIMAL(10, 2) NOT NULL,
  security_deposit_snapshot DECIMAL(10, 2) NOT NULL,
  delivery_charge DECIMAL(10, 2) DEFAULT 0.00,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('cash_on_pickup', 'upi_direct', 'bank_transfer', 'offline_custom') DEFAULT 'cash_on_pickup',
  payment_status ENUM('pending', 'partial', 'paid_to_owner', 'refunded') DEFAULT 'pending',
  status ENUM(
    'PENDING',
    'ACCEPTED',
    'REJECTED',
    'AWAITING_CUSTOMER_CONFIRMATION',
    'CONFIRMED',
    'ACTIVE',
    'EXTENSION_REQUESTED',
    'RETURN_PENDING',
    'COMPLETED',
    'CANCELLED',
    'DISPUTED'
  ) DEFAULT 'PENDING',
  customer_notes TEXT NULL,
  owner_notes TEXT NULL,
  handover_qr_code VARCHAR(100) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rental_item_id) REFERENCES rental_items(id),
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (owner_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rental_booking_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  previous_status VARCHAR(50) NULL,
  new_status VARCHAR(50) NOT NULL,
  changed_by_user_id INT NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES rental_bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rental_disputes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  raised_by_user_id INT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('open', 'under_review', 'resolved', 'closed') DEFAULT 'open',
  resolution_notes TEXT NULL,
  resolved_by_staff_id INT NULL,
  resolved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES rental_bookings(id),
  FOREIGN KEY (raised_by_user_id) REFERENCES users(id),
  FOREIGN KEY (resolved_by_staff_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rental_damage_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  reported_by_user_id INT NOT NULL,
  damage_description TEXT NOT NULL,
  deduction_claimed DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  settled_amount DECIMAL(10, 2) NULL,
  status ENUM('pending', 'approved_by_admin', 'settled', 'disputed') DEFAULT 'pending',
  evidence_media_urls JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES rental_bookings(id),
  FOREIGN KEY (reported_by_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 7. BUY & SELL CLASSIFIEDS MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS product_listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seller_id INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(270) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  condition_type ENUM('brand_new', 'used_like_new', 'used_good', 'used_fair') DEFAULT 'used_good',
  price DECIMAL(10, 2) NOT NULL,
  is_negotiable TINYINT(1) DEFAULT 1,
  location VARCHAR(150) NOT NULL DEFAULT 'Adilabad',
  contact_phone VARCHAR(20) NOT NULL,
  status ENUM('pending', 'approved', 'sold', 'rejected', 'expired') DEFAULT 'pending',
  views_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  media_url VARCHAR(500) NOT NULL,
  is_primary TINYINT(1) DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES product_listings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  buyer_id INT NOT NULL,
  offer_amount DECIMAL(10, 2) NOT NULL,
  buyer_message TEXT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'countered') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES product_listings(id) ON DELETE CASCADE,
  FOREIGN KEY (buyer_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 8. LOCAL SERVICES MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS service_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  icon VARCHAR(50) DEFAULT 'Wrench'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS service_providers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  service_title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  service_areas TEXT NOT NULL,
  starting_price DECIMAL(10, 2) NULL,
  experience_years INT DEFAULT 1,
  contact_phone VARCHAR(20) NOT NULL,
  contact_whatsapp VARCHAR(20) NULL,
  is_verified TINYINT(1) DEFAULT 0,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  rating DECIMAL(3, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES service_categories(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS service_enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  provider_id INT NOT NULL,
  customer_id INT NOT NULL,
  service_needed VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  preferred_date DATE NULL,
  status ENUM('pending', 'contacted', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES service_providers(id),
  FOREIGN KEY (customer_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 9. JOBS MODULE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS job_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS job_listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employer_id INT NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(270) NOT NULL UNIQUE,
  company_name VARCHAR(200) NOT NULL,
  job_type ENUM('full_time', 'part_time', 'internship', 'walk_in', 'contract') DEFAULT 'full_time',
  min_salary DECIMAL(10, 2) NULL,
  max_salary DECIMAL(10, 2) NULL,
  qualification VARCHAR(150) NOT NULL,
  experience_required VARCHAR(100) NULL,
  location VARCHAR(150) NOT NULL DEFAULT 'Adilabad',
  description TEXT NOT NULL,
  deadline DATE NOT NULL,
  contact_email VARCHAR(191) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  status ENUM('draft', 'pending', 'approved', 'expired', 'closed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employer_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES job_categories(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  applicant_id INT NOT NULL,
  applicant_name VARCHAR(150) NOT NULL,
  applicant_phone VARCHAR(20) NOT NULL,
  applicant_email VARCHAR(191) NOT NULL,
  resume_url VARCHAR(500) NULL,
  cover_letter TEXT NULL,
  status ENUM('submitted', 'reviewed', 'shortlisted', 'rejected') DEFAULT 'submitted',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES job_listings(id) ON DELETE CASCADE,
  FOREIGN KEY (applicant_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 10. EVENTS, OFFERS & PROMOTIONS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organizer_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(270) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'Cultural',
  venue VARCHAR(255) NOT NULL,
  location VARCHAR(150) NOT NULL DEFAULT 'Adilabad',
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  entry_fee DECIMAL(10, 2) DEFAULT 0.00,
  banner_url VARCHAR(500) NULL,
  contact_phone VARCHAR(20) NOT NULL,
  status ENUM('pending', 'approved', 'expired', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(270) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  coupon_code VARCHAR(50) NULL,
  discount_type ENUM('percentage', 'flat_amount', 'bogo', 'special_deal') DEFAULT 'percentage',
  discount_value DECIMAL(10, 2) NOT NULL,
  valid_until DATE NOT NULL,
  banner_url VARCHAR(500) NULL,
  terms_conditions TEXT NULL,
  status ENUM('active', 'expired', 'paused') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 11. ADILABAD LIVE, FOOD, DESTINATIONS, PROPERTIES, EDUCATION, AGRI, WEDDINGS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS community_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(270) NOT NULL UNIQUE,
  category ENUM('announcement', 'weather', 'traffic', 'cultural', 'news', 'public_notice') DEFAULT 'news',
  content TEXT NOT NULL,
  media_url VARCHAR(500) NULL,
  is_official TINYINT(1) DEFAULT 0,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  property_type ENUM('apartment', 'independent_house', 'room', 'hostel', 'commercial_shop', 'office_space', 'land') NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(270) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  monthly_rent DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2) NOT NULL,
  bedrooms INT DEFAULT 1,
  bathrooms INT DEFAULT 1,
  carpet_area_sqft INT NULL,
  furnishing ENUM('unfurnished', 'semi_furnished', 'fully_furnished') DEFAULT 'semi_furnished',
  location VARCHAR(150) NOT NULL DEFAULT 'Adilabad',
  contact_phone VARCHAR(20) NOT NULL,
  status ENUM('pending', 'approved', 'rented', 'inactive') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  cuisine_type VARCHAR(150) NOT NULL,
  address TEXT NOT NULL,
  location VARCHAR(150) NOT NULL DEFAULT 'Adilabad',
  phone VARCHAR(20) NOT NULL,
  opening_time TIME NULL,
  closing_time TIME NULL,
  is_pure_veg TINYINT(1) DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  image_url VARCHAR(500) NULL,
  status ENUM('pending', 'approved', 'inactive') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS destinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  category ENUM('waterfall', 'heritage_fort', 'temple', 'park', 'nature_reserve') NOT NULL,
  description TEXT NOT NULL,
  best_time_to_visit VARCHAR(100) NULL,
  distance_from_center_km DECIMAL(6, 2) NULL,
  entry_details VARCHAR(255) NULL,
  image_url VARCHAR(500) NULL,
  is_featured TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS institutions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  category ENUM('school', 'junior_college', 'degree_college', 'coaching_center', 'vocational') NOT NULL,
  courses_offered TEXT NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(191) NULL,
  image_url VARCHAR(500) NULL,
  is_verified TINYINT(1) DEFAULT 0,
  status ENUM('pending', 'approved', 'inactive') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS agricultural_listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  listing_type ENUM('tractor_rental', 'harvester_rental', 'seeds_fertilizer', 'irrigation_tool') NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(270) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  rate_or_price DECIMAL(10, 2) NOT NULL,
  rate_unit VARCHAR(50) DEFAULT 'per hour',
  location VARCHAR(150) NOT NULL DEFAULT 'Adilabad',
  contact_phone VARCHAR(20) NOT NULL,
  status ENUM('pending', 'approved', 'inactive') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS wedding_vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  service_type ENUM('marriage_hall', 'photographer', 'caterer', 'decorator', 'sound_dj', 'makeup_artist') NOT NULL,
  vendor_name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price_range VARCHAR(100) NULL,
  location VARCHAR(150) NOT NULL DEFAULT 'Adilabad',
  contact_phone VARCHAR(20) NOT NULL,
  status ENUM('pending', 'approved', 'inactive') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 12. SHARED ENGAGEMENT, MODERATION, AUDIT & NOTIFICATIONS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS favourites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  item_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favourite (user_id, item_type, item_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  item_id INT NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT NULL,
  status ENUM('approved', 'flagged', 'hidden') DEFAULT 'approved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('booking', 'enquiry', 'approval', 'rejection', 'system', 'offer') DEFAULT 'system',
  link VARCHAR(300) NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS moderation_actions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  moderator_id INT NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  action ENUM('approve', 'reject', 'request_changes', 'suspend') NOT NULL,
  reason TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (moderator_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(100) NOT NULL,
  ip_address VARCHAR(50) NULL,
  user_agent VARCHAR(255) NULL,
  details JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  link_url VARCHAR(500) NULL,
  placement VARCHAR(50) DEFAULT 'home_hero',
  is_active TINYINT(1) DEFAULT 1,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
