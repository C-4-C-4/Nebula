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

        {/* 3. 申请友链说明区域 */}
        <div className="border border-white/10 bg-black/40 p-8 max-w-3xl mx-auto relative overflow-hidden mb-12">
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
                    <li>Site Name</li>
                    <li>Site URL</li>
                    <li>Logo URL (Optional)</li>
                    <li>Description</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                   <p className="text-white border-b border-white/10 pb-2">HOW_TO_APPLY:</p>
                   <p className="text-xs leading-relaxed">
                     Please leave a comment below with your site details.<br/>
                     Admin will review and update the registry.
                   </p>
                </div>
             </div>
           </div>
        </div>

        {/* 4. 评论区 */}
        <div className="max-w-4xl mx-auto">
          <Comments config={giscusConfig} />
        </div>

      </div>
    </main>
  );
}