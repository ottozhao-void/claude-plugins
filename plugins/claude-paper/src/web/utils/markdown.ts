import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'

// Configure marked with KaTeX
marked.use(markedKatex({
  throwOnError: false,
  output: 'html'
}))

/**
 * Markdown rendering options
 */
export interface MarkdownOptions {
  sanitize?: boolean
  enableMath?: boolean
  enableHighlight?: boolean
}

/**
 * Render markdown to HTML
 */
export function renderMarkdown(
  content: string,
  _options: MarkdownOptions = {}
): string {
  if (!content) return ''

  try {
    return marked.parse(content) as string
  } catch (error) {
    console.error('Markdown parsing error:', error)
    return `<p>Error parsing markdown</p>`
  }
}

/**
 * Extract markdown metadata (frontmatter)
 */
export function extractFrontmatter(content: string): {
  metadata: Record<string, any>
  content: string
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { metadata: {}, content }
  }

  // Simple YAML parsing (for basic cases)
  const metadata: Record<string, any> = {}
  const lines = match[1].split('\n')

  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      const value = line.slice(colonIndex + 1).trim()
      metadata[key] = value
    }
  }

  return { metadata, content: match[2] }
}
