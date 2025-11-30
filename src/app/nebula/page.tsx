import { getSortedPostsData } from "@/lib/posts";
import friendsData from "@/data/friends.json";
import NebulaScene from "@/components/NebulaScene";
import Link from "next/link";

export default function NebulaPage() {
  // 1. 获取文章数据
  const posts = getSortedPostsData().map(post => ({
    id: `post-${post.id}`,
    label: post.title,
    type: "POST" as const,
    link: `/blog/${post.id}`,
    date: post.date
  }));

  // 2. 获取友链数据
  const friends = friendsData.map(friend => ({
    id: `friend-${friend.id}`,
    label: friend.siteName,
    type: "FRIEND" as const,
    link: friend.url,
    date: "LINK"
  }));

  // 3. 合并所有节点
  const allNodes = [...posts, ...friends];

  return (
    <main className="w-full h-screen relative overflow-hidden">
      {/* 3D 场景容器 */}
      <div className="absolute inset-0 z-0">
        <NebulaScene nodes={allNodes} />
      </div>

      {/* UI 覆盖层 (HUD) */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none p-8 flex flex-col justify-between">
        
        {/* 顶部标题 */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div>
            <h1 className="text-4xl font-bold text-white uppercase tracking-tighter">
              Project <span className="text-endfield-accent">Nebula</span>
            </h1>
            <p className="text-xs font-mono text-gray-400 mt-1">
              DATA VISUALIZATION // STAR CHART MODE
            </p>
          </div>
          
          <Link href="/" className="group flex items-center gap-2 border border-white/20 bg-black/50 backdrop-blur px-4 py-2 hover:bg-white/10 transition-colors">
            <span className="text-xs font-mono text-endfield-accent">&lt; RETURN_HOME</span>
          </Link>
        </div>

        {/* 底部图例 */}
        <div className="flex gap-6 pointer-events-auto">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-[#FCEE21] rounded-sm" />
             <span className="text-xs font-mono text-gray-300">DATA_LOGS (POSTS)</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-[#00F0FF] rounded-sm" />
             <span className="text-xs font-mono text-gray-300">EXTERNAL_LINKS (FRIENDS)</span>
           </div>
        </div>

      </div>
    </main>
  );
}