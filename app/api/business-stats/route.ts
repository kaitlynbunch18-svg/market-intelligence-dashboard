import { getBusinessStats } from '@/lib/db';  
import { NextResponse } from 'next/server';  
  
export async function GET() {  
  try {  
    const stats = await getBusinessStats();  
    return NextResponse.json(stats);  
  } catch (error) {  
    console.error('Database error:', error);  
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });  
  }  
} 
