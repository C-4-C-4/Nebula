import { cache } from "react";

// 定义番剧数据接口
export interface BangumiItem {
  media_id: number;
  season_id: number;
  title: string;
  cover: string;
  evaluate: string; // 简介
  is_finish: number; // 1=完结, 0=连载
  new_ep: {
    index_show: string; // "全12话" 或 "更新至..."
  };
  link: string; // 跳转链接
}

// 获取追番列表 (带缓存)
export const fetchBangumiList = cache(async (uid: string) => {
  if (!uid) return [];

  try {
    // Bilibili 公开 API: 获取用户的追番列表
    // ps=30 表示获取前30个，pn=1 表示第一页
    const apiUrl = `https://api.bilibili.com/x/space/bangumi/follow/list?type=1&follow_status=0&pn=1&ps=30&vmid=${uid}`;
    
    const res = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // 1小时缓存
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!res.ok) throw new Error("Failed to fetch bilibili data");

    const json = await res.json();
    
    if (json.code !== 0 || !json.data || !json.data.list) {
      console.error("Bilibili API Error:", json.message);
      return [];
    }

    return json.data.list.map((item: any) => ({
      media_id: item.media_id,
      season_id: item.season_id,
      title: item.title,
      cover: item.cover,
      evaluate: item.evaluate || "暂无简介",
      is_finish: item.is_finish,
      new_ep: {
        index_show: item.new_ep?.index_show || "未知进度"
      },
      link: `https://www.bilibili.com/bangumi/play/ss${item.season_id}`
    })) as BangumiItem[];

  } catch (error) {
    console.error("Fetch Bangumi Error:", error);
    return [];
  }
});