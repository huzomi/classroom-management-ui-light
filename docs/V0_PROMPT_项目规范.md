# v0 生成代码 - 项目规范（粘贴到 v0 对话开头）

在 v0 里开发新页面/组件时，把下面整段复制到**第一条消息**或「生成前」的说明里，让生成的代码符合本项目结构。

---

## 复制以下内容到 v0 ▼

```
【项目技术栈与规范，生成代码必须遵守】

- 框架：Next.js 16 App Router、React 19、TypeScript。
- 本系统已有根布局：左侧 PlatformSidebar + 顶部 PlatformHeader + 中间 main。只生成「页面内容」，不要生成 <html>/<body>/侧边栏/顶栏，也不要包一层全屏布局；内容会渲染在已有的 <main> 里。
- 路径别名：所有引用用 @/ 开头。例如：import { Button } from "@/components/ui/button"，import { cn } from "@/lib/utils"。
- UI 组件：只使用项目已有的 @/components/ui 下的组件（如 Button、Card、Dialog、Input、Select、Table、Tabs、DropdownMenu、Avatar、Badge、Form、Label、Checkbox、Switch、Sheet、Popover、Tooltip、ScrollArea、Skeleton 等），不要新建一套 Button/Card 等基础组件；没有的再写新组件。
- 样式：Tailwind CSS，且必须用项目设计令牌。背景用 bg-background、bg-card，文字用 text-foreground、text-muted-foreground，边框用 border-border，主色用 bg-primary、text-primary-foreground，次要用 bg-secondary、bg-accent。禁止使用 bg-white、text-gray-500 等硬编码颜色。
- 合并 className 时使用：import { cn } from "@/lib/utils"，然后用 cn("...", className) 等形式。
- 图标：只使用 lucide-react，例如 import { ChevronDown, Search } from "lucide-react"。
- 表单校验：若需要，用 react-hook-form + @hookform/resolvers + zod，表单组件用 @/components/ui/form 的 FormField/FormItem/FormControl/FormMessage 等。
- 文件命名：kebab-case，如 my-feature-page.tsx、user-detail-modal.tsx。
- 页面文件放在 app/ 下对应路由目录的 page.tsx；可复用组件放在 components/ 下（通用放 components/ui，业务相关放 components/模块名）。
- 仅在需要 useState、useEffect、事件处理等时在文件顶部加 "use client"；纯展示或服务端组件不要加。
- 界面文案使用中文。
```

---

## 可选：按页面类型追加说明

- **列表/表格页**：说明「本页是列表页，需要筛选区、表格、分页，使用 @/components/ui 的 Table、Input、Button、Select」。
- **表单/弹窗**：说明「使用 Dialog 或 Sheet + Form 组件，校验用 zod」。
- **仪表盘/统计**：说明「使用 Card、可选用 recharts，数据先 mock」。
- **新菜单项**：说明「这个页面对应路由是 /xxx/yyy，请只生成 page 内容；我会自己在 platform-sidebar 里加菜单」。

把上面「复制以下内容到 v0」里的框内内容 + 可选说明一起发给 v0 即可。

---

## 简短版提示词（适合每次对话开头一句带过）

如果不想每次贴一大段，可以只发这一句，再写你的具体需求：

```
按这个规范生成：Next.js 16 App Router + React 19 + TypeScript；只用 @/components/ui 已有组件和 @/lib/utils 的 cn；样式用设计令牌（bg-background、text-muted-foreground、border-border 等）；图标用 lucide-react；只生成页面内容别生成 layout/侧边栏；路径用 @/；文件 kebab-case；中文文案；需要交互时加 "use client"。
```

---

## 其他方法

- **v0 的「Project」或上下文**：若 v0 支持上传/关联项目或粘贴项目说明，可以把本文件或 `docs/V0_PROMPT_项目规范.md` 的内容贴进去，作为固定上下文。
- **生成后自查**：生成完检查：是否用了 `@/components/ui`、是否用了 `cn()`、是否用了 `bg-background` 等令牌、是否多了多余的 layout/侧栏。不符合的用本项目里的组件和类名替换掉即可。
