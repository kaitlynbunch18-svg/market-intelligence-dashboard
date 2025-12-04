import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT * FROM mi_opportunities 
      WHERE status = 'scored'
      ORDER BY opportunity_score DESC, discovered_at DESC
      LIMIT 100
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
