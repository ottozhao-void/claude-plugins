import { ref } from 'vue'
import type { Ref } from 'vue'
import type { FileNode } from '@/types/file'

/**
 * File tree management composable
 */
export function useFileTree(initialNodes: Ref<FileNode[]>) {
  const selectedPath = ref<string | null>(null)
  const expandedPaths = ref<Set<string>>(new Set())

  const isSelected = (path: string) => {
    return selectedPath.value === path
  }

  const isExpanded = (path: string) => {
    return expandedPaths.value.has(path)
  }

  const toggleExpand = (path: string) => {
    if (expandedPaths.value.has(path)) {
      expandedPaths.value.delete(path)
    } else {
      expandedPaths.value.add(path)
    }
  }

  const selectPath = (path: string) => {
    selectedPath.value = path
  }

  const findNode = (path: string, nodes: FileNode[] = initialNodes.value): FileNode | null => {
    for (const node of nodes) {
      if (node.path === path) return node
      if (node.children) {
        const found = findNode(path, node.children)
        if (found) return found
      }
    }
    return null
  }

  return {
    selectedPath,
    expandedPaths,
    isSelected,
    isExpanded,
    toggleExpand,
    selectPath,
    findNode
  }
}
