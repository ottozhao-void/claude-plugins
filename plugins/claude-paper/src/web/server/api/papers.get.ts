import fs from 'fs'
import type { ApiError } from '~/types/api'
import { getIndexJsonPath } from '~/utils/config'

export default defineEventHandler(() => {
  try {
    const indexPath = getIndexJsonPath()

    if (!fs.existsSync(indexPath)) {
      return []
    }

    const content = fs.readFileSync(indexPath, 'utf-8')
    const data = JSON.parse(content)

    // Handle both flat array and {papers: [...]} structure
    return Array.isArray(data) ? data : (data.papers || [])
  } catch (e) {
    const err = e as ApiError
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Failed to load papers'
    })
  }
})
