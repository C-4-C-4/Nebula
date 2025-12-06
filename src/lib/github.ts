import { Octokit } from "octokit";
import matter from "gray-matter";
import { cache } from "react"; // 1. 引入 cache

// ... 初始化代码保持不变 ...
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const POSTS_PATH = "posts"; 
const DEFAULT_COVER = "https://placehold.co/800x400/09090b/FCEE21/png?text=NO_SIGNAL_DETECTED";

// ==========================================
// 1. 文章 (Markdown) 相关方法
// ==========================================

// 2. 使用 cache 包裹请求函数
export const fetchGithubFiles = cache(async () => {
  try {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: OWNER,
      repo: REPO,
      path: POSTS_PATH,
      ref: BRANCH,
      // 添加 fetch 选项，控制底层缓存
      headers: { 'If-None-Match': '' } 
    });
    if (!Array.isArray(data)) return [];
    return data
      .filter((file) => file.name.endsWith(".md"))
      .map((file) => ({
        name: file.name,
        slug: file.name.replace(".md", ""),
        sha: file.sha,
      }));
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
});

export const fetchGithubFileContent = cache(async (slug: string) => {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: OWNER,
      repo: REPO,
      path: `${POSTS_PATH}/${decodedSlug}.md`,
      ref: BRANCH,
    });

    if ("content" in data) {
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      const { data: frontMatter, content: markdownBody } = matter(content);
      
      if (!frontMatter.image || frontMatter.image.trim() === "") {
        frontMatter.image = DEFAULT_COVER;
      }

      return { 
        slug: decodedSlug, 
        sha: data.sha, 
        frontMatter, 
        content: markdownBody 
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching file content:", error);
    return null;
  }
});

// ... saveGithubFile 和 deleteGithubFile 保持不变 (它们是写操作，不需要缓存) ...
// 复制之前的 saveGithubFile 和 deleteGithubFile 代码 ...
export async function saveGithubFile(slug: string, content: string, sha?: string) {
  const decodedSlug = decodeURIComponent(slug);
  const contentBase64 = Buffer.from(content).toString("base64");
  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: OWNER,
    repo: REPO,
    path: `${POSTS_PATH}/${decodedSlug}.md`,
    message: `chore(blog): ${sha ? "update" : "create"} ${decodedSlug}`,
    content: contentBase64,
    sha: sha,
    branch: BRANCH,
  });
}

export async function deleteGithubFile(slug: string, sha: string) {
  const decodedSlug = decodeURIComponent(slug);
  await octokit.request("DELETE /repos/{owner}/{repo}/contents/{path}", {
    owner: OWNER,
    repo: REPO,
    path: `${POSTS_PATH}/${decodedSlug}.md`,
    message: `chore(blog): delete ${decodedSlug}`,
    sha: sha,
    branch: BRANCH,
  });
}


// ==========================================
// 2. JSON 数据 (Data) 相关方法
// ==========================================

// 3. 同样包裹 cache
export const fetchJsonData = cache(async (filename: string) => {
  try {
    const path = `src/data/${filename}`;
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: OWNER,
      repo: REPO,
      path: path,
      ref: BRANCH,
    });

    if ("content" in data) {
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return {
        sha: data.sha,
        data: JSON.parse(content),
      };
    }
    return null;
  } catch (error) {
    return null;
  }
});

// ... saveJsonData 保持不变 ...
export async function saveJsonData(filename: string, jsonData: any, sha: string) {
  const path = `src/data/${filename}`;
  const content = JSON.stringify(jsonData, null, 2);
  const contentBase64 = Buffer.from(content).toString("base64");

  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: OWNER,
    repo: REPO,
    path: path,
    message: `chore(data): update ${filename}`,
    content: contentBase64,
    sha: sha,
    branch: BRANCH,
  });
}