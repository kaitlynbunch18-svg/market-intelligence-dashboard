import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function getOpportunities() {
  const result = await pool.query('SELECT * FROM mi_opportunities WHERE status = \'scored\' ORDER BY opportunity_score DESC, discovered_at DESC LIMIT 100');
  return result.rows.map(row => ({
    id: row.id.toString(),
    title: row.title,
    company: 'eBay Seller',
    value: parseFloat(row.revenue_potential),
    probability: parseFloat(row.opportunity_score),
    stage: 'discovery' as const,
    source: row.source_type,
    contact: { name: 'N/A', email: 'N/A', phone: 'N/A' },
    closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: row.discovered_at,
    nextAction: 'Review listing',
    tags: [row.condition, row.source_type],
    notes: row.url
  }));
}

export async function getDashboardStats() {
  const result = await pool.query('SELECT COUNT(*) as opportunities_today, SUM(revenue_potential) as total_potential_profit, AVG(revenue_potential) as avg_profit_per_deal FROM mi_opportunities WHERE status = \'scored\'');
  return {
    totalOpportunities: parseInt(result.rows[0].opportunities_today),
    totalValue: parseFloat(result.rows[0].total_potential_profit || '0'),
    expectedRevenue: parseFloat(result.rows[0].total_potential_profit || '0') * 0.7,
    avgProbability: 75
  };
}

export async function getMyOrders() {
  const result = await pool.query(`
    SELECT * FROM my_orders
    ORDER BY created_time DESC
    LIMIT 50
  `);
  return result.rows;
}

export async function getMyListings() {
  const result = await pool.query(`
    SELECT * FROM my_listings
    WHERE listing_status = 'Active'
    ORDER BY current_price DESC
  `);
  return result.rows;
}

export async function getAllProducts() {
  const result = await pool.query(`
    SELECT * FROM my_listings
    ORDER BY created_time DESC
  `);
  return result.rows;
}

export async function getBusinessStats() {
  const ordersResult = await pool.query(`
    SELECT
      COUNT(*) as total_orders,
      COALESCE(SUM(total_amount), 0) as total_revenue,
      COUNT(CASE WHEN created_time >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as orders_last_30_days,
      COALESCE(SUM(CASE WHEN created_time >= CURRENT_DATE - INTERVAL '30 days' THEN total_amount ELSE 0 END), 0) as revenue_last_30_days
    FROM my_orders
  `);

  const listingsResult = await pool.query(`
    SELECT
      COUNT(*) as active_listings,
      COALESCE(SUM(views), 0) as total_views,
      COALESCE(AVG(current_price), 0) as avg_price
    FROM my_listings
    WHERE listing_status = 'Active'
  `);

  return {
    orders: {
      total_orders: parseInt(ordersResult.rows[0].total_orders),
      total_revenue: parseFloat(ordersResult.rows[0].total_revenue),
      orders_last_30_days: parseInt(ordersResult.rows[0].orders_last_30_days),
      revenue_last_30_days: parseFloat(ordersResult.rows[0].revenue_last_30_days)
    },
    listings: {
      active_listings: parseInt(listingsResult.rows[0].active_listings),
      total_views: parseInt(listingsResult.rows[0].total_views),
      avg_price: parseFloat(listingsResult.rows[0].avg_price)
    }
  };
}