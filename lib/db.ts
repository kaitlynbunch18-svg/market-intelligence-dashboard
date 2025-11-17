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