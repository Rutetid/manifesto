import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/signup", "/w"];
const authRoutes = ["/login", "/signup"];

function getSessionCookie(request: NextRequest) {
  return (
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("better-auth.session_token")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )
  ) {
    // If user has a session cookie and visits auth routes, redirect to dashboard
    if (authRoutes.includes(pathname)) {
      const sessionCookie = getSessionCookie(request);
      if (sessionCookie) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Check session for protected routes
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
