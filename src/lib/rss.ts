import Parser from "rss-parser";
import { fetchJsonData } from "@/lib/github";

const parser = new Parser();

export interface RssFeedItem {
  sourceId: string;
  sourceName: string;
  sourceAvatar: string;
  title: string;
  link: string;
  pubDate: string;
  snippet: string;
}

// 获取并聚合所有 RSS 的最新一篇文章
export async function fetchLatestRssPosts() {
  // 1. 读取订阅列表
  const file = await fetchJsonData("rss.json");
  const feeds = (file?.data || []) as any[];

  if (feeds.length === 0) return [];

  // 2. 并发请求所有 RSS 源
  const promises = feeds.map(async (feed) => {
    try {
      // 设置超时，防止某个源卡死整个页面
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

      const res = await parser.parseURL(feed.url);
      clearTimeout(timeoutId);

      // 取第一篇文章
      const latest = res.items[0];
      if (!latest) return null;

      return {
        sourceId: feed.id,
        sourceName: feed.name,
        sourceAvatar: feed.avatar || "https://placehold.co/100x100/000/FFF?text=RSS",
        title: latest.title || "Untitled Signal",
        link: latest.link || "#",
        // 格式化日期，如果解析失败则用当前时间
        pubDate: latest.pubDate ? new Date(latest.pubDate).toLocaleDateString() : "Unknown Date",
        // 截取摘要 (去除 HTML 标签)
        snippet: latest.contentSnippet?.slice(0, 100) + "..." || ""
      } as RssFeedItem;

    } catch (err) {
      console.error(`Failed to fetch RSS: ${feed.name}`, err);
      return null;
    }
  });

  const results = await Promise.all(promises);

  // 3. 过滤失败的请求，并按时间倒序排列 (可选，因为 RSS 日期格式各异，排序可能不准，这里暂不强求排序)
  return results.filter((item): item is RssFeedItem => item !== null);
}