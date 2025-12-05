import type { Metadata } from "next";
// 引入本地字体包
import "@fontsource/oswald";
import "@fontsource/jetbrains-mono";

import "./globals.css";
import Footer from "@/components/Footer"; 
import Navbar from "@/components/Navbar"; 
import { fetchJsonData } from "@/lib/github"; 
import NextTopLoader from 'nextjs-toploader';

// 1. 动态生成 Metadata (标题 + Favicon)
export async function generateMetadata(): Promise<Metadata> {
  const file = await fetchJsonData("config.json");
  const data = file?.data || {};
  
  const title = data.siteTitle || "Endfield Blog System";
  // 如果后台没填，默认回退到 Next.js 自带的 /favicon.ico (你需要确保 public 文件夹里有这个文件)
  const favicon = data.favicon || "/favicon.ico";

  return {
    title: title,
    description: "Industrial Techwear Style Blog",
    // === 关键新增 ===
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon, // 顺便适配苹果设备
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const file = await fetchJsonData("config.json");
  const logoText = file?.data?.logoText || "ENDFIELD.SYS";

  return (
    <html lang="en">
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <div className="noise-bg" />
        
        <Navbar logoText={logoText} />

        <div className="flex-grow">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}