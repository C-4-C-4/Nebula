import { fetchJsonData } from "@/lib/github";
import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";
import MusicPlayer from "@/components/MusicPlayer";

export const revalidate = 3600;

export default async function MusicPage() {
  // 读取歌曲数据
  const file = await fetchJsonData("songs.json");
  // 默认数据兜底
  const songs = file?.data || [
    {
      id: "1969427429", // 终末地PV曲
      title: "Endfield (Demo)",
      artist: "Hypergryph",
      cover: "https://p2.music.126.net/C3zY5z5_k_Xw9x8n9j2z5g==/109951167746366869.jpg"
    }
  ];

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="mb-12 border-l-4 border-endfield-accent pl-6 py-2">
           <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">
             Audio_<span className="text-endfield-accent">Log</span>
           </h1>
           <p className="text-xs font-mono text-endfield-dim">
             PLAYBACK_MODULE // NCM_SOURCE_CONNECTED
           </p>
        </div>

        <MusicPlayer songs={songs} />
      </div>
    </main>
  );
}