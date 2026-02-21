/**
 * Centralized configuration for Claude Paper plugin
 *
 * IMPORTANT: The default path uses ~/claude-papers for portability.
 * Override by setting CLAUDE_PAPERS_DIR environment variable.
 *
 * Environment variables are read at runtime (not module load time)
 * to ensure .env files are properly loaded by Nuxt.
 */

import { homedir } from 'os'
import path from 'path'

// Default papers directory
const DEFAULT_PAPERS_DIR = path.join(homedir(), 'claude-papers')

/**
 * Get papers directory from environment variable (read at runtime)
 * Nuxt 3 automatically loads .env and .env.local files
 */
function getPapersDirValue(): string {
  // First check process.env (set by .env files or shell)
  if (process.env.CLAUDE_PAPERS_DIR) {
    return process.env.CLAUDE_PAPERS_DIR
  }
  return DEFAULT_PAPERS_DIR
}

// Helper function to get papers directory path
export function getPapersDir(): string {
  return getPapersDirValue()
}

// Helper function to get index.json path
export function getIndexJsonPath(): string {
  return path.join(getPapersDirValue(), 'index.json')
}

// Helper function to get paper directory path
export function getPaperDir(slug: string): string {
  return path.join(getPapersDirValue(), 'papers', slug)
}
