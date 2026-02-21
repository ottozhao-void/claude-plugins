import { getPapersDir } from '~/utils/config'

export default defineEventHandler(() => {
  return {
    papersDir: getPapersDir()
  }
})
