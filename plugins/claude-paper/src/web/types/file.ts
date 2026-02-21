/**
 * File type enumeration
 */
export type FileType =
  | 'markdown'
  | 'code'
  | 'text'
  | 'image'
  | 'pdf'
  | 'unknown'

/**
 * File system node
 */
export interface FileNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileNode[]
}

/**
 * File tree state
 */
export interface FileTreeState {
  nodes: FileNode[]
  selectedPath: string | null
  expandedPaths: Set<string>
}
