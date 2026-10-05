const slugify = require('slugify');
const { query } = require('../config/db');
const { logAdminAction } = require('../middleware/auditMiddleware');

// PUBLIC: Get categories with counts of published advertisements
exports.getCategories = async (req, res) => {
  try {
    const categories = await query(
      `SELECT
        c.id, c.name, c.slug, c.icon, c.description, c.display_order,
        (
          SELECT COUNT(*) FROM advertisements a
          WHERE a.category_id = c.id AND a.status = 'published'
        ) as advertisements_count,
        (
          SELECT COUNT(*) FROM businesses b
          WHERE b.category_id = c.id AND b.is_active = 1
        ) as businesses_count
       FROM categories c
       WHERE c.is_active = 1
       ORDER BY c.display_order ASC, c.name ASC`
    );

    return res.json({ success: true, data: categories });
  } catch (error) {
    console.error('getCategories error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

// PUBLIC: Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const categories = await query(
      `SELECT
        c.id, c.name, c.slug, c.icon, c.description, c.display_order,
        (
          SELECT COUNT(*) FROM advertisements a
          WHERE a.category_id = c.id AND a.status = 'published'
        ) as advertisements_count
       FROM categories c
       WHERE c.slug = ? AND c.is_active = 1
       LIMIT 1`,
      [slug]
    );

    if (!categories || categories.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    return res.json({ success: true, data: categories[0] });
  } catch (error) {
    console.error('getCategoryBySlug error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch category details.' });
  }
};

// ADMIN: Get all categories (active & inactive)
exports.getAdminCategories = async (req, res) => {
  try {
    const categories = await query(
      `SELECT
        c.*,
        (SELECT COUNT(*) FROM advertisements WHERE category_id = c.id) as total_ads,
        (SELECT COUNT(*) FROM businesses WHERE category_id = c.id) as total_businesses
       FROM categories c
       ORDER BY c.display_order ASC, c.id ASC`
    );
    return res.json({ success: true, data: categories });
  } catch (error) {
    console.error('getAdminCategories error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

// ADMIN ONLY: Create category
exports.createCategory = async (req, res) => {
  try {
    const { name, icon = 'Tag', description, display_order = 0 } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    let slug = slugify(name, { lower: true, strict: true });
    const result = await query(
      `INSERT INTO categories (name, slug, icon, description, display_order, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [name.trim(), slug, icon, description || null, parseInt(display_order, 10) || 0]
    );

    await logAdminAction(req.user.id, 'Category created', 'category', result.insertId, { name, slug }, req);
    return res.status(201).json({ success: true, message: 'Category created successfully.', data: { id: result.insertId, slug } });
  } catch (error) {
    console.error('createCategory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
};

// ADMIN ONLY: Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, description, display_order, is_active } = req.body;

    await query(
      `UPDATE categories SET
        name = COALESCE(?, name),
        icon = COALESCE(?, icon),
        description = COALESCE(?, description),
        display_order = COALESCE(?, display_order),
        is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [
        name ? name.trim() : null,
        icon || null,
        description !== undefined ? description : null,
        display_order !== undefined ? parseInt(display_order, 10) : null,
        is_active !== undefined ? (is_active ? 1 : 0) : null,
        id
      ]
    );

    await logAdminAction(req.user.id, 'Category edited', 'category', id, { name }, req);
    return res.json({ success: true, message: 'Category updated successfully.' });
  } catch (error) {
    console.error('updateCategory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update category.' });
  }
};

// ADMIN ONLY: Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ads exist
    const [adCount] = await query('SELECT COUNT(*) as count FROM advertisements WHERE category_id = ?', [id]);
    if (adCount && adCount.count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${adCount.count} advertisements are assigned to it. Please reassign them first.`
      });
    }

    await query('DELETE FROM categories WHERE id = ?', [id]);
    await logAdminAction(req.user.id, 'Category deleted', 'category', id, {}, req);
    return res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('deleteCategory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
};
