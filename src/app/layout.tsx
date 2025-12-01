import type { Metadata } from "next";
// 1. 删除 next/font/google 的引用
// 2. 引入本地字体包的 CSS
import "@fontsource/oswald";
import "@fontsource/jetbrains-mono";

import "./globals.css";
import Footer from "@/components/Footer"; 
import Navbar from "@/components/Navbar"; 
import { fetchJsonData } from "@/lib/github"; 

export async function generateMetadata(): Promise<Metadata> {
  const file = await fetchJsonData("config.json");
  const title = file?.data?.siteTitle || "Endfield Blog System";
  return {
    title: title,
    description: "Industrial Techwear Style Blog",
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
      {/* 
         3. 移除了 className 中的变量名 (如 variable-oswald)
         因为我们现在直接在 tailwind.config.ts 里指定字体名称，不再依赖 CSS 变量 
      */}
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