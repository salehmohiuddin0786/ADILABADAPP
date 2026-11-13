/**
 * ADILABAD APP — DATABASE CONNECTION & TRANSACTION HELPER
 */

const { pool, query } = require('../../config/db');

/**
 * Execute operations within an atomic MySQL transaction
 */
async function withTransaction(callback) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  query,
  withTransaction
};
