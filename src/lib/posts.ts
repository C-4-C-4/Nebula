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

    return {
      id,
      ...(matterResult.data as { date: string; title: string; category: string }),
      image: (rawImage && rawImage.trim() !== "") ? rawImage : DEFAULT_COVER,
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1;
    else return -1;
  });
}

export function getPostData(id: string) {
  // === 关键修复 ===
  // Vercel 构建时传入的 id 可能是 URL 编码过的 (例如 %E4%BB%8B%E7%BB%8D)
  // 必须解码才能找到磁盘上的中文文件名
  const decodedId = decodeURIComponent(id);
  
  const fullPath = path.join(postsDirectory, `${decodedId}.md`);
  
  // 增加容错：如果文件找不到，抛出明确错误或返回空（防止构建直接崩溃）
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath} (Original ID: ${id})`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  
  const rawImage = (matterResult.data as any).image;

  return {
    id: decodedId, // 返回解码后的 ID
    content: matterResult.content,
    ...(matterResult.data as { date: string; title: string; category: string }),
    image: (rawImage && rawImage.trim() !== "") ? rawImage : DEFAULT_COVER,
  };
}