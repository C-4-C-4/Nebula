import { fetchJsonData, saveJsonData } from "@/lib/github";
import { revalidatePath } from "next/cache";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// 兼容 Cloudflare Pages
export const runtime = 'edge';

// === Action 1: 新增歌曲 ===
async function addSongAction(formData: FormData) {
  "use server";
  const sha = formData.get("sha") as string;
  
  // 1. 获取现有数据
  const file = await fetchJsonData("songs.json");
  const currentSongs = file?.data || [];

  // 2. 构造新歌曲对象
  const newSong = {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    artist: formData.get("artist") as string,
    // 如果没填封面，用默认图
    cover: (formData.get("cover") as string) || "https://placehold.co/300x300/000/FFF?text=NO_COVER"
  };

  // 3. 追加并保存
  // 这里的 ...currentSongs 放在前面，新歌放在最后 (或者放在最前 [newSong, ...currentSongs])
  const updatedSongs = [...currentSongs, newSong];

  // 注意：这里使用 file.sha (最新的)，而不是页面传过来的旧 sha，防止冲突
  // 如果首次创建，file 可能为 null，需处理
  await saveJsonData("songs.json", updatedSongs, file?.sha || sha);
  
  revalidatePath("/music");
  revalidatePath("/admin/music");
}

// === Action 2: 删除歌曲 ===
async function deleteSongAction(formData: FormData) {
  "use server";
  const idToDelete = formData.get("id") as string;
  
  const file = await fetchJsonData("songs.json");
  if (!file) return;

  const updatedSongs = (file.data as any[]).filter((s: any) => s.id !== idToDelete);

  await saveJsonData("songs.json", updatedSongs, file.sha);
  revalidatePath("/music");
  revalidatePath("/admin/music");
}

export default async function AdminMusicPage() {
  const file = await fetchJsonData("songs.json");
  const songs = (file?.data || []) as any[];
  const sha = file?.sha || "";

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-mono selection:bg-endfield-accent selection:text-black">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        
        <div className="mb-6">
          <Link href="/admin" className="text-xs text-gray-500 hover:text-white flex items-center gap-1 w-fit">
             &lt; RETURN_TO_DASHBOARD
          </Link>
        </div>

        <h1 className="text-2xl text-endfield-accent mb-8 border-b border-white/10 pb-2">
          MANAGE: PLAYLIST_DB
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* === 左侧：添加表单 === */}
          <div>
            <div className="bg-white/5 border border-white/10 p-6">
              <h3 className="text-sm font-bold text-gray-400 mb-4 border-l-2 border-endfield-accent pl-2">ADD_NEW_TRACK</h3>
              
              <form action={addSongAction} className="space-y-4">
                <input type="hidden" name="sha" value={sha} />
                
                <div className="group">
                  <label className="block text-[10px] text-endfield-accent mb-1">NETEASE_SONG_ID (网易云ID)</label>
                  <input name="id" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white placeholder-gray-700" placeholder="e.g. 1969427429"/>
                </div>

                <div className="group">
                  <label className="block text-[10px] text-gray-500 mb-1">TITLE</label>
                  <input name="title" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white"/>
                </div>

                <div className="group">
                  <label className="block text-[10px] text-gray-500 mb-1">ARTIST</label>
                  <input name="artist" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white"/>
                </div>

                <div className="group">
                  <label className="block text-[10px] text-gray-500 mb-1">COVER_URL (Optional)</label>
                  <input name="cover" className="w-full bg-black border border-white/20 p-2 text-xs focus:border-endfield-accent outline-none text-gray-300" placeholder="https://..."/>
                  <p className="text-[9px] text-gray-600 mt-1">Right click song cover on music.163.com to get URL.</p>
                </div>

                <button className="w-full bg-endfield-accent text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest text-xs mt-4">
                  + REGISTER_TO_DATABASE
                </button>
              </form>
            </div>
          </div>

          {/* === 右侧：现有列表 === */}
          <div>
             <h3 className="text-sm font-bold text-gray-400 mb-4 flex justify-between items-center">
               <span>CURRENT_QUEUE</span>
               <span className="text-xs font-mono bg-white/10 px-2 py-0.5">{songs.length}</span>
             </h3>

             <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800">
               {songs.map((song: any) => (
                 <div key={song.id} className="flex gap-3 bg-white/5 border border-white/10 p-3 hover:border-endfield-accent transition-colors group">
                    <img src={song.cover} alt="cover" className="w-12 h-12 object-cover bg-black" />
                    <div className="flex-1 min-w-0">
                       <div className="text-sm font-bold text-white truncate group-hover:text-endfield-accent">{song.title}</div>
                       <div className="text-xs text-gray-500 truncate">{song.artist}</div>
                       <div className="text-[9px] text-gray-700 font-mono mt-1">ID: {song.id}</div>
                    </div>
                    
                    <form action={deleteSongAction} className="flex items-center">
                      <input type="hidden" name="id" value={song.id} />
                      <button className="text-xs text-red-900 border border-red-900/30 px-2 py-1 hover:bg-red-600 hover:text-white transition-colors">
                        DEL
                      </button>
                    </form>
                 </div>
               ))}

               {songs.length === 0 && (
                 <div className="text-center py-8 text-gray-600 border border-dashed border-white/10 text-xs">
                   DATABASE_EMPTY
                 </div>
               )}
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}