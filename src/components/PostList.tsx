"use client"; // 标记为客户端组件
import Link from "next/link";

// 定义 Props 类型
interface Post {
  id: string;
  title: string;
  date: string;
  category: string;
  image: string;
}

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Link href={`/blog/${post.id}`} key={post.id} className="block h-full">
          <article className="group relative bg-endfield-surface border border-white/10 hover:border-endfield-accent transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer">
            
            <div className="data-scan-overlay" /> 

            <div className="relative h-48 w-full overflow-hidden border-b border-white/5">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-300 z-10" />
              
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
              />
              
              <div className="absolute top-2 right-2 z-20 bg-black/80 text-endfield-accent text-[10px] font-mono px-2 py-1 border border-endfield-accent/30">
                {post.category}
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow relative z-10">
              <div className="text-endfield-dim text-xs font-mono mb-2 flex justify-between">
                <span>NO.{post.id.substring(0, 4).toUpperCase()}</span>
                <span>{post.date}</span>
              </div>

              <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-endfield-accent transition-colors">
                {post.title}
              </h3>
              
              <div className="mt-auto pt-4 flex justify-between items-center">
                <span className="text-[10px] font-mono text-gray-500 group-hover:text-white transition-colors">
                  READ_ENTRY -&gt;
                </span>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-1 h-1 bg-endfield-accent" />
                   <div className="w-1 h-1 bg-endfield-accent" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[10px] border-r-[10px] border-b-white/20 border-r-transparent group-hover:border-b-endfield-accent transition-colors" />
          </article>
        </Link>
      ))}
    </div>
  );
}