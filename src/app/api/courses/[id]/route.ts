import { NextResponse } from 'next/server';

import stripe from '@/services/stripe';

interface StripePrice {
  unit_amount?: number;
}

interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  images: string[];
  default_price: StripePrice | null;
  metadata: {
    category?: string;
    schedule?: string;
    teacher?: string;
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      console.error('Error: Product ID is missing');
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = (await stripe.products.retrieve(id, {
      expand: ['default_price'],
    })) as StripeProduct;

    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      image: product.images[0] || '',
      price: product.default_price?.unit_amount || 0,
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
      {
        error: 'Failed to fetch product',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
