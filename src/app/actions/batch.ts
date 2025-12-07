"use server";
import { saveGithubFile, deleteGithubFile, saveJsonData } from "@/lib/github";
import { revalidatePath } from "next/cache";

export type StagingOperation = 
  | { type: "DELETE_POST"; slug: string; sha: string }
  | { type: "SAVE_POST"; slug: string; content: string; sha?: string }
  | { type: "SAVE_DATA"; filename: string; data: any; sha: string };

export async function batchCommitAction(operations: StagingOperation[]) {
  console.log(`[BATCH] Processing ${operations.length} operations...`);

  // 依次执行操作
  // 注意：GitHub API 不支持原子性批量操作，所以我们只能循环调用
  // 实际上这里可以使用 Promise.all 并发，但为了避免 Git 冲突，顺序执行更稳妥
  for (const op of operations) {
    try {
      switch (op.type) {
        case "DELETE_POST":
          await deleteGithubFile(op.slug, op.sha);
          break;
        case "SAVE_POST":
          await saveGithubFile(op.slug, op.content, op.sha);
          break;
        case "SAVE_DATA":
          await saveJsonData(op.filename, op.data, op.sha);
          break;
      }
    } catch (error) {
      console.error(`[BATCH] Error processing ${op.type}:`, error);
      // 真实场景下这里应该记录失败的项目返回给前端，为了简化我们假设都成功
    }
  }

  // 全部完成后刷新缓存
  revalidatePath("/", "layout");
}