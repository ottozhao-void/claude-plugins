import fs from 'fs'
import path from 'path'
import { homedir } from 'os'
import type { ApiError } from '~/types/api'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }

  try {
    const paperDir = path.join(homedir(), 'claude-papers/papers', slug)
    const readmePath = path.join(paperDir, 'README.md')

    if (!fs.existsSync(readmePath)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Paper not found'
      })
    }

    const markdown = fs.readFileSync(readmePath, 'utf-8')

    return {
      slug,
      markdown
    }
  } catch (e) {
    const err = e as ApiError
    if (err.statusCode) throw e

    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Failed to load paper'
    })
  }
})
