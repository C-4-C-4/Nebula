export default function SideHUD() {
  return (
    <>
      {/* === 左侧装饰带 === */}
      <div className="hidden 2xl:block fixed left-6 top-1/2 -translate-y-1/2 h-[80vh] w-12 z-0 pointer-events-none flex flex-col justify-between">
        {/* 上部刻度 */}
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-mono text-endfield-dim rotate-90 origin-bottom-left translate-x-4">
            SYSTEM_LEVEL_01
          </div>
          {/* 刻度线 */}
          <div className="w-2 h-[100px] border-r border-endfield-dim/30 flex flex-col justify-between items-end pr-1">
             {[...Array(10)].map((_, i) => (
               <div key={i} className={`h-[1px] bg-endfield-dim/50 ${i % 2 === 0 ? 'w-2' : 'w-1'}`} />
             ))}
          </div>
        </div>

        {/* 中部大字 */}
        <div className="text-endfield-dim/10 font-bold text-8xl font-sans writing-vertical-rl select-none">
          AR-KV-02
        </div>

        {/* 下部条形码装饰 */}
        <div className="space-y-1">
          <div className="w-1 h-12 bg-endfield-accent/20" />
          <div className="w-1 h-4 bg-endfield-accent/20" />
          <div className="w-1 h-8 bg-endfield-accent/50" />
          <div className="text-[9px] font-mono text-endfield-accent mt-2 writing-vertical-rl">
             NO.9527
          </div>
        </div>
      </div>

      {/* === 右侧装饰带 === */}
      <div className="hidden 2xl:block fixed right-6 top-1/2 -translate-y-1/2 h-[80vh] w-12 z-0 pointer-events-none flex flex-col justify-between items-end">
        
        {/* 顶部警示块 */}
        <div className="border border-endfield-accent/30 p-1 mb-10">
           <div className="w-2 h-2 bg-endfield-accent animate-pulse" />
        </div>

        {/* 垂直连线 */}
        <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-endfield-dim/20 to-transparent relative">
           {/* 线上的游标动画 */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-endfield-accent/50 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>

        {/* 底部功能区文字 */}
        <div className="mt-4 text-right">
           <p className="text-[9px] font-mono text-gray-600 mb-1">LAT: 34.05N</p>
           <p className="text-[9px] font-mono text-gray-600 mb-1">LNG: 118.2W</p>
           <div className="w-8 h-[2px] bg-endfield-dim" />
        </div>

        {/* 背景大字装饰 */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 text-endfield-dim/5 font-sans font-bold text-9xl select-none pointer-events-none rotate-90">
           CAUTION
        </div>
      </div>
    </>
  );
}