import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n/config';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export async function middleware(req: NextRequest) {
  // Handle internationalization first
  const pathname = req.nextUrl.pathname;
  
  // Skip i18n for API routes, auth callbacks, and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i.test(pathname)
  ) {
    // Handle auth for protected API routes and dashboard
    if (pathname.startsWith('/api/admin') || pathname.startsWith('/admin')) {
      const res = NextResponse.next();
      const supabase = createMiddlewareClient({ req, res });
      
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/es/sign-in';
        redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }
      
      return res;
    }
    
    return NextResponse.next();
  }

  // Apply internationalization middleware
  const intlResponse = intlMiddleware(req);
  
  // If intl middleware returns a response (redirect), use it
  if (intlResponse) {
    return intlResponse;
  }

  // Handle Supabase auth after i18n
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Extract locale from pathname
  const segments = pathname.split('/');
  const locale = segments[1];
  const pathWithoutLocale = '/' + segments.slice(2).join('/');

  // If there's no session and the user is trying to access a protected route
  if (!session && (pathWithoutLocale.startsWith("/dashboard") || pathWithoutLocale.startsWith("/admin"))) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/sign-in`;
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If there's a session and the user is trying to access auth routes
  if (
    session &&
    (pathWithoutLocale.startsWith("/sign-in") ||
      pathWithoutLocale.startsWith("/sign-up") ||
      pathWithoutLocale.startsWith("/forgot-password") ||
      pathWithoutLocale.startsWith("/reset-password"))
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, and static files
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$).*)'
  ]
};
