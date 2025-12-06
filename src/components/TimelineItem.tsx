"use client";
import { motion } from "framer-motion";

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  content: string;
  type: "MILESTONE" | "UPDATE" | "FIX" | "ALERT";
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "MILESTONE": return "text-[#FCEE21] border-[#FCEE21]"; // 黄
    case "UPDATE": return "text-[#00F0FF] border-[#00F0FF]";    // 青
    case "ALERT": return "text-red-500 border-red-500";         // 红
    default: return "text-gray-400 border-gray-400";            // 灰
  }
};

const getTypeBg = (type: string) => {
  switch (type) {
    case "MILESTONE": return "bg-[#FCEE21]";
    case "UPDATE": return "bg-[#00F0FF]";
    case "ALERT": return "bg-red-500";
    default: return "bg-gray-400";
  }
};

export default function TimelineItem({ data, index }: { data: TimelineEvent; index: number }) {
  const colorClass = getTypeColor(data.type);
  const bgClass = getTypeBg(data.type);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-6 relative"
    >
      {/* 1. 左侧：时间戳 */}
      <div className="w-24 pt-2 text-right hidden md:block">
        <div className="text-xs font-mono text-endfield-dim">{data.date}</div>
      </div>

      {/* 2. 中间：轴线 */}
      <div className="relative flex flex-col items-center">
        {/* 节点点 */}
        <div className={`w-3 h-3 rounded-full border-2 ${colorClass} bg-black z-10 box-content`} />
        {/* 垂线 */}
        <div className="w-[1px] h-full bg-white/10 absolute top-3" />
      </div>

      {/* 3. 右侧：内容卡片 */}
      <div className="flex-1 pb-12">
        <div className={`
          border ${colorClass} bg-black/40 backdrop-blur-sm p-4 relative group
          hover:bg-white/5 transition-colors
        `}>
          {/* 装饰角标 */}
          <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${colorClass}`} />
          <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${colorClass}`} />

          {/* 头部信息 */}
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${colorClass} ${data.type === 'MILESTONE' ? bgClass + ' text-black' : ''}`}>
              {data.type}
            </span>
            <span className="text-[10px] font-mono text-gray-500 md:hidden">{data.date}</span>
            <span className="text-[10px] font-mono text-gray-600">ID: {data.id}</span>
          </div>

          {/* 标题与内容 */}
          <h3 className={`text-lg font-bold uppercase mb-2 ${data.type === 'MILESTONE' ? 'text-white' : 'text-gray-300'}`}>
            {data.title}
          </h3>
          <p className="text-xs font-mono text-gray-400 leading-relaxed whitespace-pre-wrap">
            {data.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}