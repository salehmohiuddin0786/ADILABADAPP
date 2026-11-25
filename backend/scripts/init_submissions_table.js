const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function createSubmissionsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'adilabad_app',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    multipleStatements: true
  });

  try {
    console.log('📦 Creating unified submissions tables...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        module VARCHAR(50) NOT NULL COMMENT 'rentals, advertisements, businesses, events, services, jobs, buy-sell',
        owner_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NULL,
        pricing VARCHAR(100) NULL,
        location VARCHAR(150) NULL,
        image_url VARCHAR(500) NULL,
        description TEXT,
        specs JSON NULL,
        status ENUM('DRAFT','PENDING_APPROVAL','CHANGES_REQUESTED','APPROVED','PUBLISHED','REJECTED','SUSPENDED') NOT NULL DEFAULT 'PENDING_APPROVAL',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE IF NOT EXISTS submission_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_id INT NOT NULL,
        reviewer_id INT NULL,
        comment TEXT,
        decision ENUM('APPROVE','REJECT','REQUEST_CHANGES','HOLD') NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Check count and seed initial submissions from INITIAL_SUBMISSIONS if empty
    const [existing] = await connection.query('SELECT COUNT(*) as count FROM submissions');
    if (existing[0].count === 0) {
      console.log('🌱 Seeding initial submissions into MySQL database...');
      await connection.query(`
        INSERT INTO submissions (id, module, owner_id, title, category, pricing, location, image_url, description, specs, status, created_at) VALUES
        (1001, 'rentals', 3, 'Sony Alpha A7 IV Mirrorless Camera + 24-70mm GM Lens', 'Electronics & Cameras', '₹1,500 / day', 'Cinema Road, Adilabad', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', 'Professional high-speed full-frame 4K cinema kit for weddings, events, documentary, and portfolio shoots.', '{"daily_rate": 1500, "security_deposit": 5000, "condition": "like_new", "pickup_address": "Cinema Road, Opp. Geeta Theatre, Adilabad"}', 'PUBLISHED', NOW()),
        (1002, 'rentals', 3, 'John Deere 5050D 50HP Tractor with Heavy Cultivator', 'Agricultural Equipment & Tractors', '₹3,200 / day', 'Utnoor Road, Adilabad', 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800', '50HP heavy farm tractor equipped with hydraulic cultivator and trolley hook for cotton and soya farming.', '{"daily_rate": 3200, "security_deposit": 8000, "condition": "good", "pickup_address": "Utnoor Highway Crossing, Adilabad Rural"}', 'PUBLISHED', NOW()),
        (1003, 'rentals', 3, 'JBL VRX Line Array Concert Sound System (4 Tops + 2 Dual Subs)', 'Event Sound & Stage Gear', '₹7,500 / day', 'Bus Stand Road, Adilabad', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', 'High-power professional stage sound rig with Crown digital amplifiers and digital mixer.', '{"daily_rate": 7500, "security_deposit": 12000, "condition": "excellent"}', 'PENDING_APPROVAL', NOW()),
        (1004, 'advertisements', 3, 'Grand Diwali & Wedding Gold Jewellery Festival — 50% Off VA Charges', 'Jewellery & Retail', 'Special Seasonal Promotion', 'Main Road, Adilabad', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800', 'Certified 916 BIS Hallmarked bridal jewellery collection with zero percent deduction on gold exchange.', '{"duration_days": 30}', 'PENDING_APPROVAL', NOW()),
        (1005, 'businesses', 3, 'Shree Balaji Electronics, Air Conditioners & Home Appliances', 'Electronics & Home Appliances', 'Storefront Profile', 'Cinema Road, Opp. Geeta Theatre, Adilabad', 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800', 'Authorized retailer for Sony, Samsung, Daikin, and Voltas with Bajaj Finserv 0% EMI financing.', '{"trade_license": "ADB-MUNC-TL-4912", "gst_registered": true}', 'PENDING_APPROVAL', NOW()),
        (1006, 'events', 3, 'Adilabad District Agri Expo & Kisan Mela 2026', 'Expos & Trade Fairs', 'Free Public Entry', 'Indira Priyadarshini Stadium Ground, Adilabad', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'Three-day agriculture machinery exhibition, seed suppliers conference, and organic farming workshops.', '{"start_date": "2026-11-28", "end_date": "2026-11-30"}', 'PENDING_APPROVAL', NOW()),
        (1007, 'services', 3, 'Adilabad Professional CCTV & Biometric Security Systems Installation', 'Home & Commercial Services', '₹499 Inspection Fee', 'Gandhi Chowk, Adilabad', 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800', 'Expert HD and IP CCTV setup, DVR/NVR configuration, and mobile app remote view.', '{"experience": "8+ Years"}', 'PUBLISHED', NOW()),
        (1008, 'buy-sell', 3, 'Pre-Owned Massey Ferguson 241 DI Tractor (2022 Model, Single Owner)', 'Agricultural Machinery', '₹4,85,000 (Negotiable)', 'Utnoor Road, Adilabad', 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800', 'Only 840 hours run, clean engine, brand new rear MRF tyres, comprehensive insurance valid until Oct 2027.', '{"model_year": 2022, "condition": "excellent"}', 'PUBLISHED', NOW())
        ON DUPLICATE KEY UPDATE title=VALUES(title);
      `);
      console.log('✅ Initial submissions seeded into MySQL!');
    }

    console.log('✅ Submissions tables initialized successfully!');
  } catch (err) {
    console.error('❌ Failed to create submissions tables:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createSubmissionsTable();
