import { NextRequest, NextResponse } from 'next/server';

import stripe from '@/services/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, price, lang } = body;

    console.log('id: ', id);
    console.log('lang: ', lang);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: name,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/${lang}/course/${id}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Failed to create Stripe Checkout session:', err);
    return NextResponse.json(
      { error: 'Failed to create Stripe Checkout session' },
      { status: 500 }
    );
  }
}
