import type { FileType } from '@/types/file'

/**
 * Get file type from filename
 */
export function getFileType(filename: string): FileType {
  const ext = filename.split('.').pop()?.toLowerCase() || ''

  const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp']
  if (imageExts.includes(ext)) return 'image'

  if (ext === 'pdf') return 'pdf'

  const codeExts = [
    'py', 'js', 'ts', 'jsx', 'tsx', 'java', 'cpp', 'c', 'h', 'hpp',
    'cs', 'go', 'rs', 'rb', 'php', 'swift', 'kt', 'scala', 'sh',
    'bash', 'zsh', 'fish', 'ps1', 'r', 'm', 'sql', 'json', 'xml',
    'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf', 'vue', 'svelte',
    'css', 'scss', 'sass', 'less', 'html', 'htm'
  ]
  if (codeExts.includes(ext)) return 'code'

  if (ext === 'md' || ext === 'markdown') return 'markdown'

  if (ext === 'txt' || ext === 'log') return 'text'

  return 'unknown'
}

/**
 * Get file icon for display
 */
export function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''

  const iconMap: Record<string, string> = {
    'md': '📄',
    'txt': '📝',
    'pdf': '📕',
    'png': '🖼️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'gif': '🖼️',
    'svg': '🖼️',
    'py': '🐍',
    'js': '📜',
    'ts': '📘',
    'json': '{}',
    'yaml': '⚙️',
    'yml': '⚙️',
    'sh': '⚡',
    'html': '🌐',
    'css': '🎨',
    'vue': '💚'
  }

  return iconMap[ext] || '📄'
}

/**
 * Extract repository name from GitHub URL
 */
export function getRepoName(url: string): string {
  const match = url.match(/github\.com\/([^/]+\/[^/?#]+)/)
  return match ? match[1] : url
}
