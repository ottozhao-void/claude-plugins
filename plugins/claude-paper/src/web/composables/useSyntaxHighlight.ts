import { computed } from 'vue'
import type { Ref } from 'vue'
import { highlightCode, getLanguageFromFilename } from '@/utils/syntax'

/**
 * Syntax highlighting composable
 */
export function useSyntaxHighlight(
  code: Ref<string>,
  filename: Ref<string>
) {
  const highlighted = computed(() => {
    if (!code.value) return ''
    const language = getLanguageFromFilename(filename.value)
    return highlightCode(code.value, language)
  })

  const language = computed(() => {
    return getLanguageFromFilename(filename.value)
  })

  return {
    highlighted,
    language
  }
}
