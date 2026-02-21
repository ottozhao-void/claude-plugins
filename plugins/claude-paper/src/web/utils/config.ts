/**
 * Centralized configuration for Claude Paper plugin
 *
 * IMPORTANT: The default path uses ~/claude-papers for portability.
 * Override by setting CLAUDE_PAPERS_DIR environment variable.
 */

import { homedir } from 'os'
import path from 'path'

// Get papers directory from environment variable or use default
const DEFAULT_PAPERS_DIR = path.join(homedir(), 'claude-papers')
export const PAPERS_DIR = process.env.CLAUDE_PAPERS_DIR || DEFAULT_PAPERS_DIR

// Helper function to get papers directory path
export function getPapersDir(): string {
  return PAPERS_DIR
}

// Helper function to get index.json path
export function getIndexJsonPath(): string {
  return path.join(PAPERS_DIR, 'index.json')
}

// Helper function to get paper directory path
export function getPaperDir(slug: string): string {
  return path.join(PAPERS_DIR, 'papers', slug)
}
