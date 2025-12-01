import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

export const runtime = 'edge'; 

export async function POST(request: Request) {
  const body = await request.json();
  
  if (body.password === process.env.ADMIN_PASSWORD) {
    await createSession(); // 设置 Cookie
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}