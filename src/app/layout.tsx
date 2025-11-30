import type { Metadata } from "next";
import { Oswald, JetBrains_Mono } from "next/font/google";
import "./globals.css";
// 引入 Footer
import Footer from "@/components/Footer"; 

const oswald = Oswald({ 
  subsets: ["latin"], 
  variable: "--font-oswald",
  display: "swap",
});

const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Endfield Blog System",
  description: "Industrial Techwear Style Blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <div className="noise-bg" />
        
        {/* flex-grow 让内容区撑开，确保 footer 始终在底部 */}
        <div className="flex-grow">
          {children}
        </div>

        {/* 底部 Footer */}
        <Footer />
      </body>
    </html>
  );
}