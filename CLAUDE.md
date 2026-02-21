# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **monorepo for Claude Code plugins** maintained by ottozhao-void. Each plugin is self-contained in its own directory under `plugins/`.

### Current Plugins

- **claude-paper** - Automates research paper study through intelligent material generation, code demonstrations, and an interactive web viewer

---

## Repository Structure

```
claude-plugins/
├── .claude-plugin/
│   └── marketplace.json              # Marketplace catalog (lists all plugins)
├── plugins/
│   ├── claude-paper/                 # Research paper study plugin
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json           # Plugin manifest
│   │   ├── skills/                   # Skill definitions
│   │   ├── commands/                 # Slash commands
│   │   ├── hooks/                    # Session lifecycle hooks
│   │   ├── src/                      # Plugin source code
│   │   └── README.md                 # Plugin-specific docs
│   └── [future-plugins]/             # Additional plugins
└── CLAUDE.md                         # This file
```

---

## Adding a New Plugin

1. **Create plugin directory**: `plugins/{plugin-name}/`
2. **Add plugin manifest**: Create `.claude-plugin/plugin.json` with plugin metadata
3. **Implement plugin**: Add skills/, commands/, hooks/, and/or src/ as needed
4. **Update marketplace**: Add entry to `.claude-plugin/marketplace.json` plugins array
5. **Add documentation**: Create `plugins/{plugin-name}/README.md`

---

## Claude Code Plugin System

### Skill Definition

Skills are defined with YAML frontmatter in `.md` files:

```yaml
---
name: plugin-name:skill-name
description: Skill description
allowed-tools: [tool1, tool2, ...]
---

Skill instructions go here...
```

- `CLAUDE_PLUGIN_ROOT` environment variable points to the plugin directory
- Skills are invoked via user commands like `/plugin-name:skill-name`

### Marketplace Catalog

`.claude-plugin/marketplace.json` defines the marketplace:

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "claude-plugins",
  "description": "Plugin collection description",
  "owner": { "name": "ottozhao-void" },
  "plugins": [
    {
      "name": "plugin-name",
      "version": "1.0.0",
      "description": "Plugin description",
      "source": "./plugins/plugin-name",
      "category": "development"
    }
  ]
}
```

### Plugin Manifest

Each plugin has `.claude-plugin/plugin.json`:

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "Plugin description",
  "author": { "name": "ottozhao-void" }
}
```

---

## Claude Paper Plugin Details

### Web Viewer Development

```bash
cd plugins/claude-paper/src/web

# Development server on port 5815
npm run dev

# Production build (outputs to .output/)
npm run build

# Preview production build
npm run preview
```

### PDF Processing

```bash
# From repository root
cd plugins/claude-paper

# Parse a PDF and extract metadata
node skills/study/scripts/parse-pdf.js /path/to/paper.pdf

# Download PDF from URL (supports arXiv /abs/ URLs)
node skills/study/scripts/download-pdf.cjs https://arxiv.org/abs/1706.03762
```

### Key Components

1. **Study Skill** (`skills/study/SKILL.md`): Orchestrates the entire paper processing workflow
   - Parses PDFs and extracts metadata
   - Assesses paper difficulty and type
   - Generates adaptive learning materials
   - Creates code demonstrations
   - Extracts figures and updates search index

2. **Web UI Skill** (`skills/webui/SKILL.md`): Manages web viewer lifecycle
   - Checks and installs dependencies
   - Builds production server
   - Manages port availability (5815)
   - Handles server health checks

3. **Web Viewer** (`src/web/`): Nuxt.js application with Nitro API server
   - **Composables**: `usePapers.ts` - Paper data management
   - **Components**: PaperCard, PaperContent, FileTreeNode, VSCodeButton
   - **API Routes**: `server/api/` - Endpoints for paper data, files, markdown

### Paper Storage Structure

Papers are stored in `~/claude-papers/papers/{paper-slug}/` (default location):
```
~/claude-papers/
├── papers/{paper-slug}/
│   ├── paper.pdf              # Original PDF
│   ├── meta.json              # Metadata (title, authors, etc.)
│   ├── README.md              # Quick navigation
│   ├── summary.md             # Detailed summary
│   ├── insights.md            # Key insights (most important!)
│   ├── method.md              # Methodology (conditional)
│   ├── mental-model.md        # Paper categorization (conditional)
│   ├── qa.md                  # Learning questions
│   ├── images/                # Extracted figures
│   └── code/                  # Code demonstrations
└── index.json                 # Global search index
```

**Custom Location**: Override via `CLAUDE_PAPERS_DIR` environment variable or create `.env.local` in the web directory.

### Content Truncation

PDF content is truncated at 50,000 characters to prevent token issues. The parser (`parse-pdf.js`) handles this intelligently by preserving the most important content first.

### Language Detection

The study skill automatically detects the user's language from their input and generates ALL materials in that language (e.g., "我们学习一下这篇论文吧" → Chinese content).

### Web Viewer API

The Nuxt.js server provides these endpoints:
- `GET /api/papers` - List all papers (reads `index.json`)
- `GET /api/papers/{slug}` - Get paper README markdown
- `GET /api/papers/{slug}/files` - List paper directory structure
- `GET /api/papers/{slug}/file` - Get specific file content
- `GET /api/papers/{slug}/raw` - Get raw binary file (images, PDFs)
- `GET /api/system/homedir` - Get papers directory path

### Hooks System

Session start hooks (`hooks/hooks.json`) automatically:
- Create `~/claude-papers/` directory structure (or custom path via `CLAUDE_PAPERS_DIR`)
- Initialize `index.json` with empty array
- Verify installation status

---

## System Dependencies

- **Node.js**: >=18.0.0
- **poppler-utils**: For PDF image extraction (install via system package manager)
  - macOS: `brew install poppler`
  - Ubuntu/Debian: `sudo apt-get install poppler-utils`

---

## Development Notes

- The claude-paper web viewer uses KaTeX for math rendering
- PDF parsing uses `pdf-parse` library
- Image extraction requires Python 3 with `pymupdf`
- Web UI runs on port 5815 (hardcoded in multiple places)
- Production server PID is stored in `/tmp/claude-paper-webui.pid` for cleanup
- Claude Paper is a fork of the original `alaliqing/claude-paper` marketplace plugin
