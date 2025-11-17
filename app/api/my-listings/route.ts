import { getMyListings } from '@/lib/db';  
import { NextResponse } from 'next/server';  
  
export async function GET() {  
  try {  
    const listings = await getMyListings();  
    return NextResponse.json(listings);  
  } catch (error) {  
    console.error('Database error:', error);  
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });  
  }  
} 
