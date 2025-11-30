import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

// === 1. 定义默认封面图 (Endfield 风格) ===
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
    
    // === 2. 获取原始 image ===
    const rawImage = (matterResult.data as any).image;

    return {
      id,
      ...(matterResult.data as { date: string; title: string; category: string }),
      // === 3. 判断：如果有值且不为空字符串，就用原图，否则用默认图 ===
      image: (rawImage && rawImage.trim() !== "") ? rawImage : DEFAULT_COVER,
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1;
    else return -1;
  });
}

export function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  
  // === 2. 获取原始 image ===
  const rawImage = (matterResult.data as any).image;

  return {
    id,
    content: matterResult.content,
    ...(matterResult.data as { date: string; title: string; category: string }),
    // === 3. 同样的判断逻辑 ===
    image: (rawImage && rawImage.trim() !== "") ? rawImage : DEFAULT_COVER,
  };
}