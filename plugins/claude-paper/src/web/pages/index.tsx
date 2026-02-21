import { defineComponent, onMounted } from 'vue'
import PaperCard from '@/components/PaperCard'
import styles from './index.module.css'

/**
 * Index Page - Main library view
 */
export const IndexPage = defineComponent({
  name: 'IndexPage',
  setup() {
    const { papers, loading, error, loadPapers } = usePapers()

    onMounted(async () => {
      await loadPapers()
    })

    useHead({
      title: 'Research Library'
    })

    return () => (
      <div class={styles.container}>
        <nav class={styles.topBar}>
          <div class={styles.logo}>
            <span class={styles.logoIcon}>◈</span>
            <span class={styles.logoText}>Research Library</span>
          </div>
        </nav>

        <div class={styles.content}>
          <div class={styles.header}>
            <h1 class={styles.title}>Your Research Collection</h1>
            <p class={styles.subtitle}>
              All papers stored in: <code>~/claude-papers/papers/</code>
            </p>
          </div>

          {loading.value && (
            <div class={styles.loadingState}>
              <div class={styles.spinner} />
              <p>Loading papers...</p>
            </div>
          )}

          {error.value && (
            <div class={styles.errorState}>{error.value}</div>
          )}

          {!loading.value && !error.value && papers.value.length === 0 && (
            <div class={styles.emptyState}>
              <p>No papers yet. Use <code>/claude-paper:study</code> to add papers.</p>
            </div>
          )}

          {!loading.value && !error.value && papers.value.length > 0 && (
            <div class={styles.papersGrid}>
              {papers.value.map((paper) => (
                <PaperCard key={paper.slug} paper={paper} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
})

export default IndexPage
