import { getMyOrders } from '@/lib/db';  
import { NextResponse } from 'next/server';  
  
export async function GET() {  
  try {  
    const orders = await getMyOrders();  
    return NextResponse.json(orders);  
  } catch (error) {  
    console.error('Database error:', error);  
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });  
  }  
} 
