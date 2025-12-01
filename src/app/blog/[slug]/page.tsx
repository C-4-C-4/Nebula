import { getPostData, getSortedPostsData } from "@/lib/posts";
import { fetchJsonData } from "@/lib/github"; 
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";
import Link from "next/link";
import Comments from "@/components/Comments"; 

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.id,
  }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = getPostData(slug);
  
  // 读取评论配置
  const file = await fetchJsonData("config.json");
  const giscusConfig = file?.data?.giscusConfig || {};

  return (
    <main className="min-h-screen relative bg-endfield-base text-gray-300 selection:bg-endfield-accent selection:text-black font-sans">
      <MatrixBackground />
      {/* 这里的 Navbar 不需要手动引入，因为 RootLayout 已经加了。但如果你之前在 Layout 没加，这里需要加。 */}
      {/* 按照之前的指令，RootLayout 已经有了，所以这里不需要写 <Navbar /> */}
      
      {/* 顶部进度条装饰 */}
      <div className="fixed top-16 left-0 w-full h-[1px] bg-white/10 z-40">
        <div className="h-full w-1/3 bg-endfield-accent shadow-[0_0_10px_#FCEE21]" />
      </div>

      <article className="max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <header className="mb-12 border-b border-white/10 pb-8">
           <div className="flex gap-4 mb-4 text-xs font-mono text-endfield-accent">
             <Link href="/" className="hover:underline">&lt; BACK_TO_ROOT</Link>
             <span>// {post.category}</span>
             <span>// {post.date}</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6">
             {post.title}
           </h1>
           <div className="relative h-64 md:h-96 w-full overflow-hidden border border-white/10">
             <img src={post.image} alt="Cover" className="w-full h-full object-cover grayscale opacity-80" />
             <div className="absolute inset-0 bg-gradient-to-t from-endfield-base to-transparent" />
           </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none 
          prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight
          prose-h2:text-white prose-h2:border-l-4 prose-h2:border-endfield-accent prose-h2:pl-4
          prose-a:text-endfield-accent prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-endfield-dim prose-blockquote:text-gray-400 prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:not-italic
          prose-strong:text-white
          font-light tracking-wide
        ">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-20 pt-8 border-t border-dashed border-white/20 text-right font-mono text-xs text-endfield-dim">
           LOG_END_OF_FILE <br/>
           OPERATOR_SIGNATURE_VERIFIED
        </div>

        {/* 评论区 */}
        <Comments config={giscusConfig} />

      </article>
    </main>
  );
}