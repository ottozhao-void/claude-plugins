import hljs from 'highlight.js/lib/core'
import type { LanguageFn } from 'highlight.js'

// Import common languages
import python from 'highlight.js/lib/languages/python'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import sql from 'highlight.js/lib/languages/sql'

// Register languages
const languages: Record<string, LanguageFn> = {
  python,
  javascript,
  typescript,
  java,
  cpp,
  go,
  rust,
  bash,
  json,
  yaml,
  xml,
  css,
  sql
}

Object.entries(languages).forEach(([name, lang]) => {
  hljs.registerLanguage(name, lang)
})

/**
 * Language mapping from file extension
 */
const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
  '.py': 'python',
  '.js': 'javascript',
  '.ts': 'typescript',
  '.jsx': 'javascript',
  '.tsx': 'typescript',
  '.java': 'java',
  '.cpp': 'cpp',
  '.c': 'c',
  '.h': 'c',
  '.hpp': 'cpp',
  '.cs': 'csharp',
  '.go': 'go',
  '.rs': 'rust',
  '.rb': 'ruby',
  '.php': 'php',
  '.swift': 'swift',
  '.kt': 'kotlin',
  '.scala': 'scala',
  '.sh': 'bash',
  '.bash': 'bash',
  '.zsh': 'bash',
  '.sql': 'sql',
  '.json': 'json',
  '.xml': 'xml',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.html': 'html',
  '.htm': 'html',
  '.css': 'css',
  '.scss': 'scss',
  '.vue': 'vue'
}

/**
 * Get language from filename
 */
export function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (!ext) return 'plaintext'

  return EXTENSION_LANGUAGE_MAP[`.${ext}`] || 'plaintext'
}

/**
 * Highlight code with syntax highlighting
 */
export function highlightCode(code: string, language: string): string {
  try {
    return hljs.highlight(code, { language }).value
  } catch {
    return hljs.highlight(code, { language: 'plaintext' }).value
  }
}

/**
 * Auto-detect language and highlight
 */
export function autoHighlight(code: string): string {
  try {
    const result = hljs.highlightAuto(code)
    return result.value
  } catch {
    return code
  }
}

/**
 * Check if language is supported
 */
export function isLanguageSupported(language: string): boolean {
  return language in hljs.listLanguages()
}
