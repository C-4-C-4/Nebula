# 🌌 Project Nebula | Endfield Style Blog System

![Endfield Style](https://img.shields.io/badge/Style-Arknights%3A%20Endfield-FCEE21?style=for-the-badge&labelColor=000)
![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

> **"协议已启动。正在建立安全连接..."**
>
> 一个致敬《明日方舟：终末地》工业机能美学的现代化博客系统。无需数据库，基于 Git 的全栈内容管理。

---

## 🏗️ 1. 项目介绍 (Introduction)

**Nebula** 是一个高度定制化的个人博客系统，旨在还原极致的“终末地”UI 风格。它不仅仅是一个静态页面，更是一个拥有完整后台管理、3D 可视化交互、终端模拟系统的全栈应用。

### 👥 作者与维护
*   **Author**: [C-4-C-4](https://github.com/C-4-C-4)
*   **Repository**: [Nebula](https://github.com/C-4-C-4/Nebula)
*   **Role**: Operator / Administrator

### 🛠️ 技术栈 (Tech Stack)
*   **核心框架**: [Next.js 14/15 (App Router)](https://nextjs.org/) - 混合渲染 (SSG + SSR)。
*   **样式库**: [Tailwind CSS](https://tailwindcss.com/) - 极速构建工业风布局。
*   **动画引擎**: [Framer Motion](https://www.framer.com/motion/) - 负责所有 UI 转场、进入动画、虫洞穿越效果。
*   **3D 引擎**: [React Three Fiber (Three.js)](https://docs.pmnd.rs/react-three-fiber/) - 构建星云（Nebula）与核心（Core）场景。
*   **数据层**: **Git-based CMS** - 使用 GitHub API 直接读写仓库中的 JSON 和 Markdown 文件，无需传统数据库。
*   **鉴权**: **Jose (JWT)** + Middleware - 基于 Edge Runtime 的安全验证。

---

## ✨ 2. 特色功能与实现原理 (Features)

### 🖥️ 沉浸式 UI (Immersive UI)
*   **工业机能风**: 大量使用细边框、直角、警示色（#FCEE21）、数据装饰、毛玻璃效果。
*   **全屏加载**: 实现了类似“系统冷启动”的 CRT 关机/开机动画，以及“虫洞穿越”的页面跳转特效。
*   **实现**: 通过 Framer Motion 的 `AnimatePresence` 和全局状态管理实现无缝转场。

### 🌌 3D 星云可视化 (Nebula Visualization)
*   **功能**: 将文章和友链具象化为宇宙中的“节点”，围绕核心旋转。支持鼠标拖拽查看。
*   **终端交互**: 在星云页面底部集成了一个**可拖拽的 CLI 终端**。支持 `/ls`, `/cd`, `/sudo` 等指令，甚至可以通过命令行跳转页面或登录后台。
*   **实现**: 使用 R3F 的 `Canvas` 渲染场景，节点分布采用斐波那契球算法。

### ⚡ Git-based CMS (无数据库后台)
*   **功能**: 拥有完整的后台管理界面 (/admin)。
    *   **文章管理**: 增删改查 Markdown 文章。
    *   **配置管理**: 在线修改网站标题、Logo、备案号等，实时生效。
    *   **友链管理**: 自动抓取对方网站 Icon (多级 fallback 机制：iowen -> uomg -> favicon.im)。
*   **实现**: 利用 `Octokit` 调用 GitHub API，将修改后的数据直接 Commit 到仓库，触发 Vercel 自动重新构建。

### 💬 评论与互动
*   **Giscus 集成**: 利用 GitHub Discussions 存储评论，无缝融入深色主题。

---

## 🚀 3. 部署指南 (Deployment)

本项目推荐使用 **Vercel** 进行部署，因为它对 Next.js 的文件系统 (fs) 支持最好。

### 第一步：Fork 仓库
点击右上角的 **Fork** 按钮，将本项目复制到你的 GitHub 账号下。

### 第二步：获取 GitHub Token
1.  进入 GitHub Settings -> Developer settings -> Personal access tokens -> **Tokens (classic)**。
2.  点击 **Generate new token (classic)**。
3.  **Scopes (权限)**: 必须勾选 **`repo`** (Full control of private repositories)。
4.  复制生成的 Token (以 `ghp_` 开头)。

### 第三步：配置环境变量 (Environment Variables)
在 Vercel 导入项目时，或者在项目根目录新建 `.env` 文件（本地开发），填入以下内容：

| 变量名 | 描述 | 示例 |
| :--- | :--- | :--- |
| `GITHUB_TOKEN` | **必填**，你的 GitHub Token | `ghp_xxxxxxxxxxxx` |
| `GITHUB_OWNER` | **必填**，你的 GitHub 用户名 | `C-4-C-4` |
| `GITHUB_REPO` | **必填**，你的仓库名称 | `Nebula` |
| `GITHUB_BRANCH`| 分支名称 | `main` |
| `ADMIN_PASSWORD` | 后台登录密码 | `YourStrongPassword` |
| `JWT_SECRET` | 加密密钥 (随便填一长串乱码) | `skjdhf8234nasdf...` |

### 第四步：部署 (Deploy)
*   **Vercel**: 连接你的 GitHub 仓库，填好环境变量，点击 Deploy。

---

## 📖 4. 后台操作手册 (Admin Manual)

### 🔐 登录系统
1.  访问 `你的域名/login` 或在星云页面终端输入 `/sudo 密码`。
2.  观看系统启动序列动画，进入仪表盘。

### 📝 文章管理 (Posts)
*   点击 **+ NEW_POST** 创建新文章。
*   支持 Markdown 实时预览（所见即所得）。
*   点击 **EDIT** 修改文章，点击 **DEL** 删除（物理删除仓库文件）。

### 🔗 友链管理 (Friends)
*   只需输入对方网址，系统会自动尝试抓取 **Logo** 和 **技术栈图标**。
*   如果抓取失败，会自动显示首字母占位图，或允许你手动输入图片 URL。

### ⚙️ 系统配置 (Config)
*   在 **Manage: CONFIG** 页面，你可以修改：
    *   浏览器标签页标题 & Favicon。
    *   首页大字的文案 (如 SYSTEM / OVERRIDE)。
    *   底部的备案号、版权信息。
    *   Giscus 评论配置 ID。
*   **保存后，网站会自动触发重新构建（约 30秒 - 1分钟生效）。**

---

## 📊 5. 项目统计 (Statistics)

### ⭐ Stargazers over time
[![Stargazers over time](https://starchart.cc/C-4-C-4/Nebula.svg?variant=adaptive)](https://starchart.cc/C-4-C-4/Nebula)

### 🕵️ 访客统计 (Visitor Count)
<div align="center">
  <img src="https://count.getloli.com/get/@nebula_blog?theme=rule34" alt="moe-counter" />
</div>

---

### ⚠️ 免责声明
本项目设计灵感来源于《明日方舟：终末地》，仅供学习交流使用。美术素材版权归鹰角网络 (Hypergryph) 所有。

---

**Endfield.SYS // CONNECTION_TERMINATED.**