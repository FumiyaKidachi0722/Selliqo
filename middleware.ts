import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // サポートされている言語パスがあるかをチェック
  if (pathname.startsWith('/en') || pathname.startsWith('/ja')) {
    return NextResponse.next();
  }

  // 言語が指定されていない場合、デフォルトの ja にリダイレクト
  return NextResponse.redirect(new URL(`/ja${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!_next).*)'], // _next フォルダを除くすべてのルートに適用
};
