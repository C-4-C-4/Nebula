import { getSortedPostsData } from "@/lib/posts";
import friendsData from "@/data/friends.json";
import Link from "next/link";
import NebulaContainer from "@/components/NebulaContainer"; 
import NebulaTerminal from "@/components/NebulaTerminal"; // 引入终端组件

export default function NebulaPage() {
  // 1. 获取并格式化文章数据
  const posts = getSortedPostsData().map(post => ({
    id: `post-${post.id}`,
    label: post.title,
    type: "POST" as const,
    link: `/blog/${post.id}`,
    date: post.date
  }));

  // 2. 获取并格式化友链数据
  const friends = friendsData.map(friend => ({
    id: `friend-${friend.id}`,
    label: friend.siteName,
    type: "FRIEND" as const,
    link: friend.url,
    date: "LINK"
  }));

  // 3. 合并所有节点数据
  const allNodes = [...posts, ...friends];

  return (
    // 强制全屏容器，防止 Canvas 高度塌陷
    <div className="fixed inset-0 w-screen h-screen bg-black z-50 overflow-hidden">
      
      {/* === Layer 1: 3D 场景 (底层) === */}
      <div className="absolute inset-0 z-0">
        <NebulaContainer nodes={allNodes} />
      </div>

      {/* === Layer 2: UI 覆盖层 (顶层 HUD) === */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none p-8 flex flex-col justify-between">
        
        {/* --- 顶部标题栏 --- */}
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

        {/* --- 底部区域 --- */}
        <div className="relative w-full flex justify-center items-end">
           
           {/* 1. 终端输入框 (居中显示) */}
           {/* pointer-events-auto 确保输入框可以点击和输入 */}
           <div className="pointer-events-auto w-full max-w-2xl z-20">
              <NebulaTerminal nodes={allNodes} />
           </div>

           {/* 2. 图例说明 (移至右下角，避免遮挡终端) */}
           <div className="absolute right-0 bottom-0 flex flex-col gap-2 items-end pointer-events-auto pb-1 hidden md:flex">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500">POSTS</span>
                <div className="w-2 h-2 bg-[#FCEE21] rounded-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500">FRIENDS</span>
                <div className="w-2 h-2 bg-[#00F0FF] rounded-sm" />
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}