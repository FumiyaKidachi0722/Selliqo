import { NextResponse } from 'next/server';

import stripe from '@/services/stripe'; // Stripe SDKインスタンスをインポート

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stripeCustomerId } = body;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: 'Stripe customer ID is required' },
        { status: 400 }
      );
    }

    // Stripe APIを使用して購入履歴を取得
    const charges = await stripe.charges.list({
      customer: stripeCustomerId, // 顧客IDでフィルタリング
    });

    // 必要な形式に整形してレスポンスとして返す
    const orders = charges.data.map((charge) => ({
      id: charge.id,
      amount: charge.amount,
      currency: charge.currency,
      description: charge.description,
      status: charge.status,
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
