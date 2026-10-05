const { query } = require('../config/db');

// ADMIN: Get Dashboard Overview KPIs
exports.getOverviewStats = async (req, res) => {
  try {
    const [usersCount] = await query('SELECT COUNT(*) as total, SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active FROM users');
    const [adsCount] = await query(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_featured = 1 AND status = 'published' THEN 1 ELSE 0 END) as featured,
        SUM(COALESCE(views_count, 0)) as total_views,
        SUM(COALESCE(clicks_count, 0)) as total_clicks,
        SUM(COALESCE(shares_count, 0)) as total_shares
       FROM advertisements`
    );
    const [bizCount] = await query('SELECT COUNT(*) as total, SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active FROM businesses');
    const [eventsCount] = await query('SELECT COUNT(*) as total, SUM(CASE WHEN status = "published" THEN 1 ELSE 0 END) as active FROM events');
    const [reportsCount] = await query('SELECT COUNT(*) as total, SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending FROM advertisement_reports');

    // Click breakdown by type (Call, WhatsApp, Website, Directions, Share)
    const clicksBreakdown = await query(
      `SELECT click_type, COUNT(*) as count
       FROM advertisement_clicks
       GROUP BY click_type`
    );

    // Top categories by published ads
    const topCategories = await query(
      `SELECT c.id, c.name, c.slug, c.icon, COUNT(a.id) as total_ads
       FROM categories c
       LEFT JOIN advertisements a ON c.id = a.category_id AND a.status = 'published'
       GROUP BY c.id
       ORDER BY total_ads DESC
       LIMIT 6`
    );

    // Top performing advertisements
    const topAds = await query(
      `SELECT a.id, a.title, a.slug, a.business_name, a.views_count, a.clicks_count, a.shares_count,
        (SELECT image_url FROM advertisement_images WHERE advertisement_id = a.id ORDER BY is_primary DESC LIMIT 1) as primary_image
       FROM advertisements a
       WHERE a.status = 'published'
       ORDER BY (a.views_count + a.clicks_count * 2) DESC
       LIMIT 5`
    );

    // Recent admin activity logs
    const recentLogs = await query(
      `SELECT l.id, l.action, l.entity, l.entity_id, l.details, l.created_at, u.name as admin_name
       FROM admin_activity_logs l
       LEFT JOIN users u ON l.admin_id = u.id
       ORDER BY l.created_at DESC
       LIMIT 8`
    );

    return res.json({
      success: true,
      data: {
        users: {
          total: usersCount?.total || 0,
          active: usersCount?.active || 0
        },
        advertisements: {
          total: adsCount?.total || 0,
          active: adsCount?.active || 0,
          featured: adsCount?.featured || 0,
          views: adsCount?.total_views || 0,
          clicks: adsCount?.total_clicks || 0,
          shares: adsCount?.total_shares || 0
        },
        businesses: {
          total: bizCount?.total || 0,
          active: bizCount?.active || 0
        },
        events: {
          total: eventsCount?.total || 0,
          active: eventsCount?.active || 0
        },
        reports: {
          total: reportsCount?.total || 0,
          pending: reportsCount?.pending || 0
        },
        clicks_breakdown: clicksBreakdown,
        top_categories: topCategories,
        top_advertisements: topAds,
        recent_activity: recentLogs
      }
    });
  } catch (error) {
    console.error('getOverviewStats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve analytics overview.' });
  }
};
