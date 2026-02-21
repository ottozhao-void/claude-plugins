import type { FileType } from './file'

/**
 * Paper metadata structure
 */
export interface Paper {
  title: string
  slug: string
  authors: string[]
  abstract: string
  githubLinks?: string[]
  codeLinks?: string[]
  url?: string
  date?: string
}

/**
 * Paper file structure
 */
export interface PaperFile {
  name: string
  path: string
  type: FileType
}

/**
 * File content response
 */
export interface PaperFileContent {
  path: string
  type: FileType
  content: string | null
  url?: string
  language?: string
}
