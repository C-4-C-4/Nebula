import { fetchJsonData } from "@/lib/github";
import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";
import TimelineItem, { TimelineEvent } from "@/components/TimelineItem";
import ScrollGuide from "@/components/ScrollGuide";

export const revalidate = 3600;

export default async function TimelinePage() {
  const file = await fetchJsonData("timeline.json");
  // 按日期降序排列
  const logs = ((file?.data || []) as TimelineEvent[]).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* 头部 */}
        <div className="mb-12 border-l-4 border-endfield-accent pl-6 py-2 flex justify-between items-end">
           <div>
             <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">
               System_<span className="text-endfield-accent">Logs</span>
             </h1>
             <p className="text-xs font-mono text-endfield-dim">
               CHRONOLOGICAL EVENT RECORDS // V4.0
             </p>
           </div>
           <div className="hidden md:block text-right">
             <div className="text-2xl font-bold text-white">{logs.length}</div>
             <div className="text-[10px] text-gray-500 font-mono">TOTAL_ENTRIES</div>
           </div>
        </div>

        <div className="-mt-8 mb-16 relative z-20">
           <ScrollGuide />
        </div>

        {/* 时间轴容器 */}
        <div className="relative pl-4 md:pl-0">
          {logs.map((log, idx) => (
            <TimelineItem key={log.id} data={log} index={idx} />
          ))}
          
          {/* 底部结束点 */}
          <div className="flex gap-6 items-start">
             <div className="w-24 hidden md:block" />
             <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-gray-700" />
             </div>
             <div className="text-[10px] font-mono text-gray-600 pt-1">
               // END_OF_RECORDS
             </div>
          </div>
        </div>

      </div>
    </main>
  );
}