import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";
import FriendCard from "@/components/FriendCard";
import friendsData from "@/data/friends.json"; // 引入 JSON 数据

export default function FriendsPage() {
  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* 1. 页面头部 */}
        <div className="mb-16 border-l-4 border-endfield-accent pl-6 py-2">
           <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">
             Link_<span className="text-endfield-accent">Connection</span>
           </h1>
           <p className="text-xs font-mono text-endfield-dim max-w-lg leading-relaxed">
             ESTABLISHING SECURE CONNECTION WITH EXTERNAL NODES.<br/>
             DATA EXCHANGE PROTOCOL: AUTHORIZED.
           </p>
        </div>

        {/* 2. 友链列表网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
           {friendsData.map((friend, idx) => (
             <FriendCard key={friend.id} data={friend} index={idx} />
           ))}
        </div>

        {/* 3. 申请友链说明区域 (做成工业协议的样子) */}
        <div className="border border-white/10 bg-black/40 p-8 max-w-3xl mx-auto relative overflow-hidden">
           {/* 背景大字装饰 */}
           <div className="absolute -right-4 -bottom-4 text-9xl font-bold text-white/5 pointer-events-none select-none">
             JOIN
           </div>

           <div className="relative z-10">
             <h2 className="text-xl font-bold text-endfield-accent mb-6 flex items-center gap-3">
               <span className="w-2 h-2 bg-endfield-accent animate-pulse" />
               APPLICATION_PROTOCOL // 申请友链
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-sm text-gray-400">
                <div className="space-y-4">
                  <p className="text-white border-b border-white/10 pb-2">REQUIRED_FIELDS:</p>
                  <ul className="space-y-2 list-disc list-inside text-xs">
                    <li>Site Name (站点名称)</li>
                    <li>Site URL (站点链接)</li>
                    <li>Logo URL (图标链接)</li>
                    <li>Snapshot (网站快照/封面)</li>
                    <li>Description (简短介绍)</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                   <p className="text-white border-b border-white/10 pb-2">HOW_TO_APPLY:</p>
                   <p className="text-xs leading-relaxed">
                     发送邮件至 <span className="text-white underline">your_email@example.com</span><br/>
                     或在 GitHub 仓库提交 PR 修改 <span className="bg-white/10 px-1">friends.json</span>。
                   </p>
                   <div className="pt-2">
                     <button className="bg-white/5 hover:bg-endfield-accent hover:text-black border border-white/20 px-4 py-2 text-xs transition-colors uppercase">
                       DOWNLOAD_TEMPLATE
                     </button>
                   </div>
                </div>
             </div>
           </div>
        </div>

      </div>
    </main>
  );
}