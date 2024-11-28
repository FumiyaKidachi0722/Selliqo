import { NextRequest, NextResponse } from 'next/server';

import stripe from '@/services/stripe';

// 型定義
interface Params {
  id: string;
}

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

// GET ハンドラー
export async function GET(request: NextRequest, context: { params: Params }) {
  try {
    // paramsからidを取得
    const params = await context.params; // 非同期解決
    console.log('Resolved params:', params);

    const id = params.id;
    if (!id) {
      console.error('Error: Product ID is missing');
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Stripe APIから商品情報を取得
    const product = (await stripe.products.retrieve(id, {
      expand: ['default_price'],
    })) as StripeProduct;

    // 商品情報を整形
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

    // JSONレスポンスを返す
    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
