import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  // 只拦截 /admin 开头的路由
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const session = request.cookies.get("admin_session")?.value;

    // 如果没有 cookie，跳转到登录页
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // 验证 JWT
      await jwtVerify(session, SECRET);
      return NextResponse.next();
    } catch (error) {
      // 验证失败，跳转登录页
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};