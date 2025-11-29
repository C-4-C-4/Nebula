import { Octokit } from "octokit";
import matter from "gray-matter";

// 初始化 Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const BRANCH = process.env.GITHUB_BRANCH || "master";
const POSTS_PATH = "posts"; // 你的文章存放目录

// 1. 获取所有文件列表 (用于后台列表)
export async function fetchGithubFiles() {
  try {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: OWNER,
      repo: REPO,
      path: POSTS_PATH,
      ref: BRANCH,
    });

    if (!Array.isArray(data)) return [];
    
    // 过滤出 .md 文件
    return data
      .filter((file) => file.name.endsWith(".md"))
      .map((file) => ({
        name: file.name,
        slug: file.name.replace(".md", ""),
        sha: file.sha, // 更新文件时需要用到 SHA
      }));
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
}

// 2. 获取单文件内容 (用于编辑)
export async function fetchGithubFileContent(slug: string) {
  try {
    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: OWNER,
      repo: REPO,
      path: `${POSTS_PATH}/${slug}.md`,
      ref: BRANCH,
    });

    // GitHub 返回的内容是 Base64 编码的
    if ("content" in data) {
      const content = Buffer.from(data.content, "base64").toString("utf-8");
      const { data: frontMatter, content: markdownBody } = matter(content);
      return {
        slug,
        sha: data.sha,
        frontMatter,
        content: markdownBody,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

// 3. 保存文件 (新增或更新)
export async function saveGithubFile(slug: string, content: string, sha?: string) {
  // 把内容转回 Base64
  const contentBase64 = Buffer.from(content).toString("base64");

  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: OWNER,
    repo: REPO,
    path: `${POSTS_PATH}/${slug}.md`,
    message: `chore(blog): ${sha ? "update" : "create"} ${slug}`,
    content: contentBase64,
    sha: sha, // 如果是更新，必须传 SHA；如果是新增，不传
    branch: BRANCH,
  });
}

// 4. 删除文件
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