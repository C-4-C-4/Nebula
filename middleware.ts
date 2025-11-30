import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. 获取 Token
  const cookie = request.cookies.get("admin_session");
  const token = cookie?.value;

  // 2. 验证 Token 是否有效
  let isValid = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
      await jwtVerify(token, secret);
      isValid = true;
    } catch (error) {
      // Token 无效或过期
      isValid = false;
    }
  }

  // === 核心拦截逻辑 ===

  // A. 如果用户在【登录页】，但 Token 是【有效】的 -> 踢回后台
  if (pathname === "/login" && isValid) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // B. 如果用户在【后台】，但 Token 是【无效】的 -> 踢回登录页
  if (pathname.startsWith("/admin") && !isValid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // C. 其他情况：放行
  return NextResponse.next();
}

// 匹配路径配置
export const config = {
  matcher: [
    /*
     * 匹配所有以 /admin 开头的路径
     * 匹配 /login 路径
     */
    "/admin/:path*",
    "/login",
  ],
};