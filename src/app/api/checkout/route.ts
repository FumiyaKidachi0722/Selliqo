import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('body: ', body);
    const { id, stripeCustomerId, lang } = body;

    if (!id || !stripeCustomerId) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Stripe APIを使用してコース情報（Product）を取得
    const product = (await stripe.products.retrieve(id, {
      expand: ['default_price'],
    })) as StripeProduct;
    console.log('product: ', product);

    if (!product) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    console.log('product.name: ', product.name);
    console.log('price: ', product.default_price.unit_amount);
    console.log('stripeCustomerId: ', stripeCustomerId);

    // Stripe Checkoutセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: product.name,
            },
            unit_amount: product.default_price.unit_amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer: stripeCustomerId,
      success_url: `${process.env.BASE_URL}/${lang}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/${lang}/course/${id}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Failed to create Stripe Checkout session:', err.message);
    return NextResponse.json(
      { error: 'Failed to create Stripe Checkout session' },
      { status: 500 }
    );
  }
}
