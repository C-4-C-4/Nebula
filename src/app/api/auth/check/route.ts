import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export const runtime = 'edge';

export async function GET() {
  const isAuth = await verifySession();
  return NextResponse.json({ authenticated: isAuth });
}