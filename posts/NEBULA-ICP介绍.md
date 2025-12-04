---
title: "NEBULA.ICP介绍"
date: "2025-12-04"
category: "REPORT"
image: "https://img.scdn.io/i/693204c56ba60_1764885701.webp"
---

# PROJECT NEBULA // ICP FILING SYSTEM

<div align="center">

![Project Status](https://img.shields.io/badge/STATUS-OPERATIONAL-success?style=for-the-badge)
![License](https://img.shields.io/badge/LICENSE-MIT-orange?style=for-the-badge)
![Version](https://img.shields.io/badge/VERSION-4.6-blue?style=for-the-badge)

**[ 🌌 星云协议 · 去中心化数字实体档案库 ]**

</div>

---

## /// SYSTEM.INTRO (项目简介)

**PROJECT NEBULA** 是一个极简主义、高可视化的模拟 ICP 备案系统。它不仅仅是一个表单，更是一个具有 **赛博朋克/黑客终端** 美学的数字档案馆。

本项目旨在构建一个“数字生命”的登记处。每一个被收录的网站都像是一个被观察的实体，拥有独立的编号、快照和身份标识。系统摒弃了传统后台的繁琐，采用“三要素验证”机制（域名+备案号+私钥）实现无账户的修改与注销。

### ✨ Core Features (核心功能)

*   **终端美学**：全站采用 Neo-Brutalism（新野兽派）与 ASCII/Terminal 风格设计。
*   **自动化收录**：自动抓取网站 Logo (Favicon.im) 和生成网站快照 (WordPress mShots)。
*   **智能交互**：
    *   **选号大厅**：支持搜索和筛选 2025 系列靓号。
    *   **无感验证**：通过私钥 (Auth Code) 进行修改和注销，无需注册账户。
    *   **沉浸体验**：申请过程包含终端模拟动画，拒绝生硬的表单提交。
*   **硬核后台**：
    *   内置 `ROOT_CONSOLE` 管理面板。
    *   支持批量删除、隐藏、审核（通过/驳回）。
    *   黑名单系统，防止恶意域名重复提交。
*   **边缘计算**：完全基于 Cloudflare 生态构建，全球边缘节点秒级响应。

---

## /// TECH_STACK (技术栈)

本项目基于 **Serverless** 架构构建，轻量、免费且高性能。

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | ![Astro](https://img.shields.io/badge/ASTRO-BC52EE?style=flat-square&logo=astro&logoColor=white) | SSR 模式，极致的渲染性能 |
| **UI Component** | ![React](https://img.shields.io/badge/REACT-61DAFB?style=flat-square&logo=react&logoColor=black) | 处理复杂的交互逻辑 (后台、选号) |
| **Styling** | ![Tailwind](https://img.shields.io/badge/TAILWIND-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white) | 快速构建响应式、原子化样式 |
| **Database** | ![Cloudflare D1](https://img.shields.io/badge/CLOUDFLARE_D1-F38020?style=flat-square&logo=cloudflare&logoColor=white) | 边缘 SQL 数据库 (SQLite) |
| **Hosting** | ![Cloudflare Pages](https://img.shields.io/badge/CF_PAGES-F38020?style=flat-square&logo=cloudflare&logoColor=white) | 全球 CDN 托管与构建 |
| **Runtime** | **Cloudflare Workers** | 后端 API 逻辑处理 |

---

/// PROJECT_STATISTICS (项目统计)

🌟 Stargazers over time
<!-- Star 趋势图 -->
![alt text](https://starchart.cc/C-4-C-4/NEBULA-ICP.svg)
<br/>

/// AUTHOR & CREDITS (作者与致谢)<br/>
Architect: CCCC4444<br/>
Design Inspiration: Echo Log<br/>
Snapshot Service: WordPress mShots<br/>
Favicon Service: Favicon.im / Iowen API<br/>


"We are not filing domains; we are giving digital entities an identity."<br/>
—— PROJECT NEBULA