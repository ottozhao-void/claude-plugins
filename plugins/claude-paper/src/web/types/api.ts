import type { Paper } from './paper'
import type { FileNode } from './file'
import type { PaperFileContent } from './paper'

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T
  error?: string
}

/**
 * Papers list response
 */
export type PapersListResponse = Paper[]

/**
 * File tree response
 */
export type FileTreeResponse = FileNode[]

/**
 * File content response
 */
export type FileContentResponse = PaperFileContent

/**
 * Paper markdown response
 */
export interface PaperMarkdownResponse {
  slug: string
  markdown: string
}

/**
 * Papers directory response
 */
export interface PapersDirResponse {
  papersDir: string
}

/**
 * Error types
 */
export interface ApiError {
  statusCode?: number
  statusMessage?: string
  message?: string
}
