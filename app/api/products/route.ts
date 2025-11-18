import { getAllProducts } from '@/lib/db';  
import { NextResponse } from 'next/server';  
  
export async function GET() {  
  try {  
    const products = await getAllProducts();  
    return NextResponse.json(products);  
  } catch (error) {  
    console.error('Database error:', error);  
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });  
  }  
} 
