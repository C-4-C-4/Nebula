import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";
import FriendCard from "@/components/FriendCard";
import friendsData from "@/data/friends.json";
import { fetchJsonData } from "@/lib/github";
import Comments from "@/components/Comments"; 

export default async function FriendsPage() {
  const file = await fetchJsonData("config.json");
  const giscusConfig = file?.data?.giscusConfig || {};

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      
      {/* RootLayout 已包含 Navbar */}

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* 1. 页面头部 */}
        <div className="mb-12 border-l-4 border-endfield-accent pl-6 py-2">
           <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">
             Link_<span className="text-endfield-accent">Connection</span>
           </h1>
           <p className="text-xs font-mono text-endfield-dim max-w-lg leading-relaxed">
             ESTABLISHING SECURE CONNECTION WITH EXTERNAL NODES.<br/>
             DATA EXCHANGE PROTOCOL: AUTHORIZED.
           </p>
        </div>

        {/* 2. 申请友链说明区域 (已移至列表上方) */}
        <div className="border border-white/10 bg-black/40 p-8 relative overflow-hidden mb-16">
           {/* 背景大字装饰 */}
           <div className="absolute -right-4 -bottom-4 text-9xl font-bold text-white/5 pointer-events-none select-none">
             JOIN
           </div>

           <div className="relative z-10">
             <h2 className="text-xl font-bold text-endfield-accent mb-6 flex items-center gap-3">
               <span className="w-2 h-2 bg-endfield-accent animate-pulse" />
               APPLICATION_PROTOCOL // 申请友链
             </h2>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono text-sm text-gray-400 mb-8">
                <div className="space-y-4">
                  <p className="text-white border-b border-white/10 pb-2">REQUIRED_FIELDS:</p>
                  <ul className="space-y-2 list-disc list-inside text-xs">
                    <li>Site Name (站点名称)</li>
                    <li>Site URL (站点地址)</li>
                    <li>Logo URL (可选，自动获取)</li>
                    <li>Description (一句话简介)</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                   <p className="text-white border-b border-white/10 pb-2">HOW_TO_APPLY:</p>
                   <p className="text-xs leading-relaxed">
                     To establish a connection, please use one of the methods below. 
                     <br/>
                     Admin will review and update the registry periodically.
                   </p>
                </div>
             </div>

             {/* === 新增：操作按钮组 === */}
             <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/10">
                {/* 按钮 1: 跳转评论区 */}
                <a 
                  href="#comments-section"
                  className="flex-1 bg-endfield-accent text-black font-bold py-3 px-4 text-xs text-center hover:bg-white transition-colors uppercase tracking-widest clip-path-button flex items-center justify-center gap-2"
                >
                  <span>💬</span> LEAVE_COMMENT
                </a>

                {/* 按钮 2: 跳转 GitHub */}
                <a 
                  href="https://github.com/C-4-C-4/Nebula/blob/master/src/data/friends.json" 
                  target="_blank"
                  className="flex-1 border border-white/20 bg-white/5 text-white font-bold py-3 px-4 text-xs text-center hover:bg-white/10 hover:border-endfield-accent transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <span>⚡</span> SUBMIT_PR (GITHUB)
                </a>

                {/* 按钮 3: 邮箱联系 */}
                <a 
                  href="mailto:slxz3238@gmail.com"
                  className="flex-1 border border-white/20 bg-white/5 text-white font-bold py-3 px-4 text-xs text-center hover:bg-white/10 hover:border-endfield-accent transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <span>✉️</span> EMAIL_CONTACT
                </a>
             </div>
           </div>
        </div>

        {/* 3. 友链列表网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
           {friendsData.map((friend, idx) => (
             <FriendCard key={friend.id} data={friend} index={idx} />
           ))}
        </div>

        {/* 4. 评论区 (添加了 id 用于锚点跳转) */}
        <div id="comments-section" className="max-w-4xl mx-auto scroll-mt-24">
          <Comments config={giscusConfig} />
        </div>

      </div>
    </main>
  );
}