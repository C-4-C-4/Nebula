import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

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

export async function createSession() {
  const jwt = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set("admin_session", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

// === 重点修改这里 ===
export async function deleteSession() {
  const cookieStore = await cookies();
  // 强制覆盖为空字符串，并设置过期时间为 0 (1970年)
  // 这比单纯的 delete 更暴力、更有效
  cookieStore.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), 
    path: '/',
  });
}