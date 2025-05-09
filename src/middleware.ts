import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const pathname = request.nextUrl.pathname;

  const isProtected = pathname.startsWith('/accounts') || pathname.startsWith('/api/accounts') || pathname.startsWith('/payment') || pathname.startsWith('/api/psd2-payments');
  const isRootPath = pathname === '/';

  // ⛔️ If token is missing and the route is protected, redirect to /
  if (isProtected && !token) {
    console.log('🔐 Token missing → redirecting to /');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ✅ Redirect to main page if token is present
  if (token && isRootPath) {
    console.log('🔁 Authenticated user on / → redirecting to /accounts');
    return NextResponse.redirect(new URL('/accounts', request.url));
  }

  console.log('✅ Auth OK or not a protected route');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/accounts',
    '/accounts/:path*',
    '/payment',
    '/payment/initiation',
    '/payment/list',
    '/payment/:path*',
    '/api/accounts',
    '/api/accounts/:path*',
    '/api/psd2-payments',
    '/api/psd2-payments/:path*',
  ],
};
