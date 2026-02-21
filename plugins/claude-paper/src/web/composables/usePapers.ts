import type { Paper } from '@/types/paper'
import type { ApiError } from '@/types/api'

export const usePapers = () => {
  const papers = ref<Paper[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadPapers = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Paper[]>('/api/papers')
      papers.value = data
    } catch (e: any) {
      const err = e as ApiError
      error.value = err.message || 'Failed to load papers'
      papers.value = []
    } finally {
      loading.value = false
    }
  }

  const getPaper = (slug: string): Paper | null => {
    return papers.value.find(p => p.slug === slug) || null
  }

  const getPaperMarkdown = async (slug: string): Promise<string | null> => {
    try {
      const data = await $fetch<{ slug: string; markdown: string }>(`/api/papers/${slug}`)
      return data.markdown
    } catch (e) {
      return null
    }
  }

  return {
    papers,
    loading,
    error,
    loadPapers,
    getPaper,
    getPaperMarkdown
  }
}
