<div align="center">

# Claude Plugins by ottozhao-void

**A collection of Claude Code plugins for enhanced development workflows**

[English](README.md) | [中文](README.zh-CN.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Claude Code Plugin](https://img.shields.io/badge/Claude_Code-Plugin-purple)](https://code.claude.com)

</div>

---

## Overview

This repository contains a collection of plugins for [Claude Code](https://code.claude.com), extending its capabilities with specialized tools for research, development, and productivity.

---

## Available Plugins

### [Claude Paper](./plugins/claude-paper/)

**Transform research papers into comprehensive learning environments**

- Automatic PDF parsing with metadata extraction
- Smart content truncation for large papers
- Code repository detection (GitHub, arXiv, CodeOcean)
- Adaptive learning materials generation
- Interactive web viewer with math rendering

[View Documentation &rarr;](./plugins/claude-paper/README.md)

---

## Quick Start

### Installation

Add this marketplace to Claude Code:

```bash
/plugin marketplace add ottozhao-void/claude-plugins
```

Then install any plugin:

```bash
# For Claude Paper
/plugin install claude-paper
```

Restart Claude Code for plugins to take effect.

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: Comes with Node.js
- **Claude Code**: Latest version with plugin support

---

## Repository Structure

```
claude-plugins/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace catalog
├── plugins/
│   ├── claude-paper/             # Research paper study plugin
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json       # Plugin manifest
│   │   ├── skills/               # Skill definitions
│   │   ├── commands/             # Slash commands
│   │   ├── hooks/                # Session hooks
│   │   └── src/                  # Source code
│   └── [future-plugins]/         # Additional plugins
└── README.md                     # This file
```

---

## Development

### Adding a New Plugin

1. Create a new directory under `plugins/your-plugin-name/`
2. Add a `.claude-plugin/plugin.json` with plugin metadata
3. Add your skills, commands, hooks, and source code
4. Update `.claude-plugin/marketplace.json` to include the new plugin

### Plugin Structure

Each plugin follows this structure:

```
plugins/{plugin-name}/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest (name, version, etc.)
├── skills/                      # Skill definitions (SKILL.md files)
├── commands/                    # Slash command definitions
├── hooks/                       # Session lifecycle hooks
└── src/                         # Optional source code
```

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with [Claude Code](https://code.claude.com)
- Inspired by the original [alaliqing/claude-paper](https://github.com/alaliqing/claude-paper)
