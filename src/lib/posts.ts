import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

// 定义默认封面图
const DEFAULT_COVER = "https://placehold.co/800x400/09090b/FCEE21/png?text=NO_SIGNAL_DETECTED"; 

export function getSortedPostsData() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory);
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    const rawImage = (matterResult.data as any).image;
    // 确保有日期，没有则兜底到1970，防止报错
    const date = (matterResult.data as any).date || "1970-01-01";

    return {
      id,
      ...(matterResult.data as { title: string; category: string }),
      date: date,
      image: (rawImage && rawImage.trim() !== "") ? rawImage : DEFAULT_COVER,
    };
  });

  // === 修改点：使用 Date 对象的时间戳进行比较 ===
  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    // 降序排列 (B - A)：时间戳大的（新的）在前面
    return dateB - dateA;
  });
}

export function getPostData(id: string) {
  // 解码 URL 参数
  const decodedId = decodeURIComponent(id);
  
  const fullPath = path.join(postsDirectory, `${decodedId}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath} (Original ID: ${id})`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  
  const rawImage = (matterResult.data as any).image;
  const date = (matterResult.data as any).date || "1970-01-01";

  return {
    id: decodedId, 
    content: matterResult.content,
    ...(matterResult.data as { title: string; category: string }),
    date: date,
    image: (rawImage && rawImage.trim() !== "") ? rawImage : DEFAULT_COVER,
  };
}