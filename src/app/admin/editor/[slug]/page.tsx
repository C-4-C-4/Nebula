import { fetchGithubFileContent } from "@/lib/github";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AdminPostForm from "@/components/AdminPostForm"; // 引入新组件

// 兼容 Cloudflare Pages
export const runtime = 'edge';

export default async function EditorPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const isNew = decodedSlug === "new";
  
  let initialData = {
    slug: "",
    sha: "",
    frontMatter: { title: "", date: new Date().toISOString().split('T')[0], category: "REPORT", image: "" } as any,
    content: ""
  };

  if (!isNew) {
    const data = await fetchGithubFileContent(decodedSlug);
    if (data) {
      initialData = data;
    } else {
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
             TARGET: {isNew ? "NEW_FILE" : `${initialData.slug}.md`}
           </span>
        </div>
        
        <div className="text-[10px] text-green-500 animate-pulse">
           CONNECTION: STABLE
        </div>
      </div>

      <div className="pt-32 pb-20 px-6 max-w-[1600px] mx-auto">
        {/* 使用客户端表单组件，传入数据 */}
        <AdminPostForm initialData={initialData} isNew={isNew} />
      </div>
    </main>
  );
}