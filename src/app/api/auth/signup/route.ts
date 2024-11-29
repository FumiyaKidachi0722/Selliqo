import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import stripe from '@/services/stripe';
import { UserRole } from '@/types/roles';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    // 入力値の検証
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'すべてのフィールドを入力してください' },
        { status: 400 }
      );
    }

    // Stripeで既存顧客を検索
    const existingCustomers = await stripe.customers.search({
      query: `email:"${email}"`,
    });

    if (existingCustomers.data.length > 0) {
      // 顧客が既に存在する場合はエラーを返す
      return NextResponse.json(
        { message: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }

    // パスワードをハッシュ化
    const passwordHash = await bcrypt.hash(password, 10);

    // 新規顧客を作成（metadataに保存）
    const customer = await stripe.customers.create({
      email,
      name: username,
      description: `顧客: ${email}`,
      metadata: {
        username,
        passwordHash, // ハッシュ化されたパスワードを保存
        role: UserRole.USER,
      },
    });

    // JWTトークンを生成
    const token = jwt.sign({ email, role: '2' }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    // 成功レスポンスを返す
    return NextResponse.json({
      token,
      username,
      email,
      role: '2',
      stripeCustomerId: customer.id,
    });
  } catch (error) {
    console.error('サインアップAPIエラー:', error);
    return NextResponse.json(
      { message: 'サインアップに失敗しました' },
      { status: 500 }
    );
  }
}
