# X Recommendation Algorithm Simulator / X 推荐算法模拟器

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## 🚀 X Recommendation Algorithm Simulator

A highly interactive, visual simulator for the X (formerly Twitter) recommendation algorithm. Based on the open-sourced "Heavy Ranker" algorithm and updated with recent platform changes, this tool helps creators, marketers, and developers understand the mechanics of how a tweet goes viral.

### ✨ Key Features

*   **Interactive Parameter Tuning:** Adjust base followers, initial view rates, and engagement conversion rates (Likes, Replies, Retweets, Bookmarks) in real-time.
*   **Content Traits Simulation:** Toggle X Premium (Blue Verified) status, mark content as Toxic/NSFW, and select media types (Text, Image, Video, Link) to see their direct impact on traffic multipliers.
*   **Algorithm Weights:** Tweak the core algorithm weights (e.g., how much a bookmark is worth compared to a like) to simulate different algorithm eras.
*   **Real-time Visualization:** Beautiful, animated charts built with Recharts showing View Propagation, Follower Growth, and Engagement Breakdown over multiple algorithmic cycles.
*   **Dual Simulation Modes:** 
    *   *Slow Play:* Watch the tweet propagate cycle by cycle.
    *   *One-Click Simulation:* Instantly calculate and animate the final results.

### 🛠️ Tech Stack

*   **Frontend Framework:** React 18 + TypeScript + Vite
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **Charts:** Recharts
*   **Icons:** Lucide React

### 📦 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

<a name="chinese"></a>
## 🚀 X 推荐算法模拟器

这是一个高度交互的 X (原 Twitter) 推荐算法可视化模拟器。本项目基于 X 开源的 "Heavy Ranker" 算法并结合了最新的平台规则变化，旨在帮助创作者、营销人员和开发者直观地理解推文是如何在平台上实现病毒式传播的。

### ✨ 核心功能

*   **交互式参数调节：** 实时调整初始粉丝数、初始触达率以及各项互动转化率（点赞、评论、转发、收藏）。
*   **内容特征模拟：** 支持切换 X Premium (蓝V认证) 状态、标记敏感/引战内容，并选择不同的媒体类型（纯文本、图文、视频、外链），直观查看它们对流量乘数的影响。
*   **算法权重自定义：** 自由调整核心算法权重（例如：一个收藏相当于多少个点赞），以模拟不同时期的算法规则。
*   **实时数据可视化：** 使用 Recharts 构建的精美动画图表，全方位展示多轮次下的流量传播趋势、粉丝增长曲线以及互动量分解。
*   **双重推演模式：**
    *   *慢速推演：* 逐轮次观察推文的传播过程。
    *   *一键酷炫推演：* 瞬间计算并以酷炫的动画展示最终推演结果。

### 🛠️ 技术栈

*   **前端框架：** React 18 + TypeScript + Vite
*   **样式：** Tailwind CSS
*   **动画：** Framer Motion
*   **图表：** Recharts
*   **图标：** Lucide React

### 📦 快速开始

1. 克隆项目到本地
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动开发服务器：
   ```bash
   npm run dev
   ```
