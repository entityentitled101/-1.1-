# Lore Forge - 传说熔炉 (Avant-Garde Edition)

> Version: 0.3.6 (AI Protocol Integrated)
> 
> *“秩序是黑白的，只有混沌才拥有色彩。”*

## 1. 视觉宣言 (Visual Manifesto)
本作已从通用的工具应用进化为数字艺术装置。采用了 **Acid Brutalism (酸性粗野主义)** 设计语言。
*   **Zero Radius:** 拒绝圆角，一切皆为方块。
*   **Visible Grids:** 暴露结构，线框即是美学。
*   **Digital Decay:** 引入噪点与信号干扰效果，模拟末世记录仪的质感。
*   **Typographic Hierarchy:** 极端的字体大小对比，标题具备海报般的张力。

## 2. 核心功能 (Core Features)
*   **叙事拓扑 (Narrative Topology):** 
    *   **Core Node (核心):** 定义绝对主角（如：女主角）的不可变灵魂属性。
    *   **Timeline Instances (世界线):** 平行展示不同世界观下的配对角色（如：各世界的男主），支持多时间线管理。
*   **角色档案 (Entity Archives):** 也是“标本”陈列室。黑白滤镜处理，悬停时揭示本质。
*   **本地数据库 (Local Persistence):** 数据寄宿于浏览器本地存储，如同刻在石板上的记忆。

## 3. 技术栈 (Tech Stack)
*   React 18.2
*   Tailwind CSS (配置为极端黑白灰)
*   CSS Filters (Noise, Grayscale, Contrast)
*   Lucide React (Icons used as structural markers)

## 4. AI 生成式工作流协议 (Generative Workflow Protocol)

为了接入 AI 自动化构建流程，系统开放了标准化的数据输入接口。AI Agent 在读取用户提供的原文本（小说章节、大纲或设定草稿）后，需输出符合以下 Schema 的 JSON 数据以更新系统状态。

### 4.1 角色数据映射 (Entity Schema)
AI 需提取文本特征，映射至 `CharacterEditor` 的以下字段。

| 字段 (Key) | 类型 (Type) | 必须 | 描述/枚举约束 |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | 角色全名或代号 (e.g., "UNIT 734")。 |
| `role` | Enum | Yes | 叙事功能。可选值: `"Protagonist"`, `"Antagonist"`, `"Supporting"`, `"Background"`。 |
| `worldview` | Enum | Yes | 现实框架。可选值: `"Modern / Cyber_Realism"`, `"High Fantasy / D&D"`, `"Post Apocalyptic"`, `"Custom / Unspecified"`。**注意：修改此项会影响 Race/Class 的预设逻辑。** |
| `race` | String | Yes | 生物分类。若 `worldview` 为 Cyber，通常锁定为 "Human" 或 "Android"；Fantasy 可填 "Elf", "Orc" 等。 |
| `characterClass` | String | Yes | 职业/职能。e.g., "Netrunner", "Paladin", "Hacker", "Merchant"。 |
| `faction` | String | No | 阵营或效忠组织。e.g., "Arasaka Corp", "The Silver Hand"。 |
| `description` | String | Yes | **人物传记 (Detailed Biography)**。AI 需生成一段不少于 100 字的深层背景描述，包含动机与过去。 |
| `appearance` | String | Yes | **视觉参数 (Physical Parameters)**。描述外貌特征、衣着风格、义体改造或魔法印记。 |
| `tags` | Array<String> | No | 身份标签数组。e.g., `["Cybernetic", "Traitor", "Royal"]`。AI 应自动生成 3-5 个关键词。 |
| `relationships` | Array<Object> | No | 关系网络。对象结构: `{ targetId: string, type: string, intensity: number(0-100) }`。 |

### 4.2 地点数据映射 (Geospatial Schema)
AI 需构建世界观容器，映射至 `LocationEditor` 的以下字段。

| 字段 (Key) | 类型 (Type) | 必须 | 描述/枚举约束 |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | 区域名称。e.g., "Neo-Kowloon", "The Whispering Woods"。 |
| `type` | String | Yes | 区域类型。e.g., "Megacity", "Space Station", "Dungeon"。 |
| `worldview` | Enum | Yes | 同角色枚举。定义该地点的物理法则与美术风格。 |
| `coordinates` | String | No | 虚拟坐标。格式建议: "XX.XX, YY.YY" (e.g., "34.22, 119.01")。 |
| `population` | String | No | 人口估算。e.g., "12,000,000" 或 "Unknown/Sparse"。 |
| `history` | String | Yes | **历史档案 (Historical Archive)**。该地点的起源、重大事件或战争记录。 |
| `culture` | String | Yes | **社会分析 (Cultural Analysis)**。社会阶层、宗教信仰、帮派势力或风俗习惯。 |
| `description` | String | Yes | **通用描述 (General Notes)**。环境氛围描写，天气、光影与感官细节。 |

### 4.3 工作流触发逻辑 (Workflow Triggers)
AI Agent 应按照以下逻辑进行数据注入：
1.  **Context Injection:** AI 读取小说文本。
2.  **Entity Extraction:** 识别文本中的新角色或现有角色。
3.  **Sector Fabrication:** 识别文本中发生的地点。
4.  **Payload Generation:** 生成包含上述字段的 JSON。
5.  **State Update:** 前端接收 JSON 并调用 `useStore` 中的 `updateCharacter` 或 `updateLocation`。

## 5. 系统联动架构 (System Linkage Architecture)

本系统采用双向锚点机制，实现角色（Entity）与地点（Sector）之间的深度互联。以下是开发者与用户需知的交互逻辑协议：

### 5.1 实体纠缠 (Entity-to-Entity Linkage)
*   **逻辑定义:** 角色之间的关系存储于 `Character.relationships` 数组中。
*   **交互界面:** 位于角色详情页 (CharacterEditor) 的 "Relationship Heatmap" 板块。
*   **操作原语:**
    *   **Inject (+):** 点击虚线框的 "Add Connection" -> 激活下拉终端 -> 选择未关联角色 -> 系统推入新关系对象 `{ targetId, type, intensity }`。
    *   **Sever (-):** 悬停于现有关系卡片 -> 点击右上角 "-" 按钮 -> 系统从数组中过滤剔除该 ID。
    *   **Jump (↗):** 点击卡片上的外部链接图标 -> 路由跳转至目标角色的详情页。

### 5.2 地理空间映射 (Geospatial Mapping / Bi-Directional)
地点与角色的关联基于 **"Location-First"** 的数据源真理，即数据存储在 `Location.residents` 字段中，但在界面上表现为双向同步。

#### A. 在地点详情页 (Location View)
*   **功能:** 管理当前地点的“常驻人口”或“当前占用者”。
*   **交互:** "Occupancy Matrix" (占用矩阵)。
    *   **Log Entity (+):** 下拉菜单仅显示**不在**当前地点列表中的角色 -> 选择后将角色 ID 推入 `Location.residents`。
    *   **Eject (-):** 点击角色卡片上的 "-" 按钮 -> 将该角色 ID 从 `Location.residents` 中移除。
    *   **Trace (↗):** 点击跳转图标，追踪至该角色的档案页。

#### B. 在角色详情页 (Character View)
*   **功能:** 反向查找该角色的“地理足迹”，即“我在哪里”。
*   **逻辑:** 系统遍历所有 `Locations`，筛选出 `residents` 包含当前角色 ID 的地点。
*   **交互:** "Geospatial Footprint" (地理足迹)。
    *   **Log Sector (+):** 下拉菜单仅显示**当前角色未驻留**的地点 -> 选择后，系统实际上调用 `updateLocation`，修改**目标地点**的 `residents` 数据（将当前角色加入）。
    *   **Withdraw (-):** 从地点列表中移除当前角色 -> 系统调用 `updateLocation` 修改目标地点数据。
    *   **Warp (↗):** 点击跳转图标，瞬间传送至该地点的详情页。

### 5.3 导航拓扑 (Navigation Topology)
整个应用构建为一个封闭的环形导航网：
1.  **Dashboard (指挥塔):** 提供全局索引。点击 "Core Entity" 进入主角页，点击 "Instance" 进入配角页，点击 "Location Card" 进入地点页。
2.  **Cross-Linking (交叉连接):** 用户无需返回首页，即可通过详情页内部的矩阵（Matrix）在角色与地点之间无限跳转，形成沉浸式的浏览流（Flow）。

---
*“数据不再是孤岛，而是连绵的群岛。”*