import { defineComponent, computed, type PropType } from 'vue'
import type { Paper } from '@/types/paper'
import { getRepoName } from '@/utils/file'
import styles from './PaperCard.module.css'

/**
 * PaperCard component props
 */
export interface PaperCardProps {
  paper: Paper
}

/**
 * PaperCard component - displays a research paper card
 */
export const PaperCard = defineComponent<PaperCardProps>({
  name: 'PaperCard',
  props: {
    paper: {
      type: Object as PropType<Paper>,
      required: true
    }
  },
  setup(props) {
    const hasCodeLinks = computed(() => {
      return (
        (props.paper.githubLinks?.length ?? 0) > 0 ||
        (props.paper.codeLinks?.length ?? 0) > 0
      )
    })

    const stopPropagation = (e: MouseEvent) => {
      e.stopPropagation()
    }

    return () => (
      <a
        href={`/papers/${props.paper.slug}`}
        class={styles.card}
        data-testid="paper-card"
      >
        <h3 class={styles.title}>{props.paper.title}</h3>
        <p class={styles.authors}>
          {props.paper.authors.join(', ')}
        </p>
        <p class={styles.abstract}>
          {props.paper.abstract}
        </p>

        {hasCodeLinks.value && (
          <div class={styles.codeLinks}>
            <h4 class={styles.codeLinksTitle}>Code Resources:</h4>
            <ul class={styles.codeLinksList}>
              {props.paper.githubLinks?.map((link) => (
                <li key={link} class={styles.codeLinksItem}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={stopPropagation}
                    class={styles.codeLink}
                  >
                    {getRepoName(link)}
                    <span class={styles.externalIcon}>↗</span>
                  </a>
                </li>
              ))}
              {props.paper.codeLinks?.map((link) => (
                <li key={link} class={styles.codeLinksItem}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={stopPropagation}
                    class={styles.codeLink}
                  >
                    {link}
                    <span class={styles.externalIcon}>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </a>
    )
  }
})

export default PaperCard
