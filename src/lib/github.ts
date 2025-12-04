import { Octokit } from "octokit";
import matter from "gray-matter";

// 初始化 Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const POSTS_PATH = "posts"; 

const DEFAULT_COVER = "https://placehold.co/800x400/09090b/FCEE21/png?text=NO_SIGNAL_DETECTED";

// ==========================================
// 1. 文章 (Markdown) 相关方法
// ==========================================

export async function fetchGithubFiles() {
  try {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: OWNER,
      repo: REPO,
      path: POSTS_PATH,
      ref: BRANCH,
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
}

export async function fetchGithubFileContent(slug: string) {
  try {
    // === 关键修复：解码 URL 参数 ===
    // 比如 "中文标题" 在 URL 里是 "%E4%B8..."，必须转回中文才能在 GitHub 找到文件
    const decodedSlug = decodeURIComponent(slug);

    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: OWNER,
      repo: REPO,
      path: `${POSTS_PATH}/${decodedSlug}.md`, // 使用解码后的文件名
      ref: BRANCH,
    });

    if ("content" in data) {
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      const { data: frontMatter, content: markdownBody } = matter(content);
      
      // 默认封面图兜底
      if (!frontMatter.image || frontMatter.image.trim() === "") {
        frontMatter.image = DEFAULT_COVER;
      }

      return { 
        slug: decodedSlug, // 返回解码后的 slug
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
}

export async function saveGithubFile(slug: string, content: string, sha?: string) {
  // 保存时也要确保解码，防止文件名变成乱码
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

export async function fetchJsonData(filename: string) {
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
    // 首次部署可能没有文件，不报错，返回 null 让前端用默认值
    // console.error(`Error fetching json ${filename}:`, error);
    return null;
  }
}

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