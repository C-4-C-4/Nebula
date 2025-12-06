import { fetchJsonData } from "@/lib/github";
import { fetchBangumiList } from "@/lib/bilibili";
import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";
import BangumiCard from "@/components/BangumiCard";
import ScrollGuide from "@/components/ScrollGuide";

export const revalidate = 3600; // ISR 1小时缓存

export default async function BangumiPage() {
  const configRes = await fetchJsonData("config.json");
  const config = configRes?.data || {};
  const uid = config.bilibiliUid;

  const list = await fetchBangumiList(uid);

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* 头部 */}
        <div className="mb-12 border-l-4 border-endfield-accent pl-6 py-2 flex justify-between items-end">
           <div>
             <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">
               Bangumi_<span className="text-endfield-accent">List</span>
             </h1>
             <p className="text-xs font-mono text-endfield-dim">
               BILIBILI DATABASE // SYNC_STATUS: ONLINE
             </p>
           </div>
           
           <div className="text-right hidden md:block">
             <div className="text-3xl font-bold text-white">{list.length}</div>
             <div className="text-[10px] text-gray-500 font-mono">TRACKING_ITEMS</div>
           </div>
        </div>

        <div className="-mt-10 mb-16 relative z-20">
           <ScrollGuide />
        </div>

        {/* 列表 */}
        {list.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
             {list.map((item, idx) => (
               <BangumiCard key={item.season_id} data={item} index={idx} />
             ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 bg-white/5">
            <div className="text-endfield-accent text-xl font-bold mb-2">NO_DATA_RECEIVED</div>
            <p className="text-xs text-gray-500 font-mono">
              Please check your Bilibili UID in Admin Config. <br/>
              Ensure your collection is set to PUBLIC.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}