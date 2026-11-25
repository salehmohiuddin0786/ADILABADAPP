const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function seedVerticals() {
  console.log('🔄 Seeding vertical tables in MySQL...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'adilabad_app',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    multipleStatements: true
  });

  try {
    // 1. Ensure helper columns exist
    const addColSafely = async (table, colDef) => {
      try {
        await connection.query(`ALTER TABLE \`${table}\` ADD COLUMN ${colDef}`);
      } catch (e) {
        // column already exists, ignore
      }
    };

    await addColSafely('job_listings', '`company_name` VARCHAR(150) NULL AFTER `title`');
    await addColSafely('job_listings', '`deadline` VARCHAR(50) NULL');
    await addColSafely('agricultural_listings', '`image_url` VARCHAR(500) NULL');
    await addColSafely('agricultural_listings', '`vendor_name` VARCHAR(150) NULL');
    await addColSafely('properties', '`image_url` VARCHAR(500) NULL');
    await addColSafely('wedding_vendors', '`image_url` VARCHAR(500) NULL');

    // 2. Seed Job Categories & Jobs
    await connection.query(`
      INSERT INTO job_categories (id, name, slug) VALUES
      (1, 'Accounts & Finance', 'accounts-finance'),
      (2, 'Retail & Sales', 'retail-sales'),
      (3, 'Education & Teaching', 'education-teaching')
      ON DUPLICATE KEY UPDATE name=VALUES(name);
    `);

    await connection.query(`
      INSERT INTO job_listings (id, employer_id, category_id, title, company_name, slug, job_type, description, min_salary, max_salary, qualification, location, contact_phone, deadline, status) VALUES
      (1, 3, 1, 'Branch Accountant & Tally Prime Operator', 'Adilabad Cotton Ginning Mills', 'branch-accountant-tally-operator', 'Full Time', 'Looking for an experienced accountant for daily ledger, GST filing, and Tally Prime reconciliation at Mavala Industrial Area.', 22000, 28000, 'B.Com / M.Com + 2 Yrs Exp', 'Industrial Area, Mavala, Adilabad', '+91 94401 22334', '2026-12-15', 'active'),
      (2, 3, 2, 'Showroom Sales Executive (Electronics & Mobiles)', 'Sri Balaji Digital Showroom', 'showroom-sales-executive-mobiles', 'Full Time', 'Showroom counter sales representative for smartphones, smart TVs, and home appliances. Fluency in Telugu and Hindi required.', 15000, 20000, 'Intermediate / Any Graduate', 'Cinema Road, Adilabad', '+91 98480 11223', '2026-12-10', 'active'),
      (3, 3, 3, 'Senior High School Mathematics Teacher', 'Kakatiya High School', 'senior-high-school-mathematics-teacher', 'Full Time', 'Teaching 8th to 10th standard state board mathematics. B.Ed qualification mandatory.', 25000, 35000, 'B.Sc / M.Sc with B.Ed', 'Vidya Nagar, Adilabad', '+91 94401 92834', '2026-12-20', 'active')
      ON DUPLICATE KEY UPDATE title=VALUES(title);
    `);

    // 3. Seed Agriculture
    await connection.query(`
      INSERT INTO agricultural_listings (id, user_id, listing_type, title, vendor_name, slug, description, rate_or_price, rate_unit, location, contact_phone, image_url, status) VALUES
      (1, 3, 'Seeds & Fertilizers', 'Certified BT Cotton Seeds & Bio-Fertilizers', 'Kisan Seva Kendra & Agri Inputs', 'certified-bt-cotton-seeds-bio-fertilizers', 'Government certified drought-tolerant BT cotton seeds, organic neem cake, and bio-nutrients for Telangana black soils.', 850, 'per packet', 'Market Yard Road, Adilabad', '+91 94401 88990', 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800', 'active'),
      (2, 3, 'Solar & Irrigation', 'Solar Agricultural Water Pump Set (5HP & 7.5HP)', 'Telangana Solar Energy Hub', 'solar-agricultural-water-pump-set', 'MNRE approved solar submersible pump with 5-year warranty and free installation across Adilabad district.', 145000, 'per set', 'Utnoor Road, Adilabad', '+91 98480 11223', 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800', 'active'),
      (3, 3, 'Farm Machinery', 'Multi-Crop Harvester & Thresher on Daily Rent', 'Adilabad Agro Machine Cooperative', 'multi-crop-harvester-thresher-rent', 'High-speed soybean, wheat, and chana crop harvester with operator and diesel inclusive package.', 2200, 'per hour', 'Bela Road, Adilabad', '+91 94401 77665', 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800', 'active')
      ON DUPLICATE KEY UPDATE title=VALUES(title);
    `);

    // 4. Seed Restaurants
    await connection.query(`
      INSERT INTO restaurants (id, user_id, name, slug, cuisine_type, address, location, phone, opening_time, closing_time, is_pure_veg, rating, image_url, status) VALUES
      (1, 3, 'Green Park Family Restaurant & Biryani House', 'green-park-family-restaurant', 'Hyderabadi Biryani, North Indian & Tandoor', 'Opp. Geeta Theatre, Cinema Road', 'Cinema Road, Adilabad', '+91 98480 22334', '11:00:00', '23:30:00', 0, 4.8, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', 'active'),
      (2, 3, 'Udupi Sri Krishna Bhavan (Pure Veg)', 'udupi-sri-krishna-bhavan-pure-veg', 'South Indian Breakfast, Thali & Filter Coffee', 'Near Netaji Chowk, Subhash Nagar', 'Subhash Nagar, Adilabad', '+91 94401 92834', '06:30:00', '22:00:00', 1, 4.9, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600', 'active'),
      (3, 3, 'Al-Madina Arabian Mandi & BBQ', 'al-madina-arabian-mandi-bbq', 'Yemeni Mutton Mandi, Chicken Tikka & Shawarma', 'Old Town Highway Road', 'Old Town, Adilabad', '+91 98765 43210', '12:30:00', '23:00:00', 0, 4.7, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', 'active')
      ON DUPLICATE KEY UPDATE name=VALUES(name);
    `);

    // 5. Seed Properties
    await connection.query(`
      INSERT INTO properties (id, owner_id, property_type, title, slug, description, monthly_rent, deposit_amount, bedrooms, bathrooms, carpet_area_sqft, furnishing, location, contact_phone, image_url, status) VALUES
      (1, 3, 'Residential Flat', 'Spacious 2BHK Independent Floor in Collectorate Colony', '2bhk-flat-collectorate-colony', 'North-facing 2BHK with modular kitchen, 24/7 municipal water connection, inverter wiring, and covered car parking.', 12500, 25000, 2, 2, 1150, 'Semi-Furnished', 'Collectorate Colony, Adilabad', '+91 94401 23456', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600', 'active'),
      (2, 3, 'Commercial Shop', 'Prime Road-Facing Commercial Shop on Main Road', 'prime-commercial-shop-main-road', 'Ground floor shop ideal for pharmacy, jewellery, opticals, or mobile retail showroom with glass elevation.', 22000, 50000, 0, 1, 450, 'Unfurnished', 'Main Road, Gandhi Chowk, Adilabad', '+91 98480 33445', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600', 'active'),
      (3, 3, 'Agricultural Land', '5.5 Acres Fertile Black Soil Farm Land near Utnoor', '5-acres-fertile-black-soil-utnoor', 'Ideal for cotton, soybean, and pomegranate farming with open well water, 3-phase electricity, and tar road access.', 45000, 0, 0, 0, 239580, 'Unfurnished', 'Utnoor Highway, Adilabad Rural', '+91 98499 11223', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600', 'active')
      ON DUPLICATE KEY UPDATE title=VALUES(title);
    `);

    // 6. Seed Wedding Vendors
    await connection.query(`
      INSERT INTO wedding_vendors (id, user_id, service_type, vendor_name, slug, description, price_range, location, contact_phone, image_url, status) VALUES
      (1, 3, 'Convention Hall', 'Royal Palace A/C Function Hall & Lawns', 'royal-palace-ac-function-hall', 'Grand 1500-capacity fully air-conditioned convention center with dedicated dining area, bridal suite, and generator backup.', '₹75,000 - ₹1,50,000 / day', 'Utnoor Road, Adilabad', '+91 94401 88990', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600', 'active'),
      (2, 3, 'Stage Decoration', 'Sri Krishna Flower & Theme Stage Decorators', 'sri-krishna-flower-stage-decorators', 'Customized fiber mandate stages, real fresh flower decoration, LED entry gates, and thematic lighting for receptions.', '₹25,000 - ₹80,000 / event', 'Subhash Nagar, Adilabad', '+91 98480 22334', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', 'active'),
      (3, 3, 'Catering Service', 'Adilabad Shahi Dawat & Traditional Caterers', 'adilabad-shahi-dawat-caterers', 'Authentic Hyderabadi Dum Biryani, vegetarian feasts, sweets, and dessert counters with hygienic banquet service.', '₹350 - ₹650 / plate', 'Cinema Road, Adilabad', '+91 98765 43210', 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600', 'active')
      ON DUPLICATE KEY UPDATE vendor_name=VALUES(vendor_name);
    `);

    // 7. Seed Institutions (Education)
    await connection.query(`
      INSERT INTO institutions (id, name, slug, category, courses_offered, address, phone, email, image_url, is_verified, status) VALUES
      (1, 'Kakatiya Junior & Degree College', 'kakatiya-junior-degree-college', 'Degree College', 'B.Sc, B.Com (Comp), B.A, MPC, BiPC', 'Vidya Nagar, Adilabad, 504001', '+91 8732 224455', 'kakatiya.adb@gmail.com', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600', 1, 'active'),
      (2, 'Resonance IIT-JEE & NEET Study Circle', 'resonance-iit-jee-neet-study-circle', 'Coaching Institute', 'NEET Long Term, IIT-JEE Foundation, EAMCET', 'Opp. Collectorate Office, Adilabad', '+91 98480 77889', 'resonance.adilabad@gmail.com', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600', 1, 'active'),
      (3, 'Government Polytechnic College Adilabad', 'government-polytechnic-college-adilabad', 'Polytechnic & Diploma', 'Civil, Mechanical, EEE, ECE, Computer Engineering', 'Near Battisgarh, Adilabad, 504001', '+91 8732 233441', 'gpt.adilabad@gmail.com', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600', 1, 'active')
      ON DUPLICATE KEY UPDATE name=VALUES(name);
    `);

    console.log('✅ All vertical tables successfully populated in MySQL!');
  } catch (err) {
    console.error('❌ Failed to seed verticals:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedVerticals();
