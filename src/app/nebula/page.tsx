import { getSortedPostsData } from "@/lib/posts";
import friendsData from "@/data/friends.json";
import Link from "next/link";
import NebulaContainer from "@/components/NebulaContainer"; // 引入刚才创建的中间组件

export default function NebulaPage() {
  // 1. 数据获取逻辑 (在服务端运行)
  const posts = getSortedPostsData().map(post => ({
    id: `post-${post.id}`,
    label: post.title,
    type: "POST" as const,
    link: `/blog/${post.id}`,
    date: post.date
  }));

  const friends = friendsData.map(friend => ({
    id: `friend-${friend.id}`,
    label: friend.siteName,
    type: "FRIEND" as const,
    link: friend.url,
    date: "LINK"
  }));

  const allNodes = [...posts, ...friends];

  return (
    // CSS 保持不变，确保满屏
    <div className="fixed inset-0 w-screen h-screen bg-black z-50 overflow-hidden">
      
      {/* 2. 3D 场景容器 */}
      <div className="absolute inset-0 z-0">
        {/* 将数据传给客户端组件 */}
        <NebulaContainer nodes={allNodes} />
      </div>

      {/* 3. UI 覆盖层 (HUD) */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none p-8 flex flex-col justify-between">
        
        {/* 顶部标题栏 */}
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
    </div>
  );
}