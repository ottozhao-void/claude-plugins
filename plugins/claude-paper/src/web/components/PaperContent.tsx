import { defineComponent, computed } from 'vue'
import { useMarkdown } from '@/composables/useMarkdown'
import type { Ref } from 'vue'
import styles from './PaperContent.module.css'

/**
 * PaperContent component props
 */
export interface PaperContentProps {
  markdown?: string
}

/**
 * PaperContent component - renders markdown content
 */
export const PaperContent = defineComponent<PaperContentProps>({
  name: 'PaperContent',
  props: {
    markdown: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const markdownRef = computed(() => props.markdown || '') as Ref<string>
    const { renderedHtml } = useMarkdown(markdownRef, {
      enableMath: true
    })

    return () => (
      <div class={styles.container}>
        {props.markdown ? (
          <div
            class={styles.markdownBody}
            innerHTML={renderedHtml.value}
          />
        ) : (
          <div class={styles.empty}>
            No content available
          </div>
        )}
      </div>
    )
  }
})

export default PaperContent
