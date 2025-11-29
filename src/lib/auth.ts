import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// 验证 Token
export async function verifySession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (!session) return false;

  try {
    await jwtVerify(session, SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

// 创建 Session (登录成功后调用)
export async function createSession() {
  const jwt = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // 24小时过期
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set("admin_session", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

// 销毁 Session (登出)
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}