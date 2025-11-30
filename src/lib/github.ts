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
// 1. 文章 (Markdown) 相关方法 (保持不变)
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
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: OWNER,
      repo: REPO,
      path: `${POSTS_PATH}/${slug}.md`,
      ref: BRANCH,
    });
    if ("content" in data) {
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      const { data: frontMatter, content: markdownBody } = matter(content);
      if (!frontMatter.image || frontMatter.image.trim() === "") {
        frontMatter.image = DEFAULT_COVER;
      }
      return { slug, sha: data.sha, frontMatter, content: markdownBody };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function saveGithubFile(slug: string, content: string, sha?: string) {
  const contentBase64 = Buffer.from(content).toString("base64");
  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: OWNER,
    repo: REPO,
    path: `${POSTS_PATH}/${slug}.md`,
    message: `chore(blog): ${sha ? "update" : "create"} ${slug}`,
    content: contentBase64,
    sha: sha,
    branch: BRANCH,
  });
}

export async function deleteGithubFile(slug: string, sha: string) {
  await octokit.request("DELETE /repos/{owner}/{repo}/contents/{path}", {
    owner: OWNER,
    repo: REPO,
    path: `${POSTS_PATH}/${slug}.md`,
    message: `chore(blog): delete ${slug}`,
    sha: sha,
    branch: BRANCH,
  });
}

// ==========================================
// 2. 新增：JSON 数据 (Data) 相关方法
// ==========================================

// 读取 JSON 文件 (如 src/data/about.json)
export async function fetchJsonData(filename: string) {
  try {
    const path = `src/data/${filename}`; // 约定数据都在 src/data 下
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
        data: JSON.parse(content), // 直接返回解析后的 JSON 对象
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching json ${filename}:`, error);
    return null;
  }
}

// 保存 JSON 文件
export async function saveJsonData(filename: string, jsonData: any, sha: string) {
  const path = `src/data/${filename}`;
  // 格式化 JSON 方便阅读
  const content = JSON.stringify(jsonData, null, 2);
  const contentBase64 = Buffer.from(content).toString("base64");

  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: OWNER,
    repo: REPO,
    path: path,
    message: `chore(data): update ${filename}`,
    content: contentBase64,
    sha: sha, // 更新必须传 SHA
    branch: BRANCH,
  });
}