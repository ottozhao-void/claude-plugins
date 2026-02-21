import { computed } from 'vue'
import type { Ref } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

/**
 * Markdown rendering composable
 */
export interface UseMarkdownOptions {
  sanitize?: boolean
  enableMath?: boolean
}

export function useMarkdown(
  markdown: Ref<string>,
  options: UseMarkdownOptions = {}
) {
  const renderedHtml = computed(() => {
    if (!markdown.value) return ''
    return renderMarkdown(markdown.value, options)
  })

  return {
    renderedHtml
  }
}
