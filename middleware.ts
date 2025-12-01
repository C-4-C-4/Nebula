import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("admin_session");
  const token = cookie?.value;

  let isValid = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
      await jwtVerify(token, secret);
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  // 访问登录页，但已登录 -> 踢去后台
  if (pathname === "/login" && isValid) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 访问后台，但未登录 -> 踢去登录页
  if (pathname.startsWith("/admin") && !isValid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};