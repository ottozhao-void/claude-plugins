import fs from 'fs'
import path from 'path'
import type { FileNode } from '~/types/file'
import type { ApiError } from '~/types/api'
import { getPaperDir } from '~/utils/config'

function buildFileTree(dirPath: string, relativePath: string = ''): FileNode[] {
  const items = fs.readdirSync(dirPath, { withFileTypes: true })
  const nodes: FileNode[] = []

  for (const item of items) {
    // Skip hidden files and node_modules
    if (item.name.startsWith('.') || item.name === 'node_modules') {
      continue
    }

    const itemPath = path.join(dirPath, item.name)
    const itemRelativePath = relativePath ? `${relativePath}/${item.name}` : item.name

    if (item.isDirectory()) {
      nodes.push({
        name: item.name,
        path: itemRelativePath,
        type: 'directory',
        children: buildFileTree(itemPath, itemRelativePath)
      })
    } else {
      nodes.push({
        name: item.name,
        path: itemRelativePath,
        type: 'file'
      })
    }
  }

  // Sort: directories first, then files, alphabetically
  return nodes.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name)
    }
    return a.type === 'directory' ? -1 : 1
  })
}

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }

  try {
    const paperDir = getPaperDir(slug)

    if (!fs.existsSync(paperDir)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Paper directory not found'
      })
    }

    const fileTree = buildFileTree(paperDir)

    return fileTree
  } catch (e) {
    const err = e as ApiError
    if (err.statusCode) throw e

    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Failed to load file tree'
    })
  }
})
