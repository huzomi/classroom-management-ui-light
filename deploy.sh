#!/bin/bash

# 部署脚本 - 在服务器上执行

# 1. 备份旧的 dist（如果存在）
if [ -d "/opt/avtronsys/jeecg/front-v0dev" ]; then
    echo "备份旧的 dist..."
    mv /opt/avtronsys/jeecg/front-v0dev /opt/avtronsys/jeecg/front-v0dev.backup.$(date +%Y%m%d_%H%M%S)
fi

# 2. 创建新目录
mkdir -p /opt/avtronsys/jeecg/front-v0dev

echo "请手动上传 dist 文件夹内容到 /opt/avtronsys/jeecg/front-v0dev"
echo "然后运行 nginx 配置更新"
