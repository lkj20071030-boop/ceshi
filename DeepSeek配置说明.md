# 本次 DeepSeek 修复

实际项目路径为本文件所在的 08-Web版。本次修复没有使用此前另一个 github-pages-ready 目录覆盖此项目的前端。

## 修复内容

- 添加 npm run model:check 和 server/check-deepseek.mjs。
- 现有 Agent 配置兼容 DEEPSEEK_API_KEY、DEEPSEEK_BASE_URL、DEEPSEEK_MODEL。
- 新概念可以生成完整教学包，不再必须匹配三个本地主题。
- 动态主题随会话持久化，能在重启后继续答题、学习和复测。
- 函数绘图、原有设置和已支持主题的 Agent 流程保留。
- 旧文件已备份到 .backups/deepseek-fix-*；密钥只存在本机 server/.env，不包含在备份里。

## 启动

关闭原来的后端终端，避免旧进程继续使用启动时的配置。

在本目录执行：

```cmd
npm.cmd run model:check
npm.cmd start
```

也可以双击原来的“启动前后端.cmd”。网页访问 http://127.0.0.1:8000/ ，选择真实后端与 /api/v1，输入“为什么植物进行光合作用需要光？”。

Key 可通过 Configure-DeepSeek.cmd 更新，更新后重启后端。不要把 Key 发送到聊天、前端源码或 GitHub。

## 已验证

构建成功；22项回归测试通过，覆盖旧 Agent、设置、函数绘图和新增概念生成。真实 DeepSeek 聊天连接检查返回成功。模型生成内容仍标记待核验。

真实验证已完成：deepseek-flash 调用成功；光合作用主题生成6个节点、2道首测题，完成评分、路径、节点讲解与不同题目的复测。新增启动命令使用 --use-system-ca 保持TLS证书校验并读取Windows证书库。更新配置后必须重启旧后端。
