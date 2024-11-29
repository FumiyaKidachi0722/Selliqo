import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import stripe from '@/services/stripe';

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();
    console.log('Received identifier:', identifier);
    console.log('Received password:', password);

    if (!identifier || !password) {
      console.log('Missing fields');
      return NextResponse.json(
        { message: 'すべてのフィールドを入力してください' },
        { status: 400 }
      );
    }

    // Stripeで顧客リストを取得
    const customers = await stripe.customers.list({ limit: 100 });
    console.log('Fetched customers:', customers.data.length);

    const customer = customers.data.find(
      (cust) =>
        cust.email === identifier || cust.metadata?.username === identifier
    );

    if (!customer) {
      console.log('Customer not found');
      return NextResponse.json(
        { message: '認証情報が正しくありません' },
        { status: 400 }
      );
    }
    console.log('customer:', customer);

    const passwordHash = customer.metadata?.passwordHash;
    console.log('Password hash:', passwordHash);

    if (!passwordHash) {
      return NextResponse.json(
        { message: '認証情報が正しくありません' },
        { status: 400 }
      );
    }

    const match = await bcrypt.compare(password, passwordHash);

    if (!match) {
      console.log('Password does not match');
      return NextResponse.json(
        { message: '認証情報が正しくありません' },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { email: customer.email, role: '2' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      token,
      username: customer.metadata?.username || customer.email,
      email: customer.email,
      role: '2',
      stripeCustomerId: customer.id,
    });
  } catch (error) {
    console.error('ログインAPIエラー:', error);
    return NextResponse.json(
      { message: 'ログインに失敗しました' },
      { status: 500 }
    );
  }
}
