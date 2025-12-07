"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PostData {
  slug: string;
  sha?: string;
  frontMatter: {
    title: string;
    date: string;
    category: string;
    image: string;
  };
  content: string;
}

export default function AdminPostForm({ 
  initialData, 
  isNew 
}: { 
  initialData: PostData; 
  isNew: boolean;
}) {
  const router = useRouter();

  const handleStage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const slug = formData.get("slug") as string;
    const sha = formData.get("sha") as string;
    const title = formData.get("title");
    const date = formData.get("date");
    const category = formData.get("category");
    const image = formData.get("image");
    const content = formData.get("content");

    // 1. 手动拼接 Markdown 内容 (FrontMatter + Body)
    const fileContent = `---
title: "${title}"
date: "${date}"
category: "${category}"
image: "${image}"
---

${content}`;

    // 2. 构造暂存对象
    const newItem = {
      uiId: Math.random().toString(36).substr(2, 9),
      type: "SAVE_POST", // 对应 batch.ts 里的处理类型
      desc: `${isNew ? 'CREATE' : 'UPDATE'} POST: ${slug}.md`,
      slug: slug,
      content: fileContent,
      sha: sha || undefined
    };

    // 3. 双重保险：写入 LocalStorage (逻辑去重)
    try {
      const saved = localStorage.getItem("nebula_staging_buffer");
      const prevItems = saved ? JSON.parse(saved) : [];
      // 移除针对同一个文件的旧操作
      const filtered = prevItems.filter((item: any) => 
        !(item.type === 'SAVE_POST' && item.slug === slug)
      );
      const nextItems = [...filtered, newItem];
      localStorage.setItem("nebula_staging_buffer", JSON.stringify(nextItems));
    } catch (err) {
      console.error(err);
    }

    // 4. 触发事件通知 UI
    // @ts-ignore
    const event = new CustomEvent("add-to-staging", { detail: newItem });
    window.dispatchEvent(event);
    
    // 5. 跳转回后台首页
    router.push("/admin");
  };

  return (
    <form onSubmit={handleStage} className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
       <input type="hidden" name="sha" value={initialData.sha || ""} />
       <input type="hidden" name="originalSlug" value={initialData.slug} />

       {/* === 左栏：参数面板 === */}
       <div className="lg:col-span-4 space-y-6">
         <div className="bg-white/5 border border-white/10 p-6 relative">
           {/* 装饰角标 */}
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
              {/* === 修改点：按钮改为添加到暂存区 === */}
              <button type="submit" className="w-full bg-endfield-accent text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest text-sm relative overflow-hidden group/btn">
                 <span className="relative z-10">+ ADD TO BUFFER (SAVE)</span>
                 <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300 z-0" />
              </button>
              
              <Link 
                href="/admin" 
                className="w-full text-center py-2 text-xs text-gray-500 hover:text-white transition-colors border border-transparent hover:border-white/20 uppercase tracking-widest"
              >
                [ABORT_OPERATION]
              </Link>
           </div>
         </div>
         
         <div className="text-[10px] text-gray-700 font-mono space-y-1 select-none">
            <p>MEM: 4096MB OK</p>
            <p>DISK: WRITE_PROTECT_OFF</p>
            <p>NET: STAGING_MODE</p>
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
  );
}