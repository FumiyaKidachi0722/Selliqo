// src/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // ここで、実際のログイン認証ロジックを追加
    if (email === 'test@example.com' && password === 'password') {
      // 正常な場合、ユーザー情報を返す
      return NextResponse.json({ success: true, message: 'Login successful' });
    } else {
      // 認証失敗の場合はエラーメッセージを返す
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error processing request' },
      { status: 500 }
    );
  }
}
