import { getOpportunities, getDashboardStats } from '@/lib/db';  
import { NextResponse } from 'next/server';  
  
export async function GET() {  
  try {  
    const opportunities = await getOpportunities();  
    const stats = await getDashboardStats();  
    return NextResponse.json({ opportunities, stats });  
  } catch (error) {  
    console.error('Database error:', error);  
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });  
  }  
} 
