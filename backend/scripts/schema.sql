-- Adilabad App Database Schema
-- Production Normalized Schema for Adilabad, Telangana Advertising & Local Discovery

CREATE DATABASE IF NOT EXISTS adilabad_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE adilabad_app;

-- 1. Roles
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL DEFAULT 2,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20) NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500) NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3. Categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  icon VARCHAR(100) NOT NULL DEFAULT 'Tag',
  description TEXT NULL,
  display_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category_slug (slug),
  INDEX idx_category_order (display_order)
) ENGINE=InnoDB;

-- 4. Locations in Adilabad
CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  pincode VARCHAR(10) DEFAULT '504001',
  type VARCHAR(50) DEFAULT 'locality',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. Advertisements (Admin Only Creation & Publishing)
CREATE TABLE IF NOT EXISTS advertisements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL UNIQUE,
  business_name VARCHAR(150) NOT NULL,
  category_id INT NOT NULL,
  location_id INT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12, 2) NULL,
  price_type ENUM('fixed', 'negotiable', 'starting_at', 'contact_for_price', 'free') DEFAULT 'fixed',
  price_display VARCHAR(100) NULL,
  phone VARCHAR(25) NOT NULL,
  whatsapp VARCHAR(25) NULL,
  website VARCHAR(300) NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  video_url VARCHAR(500) NULL,
  is_featured TINYINT(1) DEFAULT 0,
  status ENUM('draft', 'scheduled', 'published', 'expired', 'archived') DEFAULT 'published',
  start_date DATE NULL,
  expiry_date DATE NULL,
  views_count INT DEFAULT 0,
  clicks_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_ad_status (status),
  INDEX idx_ad_featured (is_featured),
  INDEX idx_ad_category (category_id),
  INDEX idx_ad_slug (slug),
  INDEX idx_ad_created (created_at)
) ENGINE=InnoDB;

-- 6. Advertisement Images
CREATE TABLE IF NOT EXISTS advertisement_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  advertisement_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_primary TINYINT(1) DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (advertisement_id) REFERENCES advertisements(id) ON DELETE CASCADE,
  INDEX idx_ad_images (advertisement_id)
) ENGINE=InnoDB;

-- 7. Advertisement Views Analytics
CREATE TABLE IF NOT EXISTS advertisement_views (
  id INT AUTO_INCREMENT PRIMARY KEY,
  advertisement_id INT NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(300) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (advertisement_id) REFERENCES advertisements(id) ON DELETE CASCADE,
  INDEX idx_view_ad (advertisement_id),
  INDEX idx_view_created (created_at)
) ENGINE=InnoDB;

-- 8. Advertisement Clicks Analytics
CREATE TABLE IF NOT EXISTS advertisement_clicks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  advertisement_id INT NOT NULL,
  click_type ENUM('call', 'whatsapp', 'website', 'directions', 'share') NOT NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (advertisement_id) REFERENCES advertisements(id) ON DELETE CASCADE,
  INDEX idx_click_type (click_type),
  INDEX idx_click_ad (advertisement_id)
) ENGINE=InnoDB;

-- 9. Advertisement Reports
CREATE TABLE IF NOT EXISTS advertisement_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  advertisement_id INT NOT NULL,
  user_id INT NULL,
  reporter_name VARCHAR(100) NULL,
  reporter_contact VARCHAR(100) NULL,
  reason ENUM('spam', 'fake_information', 'wrong_contact', 'fraud_scam', 'inappropriate_content', 'other') NOT NULL,
  description TEXT NULL,
  status ENUM('pending', 'under_review', 'resolved', 'dismissed') DEFAULT 'pending',
  admin_notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (advertisement_id) REFERENCES advertisements(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_report_status (status)
) ENGINE=InnoDB;

-- 10. Businesses Directory
CREATE TABLE IF NOT EXISTS businesses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(250) NOT NULL UNIQUE,
  category_id INT NOT NULL,
  location_id INT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(25) NOT NULL,
  whatsapp VARCHAR(25) NULL,
  email VARCHAR(150) NULL,
  website VARCHAR(300) NULL,
  description TEXT NOT NULL,
  logo_url VARCHAR(500) NULL,
  cover_url VARCHAR(500) NULL,
  rating DECIMAL(2, 1) DEFAULT 4.8,
  total_reviews INT DEFAULT 12,
  is_featured TINYINT(1) DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
  INDEX idx_business_slug (slug),
  INDEX idx_business_featured (is_featured),
  INDEX idx_business_active (is_active)
) ENGINE=InnoDB;

-- 11. Business Images
CREATE TABLE IF NOT EXISTS business_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. Business Services
CREATE TABLE IF NOT EXISTS business_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  service_name VARCHAR(200) NOT NULL,
  description VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. Business Hours
CREATE TABLE IF NOT EXISTS business_hours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_id INT NOT NULL,
  day_of_week TINYINT NOT NULL COMMENT '0=Sunday, 1=Monday, ..., 6=Saturday',
  open_time TIME NULL,
  close_time TIME NULL,
  is_closed TINYINT(1) DEFAULT 0,
  FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_biz_day (business_id, day_of_week)
) ENGINE=InnoDB;

-- 14. Events
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  cover_url VARCHAR(500) NULL,
  event_date DATE NOT NULL,
  event_time VARCHAR(50) NOT NULL,
  venue VARCHAR(200) NOT NULL,
  location_id INT NULL,
  address TEXT NOT NULL,
  organizer VARCHAR(150) NOT NULL,
  phone VARCHAR(25) NULL,
  whatsapp VARCHAR(25) NULL,
  website VARCHAR(300) NULL,
  registration_url VARCHAR(500) NULL,
  is_featured TINYINT(1) DEFAULT 0,
  status ENUM('published', 'draft', 'scheduled', 'expired') DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
  INDEX idx_event_slug (slug),
  INDEX idx_event_date (event_date)
) ENGINE=InnoDB;

-- 15. Banners
CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(300) NULL,
  cta_text VARCHAR(100) DEFAULT 'Explore Now',
  link_url VARCHAR(500) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  priority INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  start_date DATE NULL,
  expiry_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_banner_active (is_active),
  INDEX idx_banner_priority (priority)
) ENGINE=InnoDB;

-- 16. Favorites
CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_type ENUM('advertisement', 'business', 'event', 'place') NOT NULL,
  item_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_fav (user_id, item_type, item_id),
  INDEX idx_fav_user (user_id)
) ENGINE=InnoDB;

-- 17. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('new_ad', 'featured_ad', 'event', 'offer', 'announcement') DEFAULT 'announcement',
  target_type ENUM('all', 'selected') DEFAULT 'all',
  link_url VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 18. Notification Reads
CREATE TABLE IF NOT EXISTS notification_reads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  notification_id INT NOT NULL,
  user_id INT NOT NULL,
  read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_notif_read (notification_id, user_id)
) ENGINE=InnoDB;

-- 19. Admin Activity Logs
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(50) NOT NULL,
  entity_id INT NULL,
  details TEXT NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_admin_logs (admin_id),
  INDEX idx_log_created (created_at)
) ENGINE=InnoDB;

-- 20. Settings
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description VARCHAR(255) NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
