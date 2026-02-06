import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // Log every request to help debug 404s
    console.log(`[Middleware] ${request.method} ${pathname}${request.nextUrl.search}`, {
        bizId: request.headers.get('x-whop-biz-id'),
        expId: request.headers.get('x-whop-experience-id'),
        auth: !!request.headers.get('authorization'),
        referer: request.headers.get('referer'),
    });

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
