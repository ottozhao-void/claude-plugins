#!/bin/bash
set -e

# Use CLAUDE_PAPERS_DIR environment variable if set, otherwise use ~/claude-papers
PAPERS_DIR="${CLAUDE_PAPERS_DIR:-$HOME/claude-papers}"

# Only create basic directory structure (fast)
if [ ! -d "$PAPERS_DIR" ]; then
  mkdir -p "$PAPERS_DIR/papers"
  echo '[]' > "$PAPERS_DIR/index.json"
fi

exit 0
