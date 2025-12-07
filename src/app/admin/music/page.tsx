import { fetchJsonData } from "@/lib/github";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import AdminListForm from "@/components/AdminListForm"; // 引入表单暂存
import AdminListActions from "@/components/AdminListActions"; // 引入删除暂存

export const runtime = 'edge';

export default async function AdminMusicPage() {
  const file = await fetchJsonData("songs.json");
  const songs = (file?.data || []) as any[];
  const sha = file?.sha || "";

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-mono">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        
        <div className="mb-6"><Link href="/admin" className="text-xs text-gray-500 hover:text-white">&lt; RETURN</Link></div>
        <h1 className="text-2xl text-endfield-accent mb-8 border-b border-white/10 pb-2">MANAGE: PLAYLIST</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* 左侧：添加表单 (接入暂存) */}
          <div>
            <div className="bg-white/5 border border-white/10 p-6">
              <h3 className="text-sm font-bold text-gray-400 mb-4">ADD_NEW_TRACK</h3>
              
              <AdminListForm filename="songs.json" sha={sha} currentList={songs} idField="id">
                <div className="group mb-4">
                  <label className="block text-[10px] text-endfield-accent mb-1">NETEASE_SONG_ID</label>
                  <input name="id" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white" placeholder="e.g. 1969427429"/>
                </div>
                <div className="group mb-4">
                  <label className="block text-[10px] text-gray-500 mb-1">TITLE</label>
                  <input name="title" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white"/>
                </div>
                <div className="group mb-4">
                  <label className="block text-[10px] text-gray-500 mb-1">ARTIST</label>
                  <input name="artist" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white"/>
                </div>
                <div className="group mb-4">
                  <label className="block text-[10px] text-gray-500 mb-1">COVER_URL</label>
                  <input name="cover" className="w-full bg-black border border-white/20 p-2 text-xs focus:border-endfield-accent outline-none text-gray-300"/>
                </div>
              </AdminListForm>
            </div>
          </div>

          {/* 右侧：列表 (接入暂存删除) */}
          <div>
             <h3 className="text-sm font-bold text-gray-400 mb-4 flex justify-between">
               <span>CURRENT_QUEUE</span>
               <span className="text-xs bg-white/10 px-2">{songs.length}</span>
             </h3>
             <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
               {songs.map((song: any) => (
                 <div key={song.id} className="flex gap-3 bg-white/5 border border-white/10 p-3 hover:border-endfield-accent group">
                    <img src={song.cover} alt="cover" className="w-12 h-12 object-cover bg-black" />
                    <div className="flex-1 min-w-0">
                       <div className="text-sm font-bold text-white truncate">{song.title}</div>
                       <div className="text-xs text-gray-500 truncate">{song.artist}</div>
                    </div>
                    
                    {/* 使用暂存删除组件 */}
                    <AdminListActions 
                      filename="songs.json"
                      sha={sha}
                      itemId={song.id}
                      itemName={song.title}
                      fullList={songs}
                    />
                 </div>
               ))}
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}