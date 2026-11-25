const { query } = require('../config/db');

async function fixStatus() {
  const tables = ['job_listings', 'agricultural_listings', 'restaurants', 'properties', 'wedding_vendors', 'institutions'];
  for (const t of tables) {
    await query(`UPDATE ${t} SET status = 'approved'`);
    console.log(t, 'updated to approved');
  }
}

fixStatus().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
