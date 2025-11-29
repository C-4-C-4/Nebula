import { getSortedPostsData } from "@/lib/posts"; // <--- 改用本地文件读取
import TechButton from "@/components/TechButton";
import ScrambleText from "@/components/ScrambleText";
import MatrixBackground from "@/components/MatrixBackground";
import Navbar from "@/components/Navbar";
import HeroCore from "@/components/HeroCore";
import SideHUD from "@/components/SideHUD";
import Link from "next/link"; // 引入 Link 跳转

export default function Home() {
  const posts = getSortedPostsData(); // <--- 同步读取文件

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      <Navbar />
      <SideHUD />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative z-10">
        
        {/* Top Hero 保持不变 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="border-l-4 border-endfield-accent pl-8 py-4">
            <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter leading-[0.85] mb-6">
              System<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-700">Override</span>
            </h1>
            <div className="flex gap-6 text-sm font-mono text-endfield-dim">
              <p>USER: ADMIN</p>
              <ScrambleText text="PROTOCOL: INITIATED" />
            </div>
            <div className="mt-8"><TechButton text="INITIATE_SCAN" /></div>
          </div>
          <div className="relative h-[400px] flex items-center justify-center"><HeroCore /></div>
        </div>

        {/* 文章列表 */}
        <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
           <h2 className="text-2xl font-bold font-mono flex items-center gap-2">
             <span className="w-2 h-2 bg-endfield-accent" />
             DATA_LOGS
           </h2>
           <span className="text-xs font-mono text-gray-500">TOTAL: {posts.length} RECORDS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            // 使用 Link 包裹整个卡片，点击跳转到详情页
            <Link href={`/blog/${post.id}`} key={post.id} className="block h-full">
              <article className="group relative bg-endfield-surface border border-white/10 hover:border-endfield-accent transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer">
                <div className="data-scan-overlay" /> 

                <div className="relative h-48 w-full overflow-hidden border-b border-white/5">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300 z-10" />
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                  <div className="absolute top-2 right-2 z-20 bg-black/80 text-endfield-accent text-[10px] font-mono px-2 py-1 border border-endfield-accent/30">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow relative z-10">
                  <div className="text-endfield-dim text-xs font-mono mb-2 flex justify-between">
                    <span>NO.{post.id.substring(0, 4).toUpperCase()}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-endfield-accent transition-colors">
                    {post.title}
                  </h3>
                  <div className="mt-auto pt-4 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-500 group-hover:text-white transition-colors">READ_ENTRY -&gt;</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className="w-1 h-1 bg-endfield-accent" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[10px] border-r-[10px] border-b-white/20 border-r-transparent group-hover:border-b-endfield-accent transition-colors" />
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}