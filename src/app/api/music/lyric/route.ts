import { NextResponse } from "next/server";

export const runtime = 'edge'; // 使用 Edge Runtime

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ lrc: { lyric: "" } });

  try {
    // 网易云歌词接口
    const res = await fetch(`https://music.163.com/api/song/lyric?id=${id}&lv=1&kv=1&tv=-1`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://music.163.com",
        "Cookie": "os=pc" // 简单的伪装
      }
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ lrc: { lyric: "[00:00.00]Lyric fetch failed" } });
  }
}