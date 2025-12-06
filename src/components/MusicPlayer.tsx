"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
}

interface LyricLine {
  time: number;
  text: string;
}

export default function MusicPlayer({ songs }: { songs: Song[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const lyricContainerRef = useRef<HTMLDivElement>(null);
  
  const currentSong = songs[currentIndex];

  // 1. 切换歌曲时，加载歌词
  useEffect(() => {
    if (!currentSong) return;
    setIsLoading(true);
    
    // 获取歌词
    fetch(`/api/music/lyric?id=${currentSong.id}`)
      .then(res => res.json())
      .then(data => {
        const lrcText = data?.lrc?.lyric || "";
        const parsed = parseLrc(lrcText);
        setLyrics(parsed);
        setIsLoading(false);
      });

    // 重置状态
    setProgress(0);
    setCurrentLyricIndex(0);
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [currentSong]);

  // 2. 播放进度监听
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    
    // 更新进度条
    if (duration) setProgress((currentTime / duration) * 100);

    // 同步歌词
    const index = lyrics.findIndex((line, i) => {
      const nextLine = lyrics[i + 1];
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });
    
    if (index !== -1 && index !== currentLyricIndex) {
      setCurrentLyricIndex(index);
      // 歌词滚动
      if (lyricContainerRef.current) {
        const activeItem = lyricContainerRef.current.children[index] as HTMLElement;
        if (activeItem) {
          lyricContainerRef.current.scrollTo({
            top: activeItem.offsetTop - 120, // 保持居中
            behavior: "smooth"
          });
        }
      }
    }
  };

  // LRC 解析函数
  const parseLrc = (lrc: string) => {
    const lines = lrc.split("\n");
    const result: LyricLine[] = [];
    const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
    
    lines.forEach(line => {
      const match = timeReg.exec(line);
      if (match) {
        const min = parseInt(match[1]);
        const sec = parseInt(match[2]);
        const ms = parseInt(match[3]);
        const time = min * 60 + sec + ms / 1000;
        const text = line.replace(timeReg, "").trim();
        if (text) result.push({ time, text });
      }
    });
    return result;
  };

  // 控制播放
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // 切换歌曲
  const changeSong = (direction: 'next' | 'prev') => {
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= songs.length) newIndex = 0;
    if (newIndex < 0) newIndex = songs.length - 1;
    setCurrentIndex(newIndex);
    setIsPlaying(true); // 切换后自动播放
  };

  if (!currentSong) return <div>NO DATA</div>;

  return (
    <div className="w-full max-w-5xl mx-auto bg-black/80 border border-white/10 backdrop-blur-xl p-6 md:p-10 relative overflow-hidden">
      
      {/* 装饰性UI */}
      <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-endfield-accent border-b border-l border-white/10">
        AUDIO_TERMINAL_V2.0
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* === 左侧：封面与控制 === */}
        <div className="md:col-span-5 flex flex-col items-center">
          
          {/* 旋转封面 (黑胶唱片效果) */}
          <motion.div 
            className="relative w-64 h-64 rounded-full border-4 border-white/5 p-2 mb-8 bg-black shadow-[0_0_50px_rgba(252,238,33,0.1)]"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", repeatType: "loop" }}
            style={{ animationPlayState: isPlaying ? "running" : "paused" }}
          >
            <div className="absolute inset-0 rounded-full overflow-hidden">
               <img src={currentSong.cover} alt="Cover" className="w-full h-full object-cover opacity-80" />
            </div>
            {/* 中心孔 */}
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 border border-white/20 flex items-center justify-center">
              <div className="w-2 h-2 bg-endfield-accent rounded-full animate-pulse" />
            </div>
          </motion.div>

          {/* 歌曲信息 */}
          <div className="text-center mb-6 w-full">
            <h2 className="text-2xl font-bold text-white truncate">{currentSong.title}</h2>
            <p className="text-sm font-mono text-endfield-dim mt-1">{currentSong.artist}</p>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center gap-6">
             <button onClick={() => changeSong('prev')} className="text-gray-400 hover:text-white transition-colors">
               PREV
             </button>
             <button 
               onClick={togglePlay}
               className="w-16 h-16 rounded-full bg-endfield-accent text-black flex items-center justify-center hover:scale-110 transition-transform"
             >
               {isPlaying ? (
                 <div className="flex gap-1"><div className="w-1.5 h-6 bg-black"/><div className="w-1.5 h-6 bg-black"/></div>
               ) : (
                 <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-black border-b-[10px] border-b-transparent ml-1" />
               )}
             </button>
             <button onClick={() => changeSong('next')} className="text-gray-400 hover:text-white transition-colors">
               NEXT
             </button>
          </div>
        </div>

        {/* === 右侧：歌词滚动 === */}
        <div className="md:col-span-7 h-[400px] border-l border-white/10 pl-6 relative">
           
           {/* 顶部遮罩 (渐变消失) */}
           <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/90 to-transparent z-10 pointer-events-none" />
           
           <div 
             ref={lyricContainerRef}
             className="h-full overflow-y-auto scrollbar-hide py-32 space-y-6 text-center md:text-left"
           >
             {isLoading ? (
               <div className="text-endfield-accent animate-pulse">LOADING_DATA_STREAM...</div>
             ) : lyrics.length > 0 ? (
               lyrics.map((line, i) => (
                 <div 
                   key={i}
                   className={`transition-all duration-300 font-mono text-sm cursor-pointer hover:text-white
                     ${i === currentLyricIndex 
                       ? 'text-endfield-accent scale-105 origin-left font-bold' 
                       : 'text-gray-600 blur-[0.5px] scale-100'
                     }
                   `}
                   onClick={() => {
                     if (audioRef.current) {
                       audioRef.current.currentTime = line.time;
                     }
                   }}
                 >
                   {line.text}
                 </div>
               ))
             ) : (
               <div className="text-gray-600">LYRIC_DATA_NOT_FOUND</div>
             )}
           </div>

           {/* 底部遮罩 */}
           <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/90 to-transparent z-10 pointer-events-none" />
        </div>

      </div>

      {/* 底部进度条 */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800 cursor-pointer group" onClick={(e) => {
         // 简单的点击跳转进度
         const rect = e.currentTarget.getBoundingClientRect();
         const x = e.clientX - rect.left;
         const percent = x / rect.width;
         if(audioRef.current && audioRef.current.duration) {
            audioRef.current.currentTime = percent * audioRef.current.duration;
         }
      }}>
        <div 
          className="h-full bg-endfield-accent relative" 
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white opacity-0 group-hover:opacity-100 rounded-full shadow-[0_0_10px_white] transition-opacity" />
        </div>
      </div>

      {/* 隐藏的 Audio 元素 */}
      <audio 
        ref={audioRef}
        src={`https://music.163.com/song/media/outer/url?id=${currentSong.id}.mp3`}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => changeSong('next')}
      />
    </div>
  );
}