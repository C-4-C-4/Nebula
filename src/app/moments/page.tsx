import { fetchLatestRssPosts } from "@/lib/rss";
import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";
import MomentCard from "@/components/MomentCard";
import ScrollGuide from "@/components/ScrollGuide";

// 每小时更新一次 RSS 数据
export const revalidate = 3600;

export default async function MomentsPage() {
  const posts = await fetchLatestRssPosts();

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      
      {/* RootLayout 已包含 Navbar，这里不需要 */}

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* 头部 */}
        <div className="mb-12 border-l-4 border-endfield-accent pl-6 py-2 flex justify-between items-end">
           <div>
             <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">
               Signal_<span className="text-endfield-accent">Network</span>
             </h1>
             <p className="text-xs font-mono text-endfield-dim">
               INTERCEPTED SIGNALS FROM ALLIED NODES.
             </p>
           </div>
           <div className="hidden md:block text-right">
             <div className="text-3xl font-bold text-white">{posts.length}</div>
             <div className="text-[10px] text-gray-500 font-mono">ACTIVE_SOURCES</div>
           </div>
        </div>

        <div className="-mt-10 mb-16 relative z-20">
           <ScrollGuide />
        </div>

        {/* 动态列表 */}
        {posts.length > 0 ? (
          <div className="space-y-4">
             {posts.map((post, idx) => (
               <MomentCard key={`${post.sourceId}-${idx}`} data={post} index={idx} />
             ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-white/10 bg-white/5">
            <div className="text-endfield-accent text-xl font-bold mb-2">NO_SIGNALS_DETECTED</div>
            <p className="text-xs text-gray-500 font-mono">
              The frequency is silent. Check your RSS configurations.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}