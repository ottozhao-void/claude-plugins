<div align="center">

# Claude Plugins by ottozhao-void

**用于增强开发工作流的 Claude Code 插件集合**

[English](README.md) | [中文](README.zh-CN.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Claude Code Plugin](https://img.shields.io/badge/Claude_Code-Plugin-purple)](https://code.claude.com)

</div>

---

## 概述

本仓库包含一系列 [Claude Code](https://code.claude.com) 插件，通过专用工具扩展其在研究、开发和生产力方面的能力。

---

## 可用插件

### [Claude Paper](./plugins/claude-paper/)

**将研究论文转化为综合学习环境**

- 自动 PDF 解析与元数据提取
- 智能内容截断处理大型论文
- 代码仓库检测（GitHub、arXiv、CodeOcean）
- 自适应学习材料生成
- 带数学公式渲染的交互式 Web 查看器

[查看文档 &rarr;](./plugins/claude-paper/README.md)

---

## 快速开始

### 安装

将此 marketplace 添加到 Claude Code：

```bash
/plugin marketplace add ottozhao-void/claude-plugins
```

然后安装任意插件：

```bash
# 安装 Claude Paper
/plugin install claude-paper
```

重启 Claude Code 使插件生效。

### 系统要求

- **Node.js**: 18.0.0 或更高版本
- **npm**: 随 Node.js 一起安装
- **Claude Code**: 支持插件的最新版本

---

## 仓库结构

```
claude-plugins/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace 目录
├── plugins/
│   ├── claude-paper/             # 研究论文学习插件
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json       # 插件清单
│   │   ├── skills/               # 技能定义
│   │   ├── commands/             # 斜杠命令
│   │   ├── hooks/                # 会话钩子
│   │   └── src/                  # 源代码
│   └── [future-plugins]/         # 更多插件
└── README.md                     # 本文件
```

---

## 开发

### 添加新插件

1. 在 `plugins/your-plugin-name/` 下创建新目录
2. 添加 `.claude-plugin/plugin.json` 包含插件元数据
3. 添加你的技能、命令、钩子和源代码
4. 更新 `.claude-plugin/marketplace.json` 包含新插件

### 插件结构

每个插件遵循以下结构：

```
plugins/{plugin-name}/
├── .claude-plugin/
│   └── plugin.json              # 插件清单（名称、版本等）
├── skills/                      # 技能定义（SKILL.md 文件）
├── commands/                    # 斜杠命令定义
├── hooks/                       # 会话生命周期钩子
└── src/                         # 可选源代码
```

---

## 贡献

欢迎贡献！请：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 进行更改
4. 提交更改 (`git commit -m 'add amazing feature'`)
5. 推送到分支 (`git push origin feature/amazing-feature`)
6. 创建 Pull Request

---

## 许可证

本项目采用 **MIT License** - 详情见 [LICENSE](LICENSE) 文件。

---

## 致谢

- 使用 [Claude Code](https://code.claude.com) 构建
- 灵感来源于原版 [alaliqing/claude-paper](https://github.com/alaliqing/claude-paper)
