"use client"; // 标记为客户端组件
import { useState } from "react";

export default function RssAvatar({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img 
      src={imgSrc} 
      className="w-10 h-10 object-cover bg-black border border-white/10" 
      alt={alt}
      // 在客户端组件里，onError 是合法的
      onError={() => setImgSrc("https://placehold.co/100x100/000/FFF?text=RSS")}
    />
  );
}