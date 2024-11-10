// src/app/api/courses/[id]/route.ts
import { NextResponse } from 'next/server';

import stripe from '@/services/stripe';
import { Course } from '@/types/course';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const getPrice = (
      price: string | { unit_amount?: number } | null
    ): number => {
      return typeof price === 'object' &&
        price !== null &&
        'unit_amount' in price
        ? (price.unit_amount ?? 0)
        : 0;
    };

    const product = await stripe.products.retrieve(params.id, {
      expand: ['default_price'],
    });

    const formattedProduct: Course = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      image: product.images[0] || '',
      price: getPrice(product.default_price),
      metadata: {
        category: product.metadata.category || '',
        schedule: product.metadata.schedule || '',
        teacher: product.metadata.teacher || '',
      },
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
