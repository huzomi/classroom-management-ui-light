"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { addMenu, updateMenu, type MenuPermissionVO, type MenuPermissionEditDTO } from "@/lib/api/menu"
import { toast } from "@/hooks/use-toast"
import type { MenuItem } from "@/types/menu"

/** 组件类型 */
const COMPONENT_TYPES = {
  Default: "layouts/default/index",
  IFrame: "sys/iframe/FrameBlank",
} as const

function toMenuItem(vo: MenuPermissionVO): MenuItem {
  const typeMap: Record<string, "目录" | "菜单" | "按钮"> = {
    "0": "目录",
    "1": "菜单",
    "2": "按钮",
  }
  return {
    id: vo.id,
    name: vo.name ?? "",
    type: typeMap[vo.menuType ?? "0"] ?? "目录",
    icon: vo.icon,
    component: vo.component,
    componentName: vo.componentName,
    path: vo.url ?? vo.route ?? "",
    redirect: vo.redirect,
    frameSrc: vo.frameSrc,
    sort: vo.sortNo ?? 0,
    parentId: vo.parentId,
    permission: vo.perms,
    permsType: vo.permsType,
    status: vo.status,
    isRoute: vo.isRoute,
    keepAlive: vo.keepAlive,
    hidden: vo.hidden,
    hideTab: vo.hideTab,
    alwaysShow: vo.alwaysShow,
    internalOrExternal: vo.internalOrExternal,
    children: vo.children?.map(toMenuItem),
  }
}

/** 扁平化树为选项列表（用于上级菜单选择） */
function flattenForParent(
  items: MenuPermissionVO[],
  excludeId?: string,
  prefix = ""
): { id: string; label: string }[] {
  const result: { id: string; label: string }[] = []
  for (const item of items) {
    if (item.id === excludeId) continue
    const label = prefix ? `${prefix} / ${item.name}` : (item.name ?? "")
    result.push({ id: item.id, label })
    if (item.children?.length) {
      result.push(...flattenForParent(item.children, excludeId, label))
    }
  }
  return result
}

interface MenuDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record?: MenuItem | null
  isUpdate: boolean
  parentId?: string
  treeData: MenuPermissionVO[]
  onSuccess: () => void
}

export function MenuDrawer({
  open,
  onOpenChange,
  record,
  isUpdate,
  parentId,
  treeData,
  onSuccess,
}: MenuDrawerProps) {
  const [formData, setFormData] = useState<MenuPermissionEditDTO>({
    name: "",
    menuType: "0",
    sortNo: 1,
    status: "1",
    permsType: "1",
    component: COMPONENT_TYPES.Default,
    isRoute: 1,
    keepAlive: 0,
    hidden: 0,
    hideTab: 0,
    alwaysShow: 0,
    internalOrExternal: 0,
  })
  const [submitting, setSubmitting] = useState(false)

  const parentOptions = flattenForParent(treeData, record?.id)
  const isDir = formData.menuType === "0"
  const isMenu = formData.menuType === "1"
  const isButton = formData.menuType === "2"
  const isIFrame = (formData.component ?? "").includes("iframe") || formData.component === COMPONENT_TYPES.IFrame
  const showUrl = !isButton && !(isIFrame && formData.internalOrExternal)

  useEffect(() => {
    if (open) {
      if (isUpdate && record) {
        setFormData({
          id: record.id,
          parentId: record.parentId ?? undefined,
          name: record.name,
          menuType: record.type === "目录" ? "0" : record.type === "菜单" ? "1" : "2",
          perms: record.permission,
          permsType: record.permsType ?? "1",
          component: record.component ?? COMPONENT_TYPES.Default,
          componentName: record.componentName,
          url: record.path,
          redirect: record.redirect,
          frameSrc: record.frameSrc,
          sortNo: record.sort,
          icon: record.icon,
          status: record.status ?? "1",
          isRoute: record.isRoute ?? 1,
          keepAlive: record.keepAlive ?? 0,
          hidden: record.hidden ?? 0,
          hideTab: record.hideTab ?? 0,
          alwaysShow: record.alwaysShow ?? 0,
          internalOrExternal: record.internalOrExternal ?? 0,
        })
      } else {
        setFormData({
          name: "",
          menuType: "0",
          parentId: parentId ?? undefined,
          sortNo: 1,
          status: "1",
          permsType: "1",
          component: COMPONENT_TYPES.Default,
          componentName: "",
          url: "",
          redirect: "",
          frameSrc: "",
          icon: "",
          isRoute: 1,
          keepAlive: 0,
          hidden: 0,
          hideTab: 0,
          alwaysShow: 0,
          internalOrExternal: 0,
        })
      }
    }
  }, [open, isUpdate, record, parentId])

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({ title: "请输入菜单名称", variant: "destructive" })
      return
    }
    if (!isDir && !formData.parentId) {
      toast({ title: "请选择上级菜单", variant: "destructive" })
      return
    }
    if (!isButton && showUrl && !formData.url?.trim()) {
      toast({ title: "请输入访问路径", variant: "destructive" })
      return
    }
    if (!isButton && !formData.component?.trim()) {
      toast({ title: "请输入前端组件", variant: "destructive" })
      return
    }
    if (isIFrame && !isButton && !(formData.frameSrc ?? "").trim()) {
      toast({ title: "请输入Iframe地址", variant: "destructive" })
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        ...formData,
        parentId: formData.parentId || undefined,
      }
      if (isUpdate && formData.id) {
        await updateMenu(payload)
        toast({ title: "更新成功" })
      } else {
        delete (payload as Record<string, unknown>).id
        await addMenu(payload)
        toast({ title: "新增成功" })
      }
      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error("提交失败:", err)
      toast({ title: "提交失败", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isUpdate ? "编辑菜单" : "新增菜单"}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-2 space-y-4 py-4">
          {/* 菜单类型 */}
          <div className="grid gap-2">
            <Label>菜单类型</Label>
            <RadioGroup
              value={formData.menuType}
              onValueChange={(v) =>
                setFormData((d) => ({
                  ...d,
                  menuType: v,
                  component: v === "2" ? undefined : d.component || COMPONENT_TYPES.Default,
                  url: v === "2" ? undefined : d.url,
                }))
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="type-0" />
                <Label htmlFor="type-0" className="font-normal">一级菜单</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="type-1" />
                <Label htmlFor="type-1" className="font-normal">子菜单</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="type-2" />
                <Label htmlFor="type-2" className="font-normal">按钮/权限</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 菜单名称 */}
          <div className="grid gap-2">
            <Label htmlFor="menu-name">{isButton ? "按钮/权限" : "菜单"}名称 *</Label>
            <Input
              id="menu-name"
              value={formData.name}
              onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
              placeholder={isButton ? "请输入按钮/权限名称" : "请输入菜单名称"}
            />
          </div>

          {/* 上级菜单 - 仅子菜单和按钮 */}
          {!isDir && (
            <div className="grid gap-2">
              <Label>上级菜单 *</Label>
              <Select
                value={formData.parentId ?? "__root__"}
                onValueChange={(v) => setFormData((d) => ({ ...d, parentId: v === "__root__" ? undefined : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择上级菜单" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__root__">根目录</SelectItem>
                  {parentOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 访问路径 - 非按钮，且非 IFrame 外链时显示 */}
          {showUrl && (
            <div className="grid gap-2">
              <Label htmlFor="menu-url">访问路径 *</Label>
              <Input
                id="menu-url"
                value={formData.url ?? ""}
                onChange={(e) => setFormData((d) => ({ ...d, url: e.target.value }))}
                placeholder="如：/dashboard"
              />
            </div>
          )}

          {/* 前端组件 - 非按钮 */}
          {!isButton && (
            <div className="grid gap-2">
              <Label htmlFor="menu-component">前端组件 *</Label>
              <Input
                id="menu-component"
                value={formData.component ?? ""}
                onChange={(e) => setFormData((d) => ({ ...d, component: e.target.value }))}
                placeholder="如：layouts/default/index 或 sys/iframe/FrameBlank"
              />
            </div>
          )}

          {/* 组件名称 - 非按钮 */}
          {!isButton && (
            <div className="grid gap-2">
              <Label htmlFor="menu-component-name">组件名称</Label>
              <Input
                id="menu-component-name"
                value={formData.componentName ?? ""}
                onChange={(e) => setFormData((d) => ({ ...d, componentName: e.target.value }))}
                placeholder="与 vue 组件的 name 属性保持一致，用于路由缓存"
              />
              <p className="text-xs text-muted-foreground">
                组件名称不能重复，主要用于路由缓存。非必填，留空则根据访问路径自动生成。
              </p>
            </div>
          )}

          {/* Iframe 地址 - 非按钮且组件为 IFrame */}
          {!isButton && isIFrame && (
            <div className="grid gap-2">
              <Label htmlFor="menu-frame-src">Iframe 地址 *</Label>
              <Input
                id="menu-frame-src"
                type="url"
                value={formData.frameSrc ?? ""}
                onChange={(e) => setFormData((d) => ({ ...d, frameSrc: e.target.value }))}
                placeholder="如：https://example.com"
              />
            </div>
          )}

          {/* 默认跳转 - 仅一级菜单 */}
          {isDir && (
            <div className="grid gap-2">
              <Label htmlFor="menu-redirect">默认跳转地址</Label>
              <Input
                id="menu-redirect"
                value={formData.redirect ?? ""}
                onChange={(e) => setFormData((d) => ({ ...d, redirect: e.target.value }))}
                placeholder="如：/dashboard"
              />
            </div>
          )}

          {/* 授权标识 - 仅按钮 */}
          {isButton && (
            <div className="grid gap-2">
              <Label htmlFor="menu-perms">授权标识</Label>
              <Input
                id="menu-perms"
                value={formData.perms ?? ""}
                onChange={(e) => setFormData((d) => ({ ...d, perms: e.target.value }))}
                placeholder="如：system:user:list"
              />
            </div>
          )}

          {/* 授权策略 - 仅按钮 */}
          {isButton && (
            <div className="grid gap-2">
              <Label>授权策略</Label>
              <RadioGroup
                value={formData.permsType ?? "1"}
                onValueChange={(v) => setFormData((d) => ({ ...d, permsType: v }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="perms-1" />
                  <Label htmlFor="perms-1" className="font-normal">可见/可访问</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="perms-2" />
                  <Label htmlFor="perms-2" className="font-normal">可编辑</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                可见/可访问(授权后可见/可访问)，可编辑(未授权时禁用)
              </p>
            </div>
          )}

          {/* 状态 - 仅按钮 */}
          {isButton && (
            <div className="grid gap-2">
              <Label>状态</Label>
              <RadioGroup
                value={formData.status ?? "1"}
                onValueChange={(v) => setFormData((d) => ({ ...d, status: v }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="status-1" />
                  <Label htmlFor="status-1" className="font-normal">有效</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0" id="status-0" />
                  <Label htmlFor="status-0" className="font-normal">无效</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* 菜单图标 - 非按钮 */}
          {!isButton && (
            <div className="grid gap-2">
              <Label htmlFor="menu-icon">菜单图标</Label>
              <Input
                id="menu-icon"
                value={formData.icon ?? ""}
                onChange={(e) => setFormData((d) => ({ ...d, icon: e.target.value }))}
                placeholder="如：ant-design:home-outlined"
              />
            </div>
          )}

          {/* 排序 - 非按钮 */}
          {!isButton && (
            <div className="grid gap-2">
              <Label htmlFor="menu-sort">排序</Label>
              <Input
                id="menu-sort"
                type="number"
                min={0}
                value={formData.sortNo ?? 1}
                onChange={(e) => setFormData((d) => ({ ...d, sortNo: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
          )}

          {/* 开关组 - 非按钮 */}
          {!isButton && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>是否路由菜单</Label>
                <Switch
                  checked={!!formData.isRoute}
                  onCheckedChange={(v) => setFormData((d) => ({ ...d, isRoute: v ? 1 : 0 }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>隐藏路由</Label>
                <Switch
                  checked={!!formData.hidden}
                  onCheckedChange={(v) => setFormData((d) => ({ ...d, hidden: v ? 1 : 0 }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>隐藏 Tab</Label>
                <Switch
                  checked={!!formData.hideTab}
                  onCheckedChange={(v) => setFormData((d) => ({ ...d, hideTab: v ? 1 : 0 }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>是否缓存路由</Label>
                <Switch
                  checked={!!formData.keepAlive}
                  onCheckedChange={(v) => setFormData((d) => ({ ...d, keepAlive: v ? 1 : 0 }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>聚合路由</Label>
                <Switch
                  checked={!!formData.alwaysShow}
                  onCheckedChange={(v) => setFormData((d) => ({ ...d, alwaysShow: v ? 1 : 0 }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>打开方式</Label>
                <Switch
                  checked={!!formData.internalOrExternal}
                  onCheckedChange={(v) => setFormData((d) => ({ ...d, internalOrExternal: v ? 1 : 0 }))}
                />
                <span className="text-sm text-muted-foreground ml-2">
                  {formData.internalOrExternal ? "外部" : "内部"}
                </span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                提交中...
              </>
            ) : (
              "确定"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { toMenuItem }
