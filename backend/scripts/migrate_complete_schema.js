const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function migrateCompleteSchema() {
  console.log('🔄 Connecting to MySQL server to apply complete schema...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'adilabad_app',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    multipleStatements: true
  });

  try {
    const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema', 'complete_schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }

    const sql = fs.readFileSync(schemaPath, 'utf8');
    console.log('📦 Executing complete_schema.sql...');
    await connection.query(sql);

    console.log('✅ Complete schema successfully deployed to MySQL!');

    const [tables] = await connection.query('SHOW TABLES');
    console.log(`📊 Active table count in adilabad_app: ${tables.length}`);

    // Seed rental categories if empty
    const [rentalCats] = await connection.query('SELECT COUNT(*) as count FROM rental_categories');
    if (rentalCats[0].count === 0) {
      console.log('🌱 Seeding initial rental categories and sample items...');
      await connection.query(`
        INSERT INTO rental_categories (id, name, slug, icon, description, display_order) VALUES
        (1, 'Electronics & Cameras', 'electronics-cameras', 'Camera', 'DSLR, mirrorless, cinema cameras, drones, and studio lighting', 1),
        (2, 'Agricultural Equipment & Tractors', 'agri-machinery', 'Tractor', 'Tractors, multi-crop harvesters, rotavators, and sprayers', 2),
        (3, 'Event Sound & Stage Gear', 'event-sound-stage', 'Speaker', 'Line array speakers, DJ systems, concert lighting, and generators', 3),
        (4, 'Construction & Heavy Machinery', 'construction-machinery', 'Truck', 'JCB excavators, concrete mixers, plate compactors, and scaffolding', 4),
        (5, 'Wedding & Function Attire', 'wedding-attire', 'Sparkles', 'Designer sherwanis, bridal lehengas, turbans, and jewellery sets', 5),
        (6, 'Vehicles & Travel Transport', 'vehicles-travel', 'Car', 'Self-drive cars, tempo travellers, and tourist buses for Adilabad trips', 6)
        ON DUPLICATE KEY UPDATE name=VALUES(name);
      `);

      // Seed sample rental items
      await connection.query(`
        INSERT INTO rental_items (id, owner_id, category_id, title, slug, description, item_condition, daily_rate, hourly_rate, weekly_rate, monthly_rate, security_deposit, location, pickup_address, status) VALUES
        (101, 3, 1, 'Sony Alpha A7 IV Mirrorless Camera + 24-70mm Lens', 'sony-alpha-a7-iv-mirrorless-camera', 'Professional camera kit for weddings, documentary shoots, and events in Adilabad. Includes 2x high-capacity batteries, 128GB V90 SD card, dual charger, and weather-sealed carrying case.', 'like_new', 1500, 250, 8000, 28000, 5000, 'Cinema Road, Adilabad', 'Shop #4, Near Natraj Theater, Cinema Road, Adilabad, 504001', 'approved'),
        (102, 3, 2, 'John Deere 5050D Tractor with Cultivator', 'john-deere-5050d-tractor-rental', 'High performance 50HP tractor with heavy-duty disc cultivator ready for field plowing and agricultural transport across Adilabad district.', 'good', 3200, 450, 18000, 65000, 8000, 'Utnoor Road, Adilabad', 'Utnoor Highway Crossing, Adilabad Rural', 'approved'),
        (103, 3, 3, 'JBL VRX Line Array 10000W Sound Setup for Events', 'jbl-vrx-sound-setup-events', 'High power event sound setup with digital mixer, wireless handheld microphones, Crown amplification, and on-site audio technician included.', 'excellent', 8500, 1200, 45000, 160000, 15000, 'Bus Stand Road, Adilabad', 'Near Old Bus Depot, Adilabad Town', 'approved')
        ON DUPLICATE KEY UPDATE title=VALUES(title);
      `);

      // Seed sample media
      await connection.query(`
        INSERT INTO rental_item_media (rental_item_id, media_url, media_type, is_primary) VALUES
        (101, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800', 'image', 1),
        (102, 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800', 'image', 1),
        (103, 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800', 'image', 1)
        ON DUPLICATE KEY UPDATE media_url=VALUES(media_url);
      `);
      console.log('✅ Rental categories and sample items seeded!');
    }

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrateCompleteSchema();
