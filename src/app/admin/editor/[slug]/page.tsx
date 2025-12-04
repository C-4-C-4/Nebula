import { fetchGithubFileContent, saveGithubFile } from "@/lib/github";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Server Action
async function saveAction(formData: FormData) {
  "use server";
  const originalSlug = formData.get("originalSlug") as string;
  const sha = formData.get("sha") as string;
  const title = formData.get("title");
  const date = formData.get("date");
  const category = formData.get("category");
  const image = formData.get("image");
  const slug = formData.get("slug") as string;
  const body = formData.get("content");

  const fileContent = `---
title: "${title}"
date: "${date}"
category: "${category}"
image: "${image}"
---

${body}`;

  await saveGithubFile(slug, fileContent, sha || undefined);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

// 务必声明为 Edge 运行时以兼容 Cloudflare
export const runtime = 'edge';

export default async function EditorPage({ params }: { params: { slug: string } }) {
  // Next.js 15+ 中 params 是 Promise，需要 await
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug); // 确保在页面显示时也是解码的
  const isNew = decodedSlug === "new";
  
  let initialData = {
    slug: "",
    sha: "",
    frontMatter: { title: "", date: new Date().toISOString().split('T')[0], category: "REPORT", image: "" } as any,
    content: ""
  };

  if (!isNew) {
    // 尝试获取数据
    const data = await fetchGithubFileContent(decodedSlug);
    // 如果获取成功，覆盖初始数据
    if (data) {
      initialData = data;
    } else {
      // 如果获取失败（比如文件不存在），可能需要处理，这里暂时保持空表单
      console.error("Failed to load post data for:", decodedSlug);
    }
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-mono selection:bg-endfield-accent selection:text-black">
      <Navbar />
      
      {/* 顶部状态栏 */}
      <div className="fixed top-16 left-0 w-full bg-[#09090b]/90 backdrop-blur border-b border-white/10 z-30 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
           <Link href="/admin" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
             &lt; EXIT_TERMINAL
           </Link>
           <div className="h-4 w-[1px] bg-white/20" />
           <span className="text-endfield-accent text-sm font-bold">
             {isNew ? "CREATE_MODE" : "EDIT_MODE"}
           </span>
           <span className="text-xs text-gray-600 hidden md:block">
             {/* 显示解码后的文件名 */}
             TARGET: {isNew ? "NEW_FILE" : `${initialData.slug}.md`}
           </span>
        </div>
        
        <div className="text-[10px] text-green-500 animate-pulse">
           CONNECTION: STABLE
        </div>
      </div>

      <div className="pt-32 pb-20 px-6 max-w-[1600px] mx-auto">
        <form action={saveAction} className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          <input type="hidden" name="sha" value={initialData.sha || ""} />
          <input type="hidden" name="originalSlug" value={initialData.slug} />

          {/* === 左栏：参数面板 === */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 relative">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-endfield-accent" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-endfield-accent" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-endfield-accent" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-endfield-accent" />

              <h3 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="w-1 h-1 bg-endfield-accent" />
                META_DATA
              </h3>

              <div className="space-y-5">
                <div className="group">
                  <label className="block text-[10px] text-endfield-accent mb-1 group-focus-within:text-white transition-colors">FILE_SLUG (ID)</label>
                  <input 
                    name="slug" 
                    // 确保这里的 defaultValue 是从 GitHub 获取到的真实数据
                    defaultValue={initialData.slug} 
                    required
                    className="w-full bg-black border-b border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white transition-colors placeholder-gray-700"
                    placeholder="example-post-name"
                  />
                </div>

                <div className="group">
                  <label className="block text-[10px] text-gray-500 mb-1 group-focus-within:text-endfield-accent transition-colors">TITLE</label>
                  <input 
                    name="title" 
                    defaultValue={initialData.frontMatter.title} 
                    className="w-full bg-black border-b border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-[10px] text-gray-500 mb-1 group-focus-within:text-endfield-accent transition-colors">DATE</label>
                    <input 
                      name="date" 
                      defaultValue={initialData.frontMatter.date} 
                      className="w-full bg-black border-b border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white transition-colors"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] text-gray-500 mb-1 group-focus-within:text-endfield-accent transition-colors">CATEGORY</label>
                    <select 
                      name="category" 
                      defaultValue={initialData.frontMatter.category}
                      className="w-full bg-black border-b border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white transition-colors appearance-none"
                    >
                      <option value="REPORT">REPORT</option>
                      <option value="TECH">TECH</option>
                      <option value="SYSTEM">SYSTEM</option>
                      <option value="WARNING">WARNING</option>
                    </select>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] text-gray-500 mb-1 group-focus-within:text-endfield-accent transition-colors">IMAGE_URL</label>
                  <input 
                    name="image" 
                    defaultValue={initialData.frontMatter.image} 
                    className="w-full bg-black border-b border-white/20 p-2 text-xs focus:border-endfield-accent outline-none text-gray-300 transition-colors"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
                 <button type="submit" className="w-full bg-endfield-accent text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest text-sm relative overflow-hidden group/btn">
                    <span className="relative z-10">CONFIRM_UPLOAD</span>
                    <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300 z-0" />
                 </button>
                 
                 <Link href="/admin" className="w-full text-center py-2 text-xs text-gray-500 hover:text-white transition-colors border border-transparent hover:border-white/20">
                   [ABORT_OPERATION]
                 </Link>
              </div>
            </div>
            
            <div className="text-[10px] text-gray-700 font-mono space-y-1 select-none">
               <p>MEM: 4096MB OK</p>
               <p>DISK: WRITE_PROTECT_OFF</p>
               <p>NET: GITHUB_API_V3</p>
            </div>
          </div>

          {/* === 右栏：内容编辑 === */}
          <div className="lg:col-span-8 flex flex-col h-full">
             <div className="flex-1 relative group">
                <div className="absolute top-0 left-0 w-full h-8 bg-white/5 border-t border-x border-white/10 flex items-center px-4 gap-4">
                   <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                      <div className="w-2 h-2 rounded-full bg-green-500/50" />
                   </div>
                   <span className="text-[10px] text-gray-500">CONTENT_BODY.md</span>
                </div>
                
                <textarea 
                  name="content" 
                  defaultValue={initialData.content}
                  className="w-full h-[80vh] bg-[#0c0c0e] border border-white/10 p-6 pt-12 text-sm font-mono leading-relaxed text-gray-300 focus:text-white focus:border-endfield-accent outline-none resize-none scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent selection:bg-endfield-accent selection:text-black"
                  placeholder="// Begin entering log data here..."
                />
             </div>
          </div>

        </form>
      </div>
    </main>
  );
}