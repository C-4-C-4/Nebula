export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-mono text-white relative overflow-hidden">
      {/* 背景网格装饰 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="z-10 flex flex-col items-center gap-6">
        {/* 1. 旋转的加载圈 */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-t-2 border-endfield-accent rounded-full animate-spin" />
          <div className="absolute inset-2 border-r-2 border-white/20 rounded-full animate-spin [animation-direction:reverse]" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-2 h-2 bg-endfield-accent animate-pulse" />
          </div>
        </div>

        {/* 2. 闪烁的文字 */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold tracking-widest text-endfield-accent animate-pulse">
            ACCESSING_DATABASE...
          </h3>
          <p className="text-[10px] text-gray-500">
            // DECRYPTING SECURE PACKETS
          </p>
        </div>

        {/* 3. 假进度条 */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-endfield-accent w-full origin-left animate-[progress_1.5s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* 补充 CSS 动画 */}
      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}