const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function addIndexes() {
  console.log('⚡ Adding performance indexes to MySQL...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'adilabad_app',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    multipleStatements: true
  });

  try {
    const addIndexSafely = async (table, indexName, columns) => {
      try {
        const [existing] = await connection.query(`SHOW INDEX FROM \`${table}\` WHERE Key_name = ?`, [indexName]);
        if (existing.length === 0) {
          await connection.query(`CREATE INDEX \`${indexName}\` ON \`${table}\` (${columns})`);
          console.log(`  + Created index ${indexName} on ${table}`);
        } else {
          console.log(`  . Index ${indexName} already exists on ${table}`);
        }
      } catch (err) {
        console.warn(`  ! Could not create index ${indexName} on ${table}: ${err.message}`);
      }
    };

    // 1. Advertisements
    await addIndexSafely('advertisements', 'idx_ads_status_created', '`status`, `created_at` DESC');
    await addIndexSafely('advertisements', 'idx_ads_category_status', '`category_id`, `status`');
    await addIndexSafely('advertisements', 'idx_ads_location_status', '`location_id`, `status`');
    await addIndexSafely('advertisements', 'idx_ads_featured', '`is_featured`, `created_at` DESC');

    // 2. Businesses
    await addIndexSafely('businesses', 'idx_biz_category_active', '`category_id`, `is_active`');
    await addIndexSafely('businesses', 'idx_biz_location_active', '`location_id`, `is_active`');
    await addIndexSafely('businesses', 'idx_biz_featured_rating', '`is_featured`, `rating` DESC');

    // 3. Rental Items
    await addIndexSafely('rental_items', 'idx_rentals_status_category', '`status`, `category_id`');
    await addIndexSafely('rental_items', 'idx_rentals_owner', '`owner_id`');

    // 4. Submissions
    await addIndexSafely('submissions', 'idx_sub_module_status', '`module`, `status`');
    await addIndexSafely('submissions', 'idx_sub_owner', '`owner_id`');

    // 5. Events
    await addIndexSafely('events', 'idx_events_start_date', '`start_date`');

    console.log('✅ All performance indexes created successfully!');
  } catch (err) {
    console.error('❌ Indexing error:', err);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

addIndexes();
