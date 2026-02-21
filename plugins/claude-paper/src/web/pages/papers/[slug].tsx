import { defineComponent, ref, computed, onMounted } from 'vue'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import hljs from 'highlight.js/lib/core'
import type { Paper, FileNode } from '@/types'
import FileTreeNode from '@/components/FileTreeNode'
import VSCodeButton from '@/components/VSCodeButton'
import { highlightCode } from '@/utils/syntax'
import styles from './slug.module.css'

// Register highlight.js languages
import python from 'highlight.js/lib/languages/python'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import sql from 'highlight.js/lib/languages/sql'

hljs.registerLanguage('python', python)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('java', java)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('go', go)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('sql', sql)

marked.use(markedKatex({
  throwOnError: false,
  output: 'html'
}))

/**
 * Paper Reader Page - Displays paper content with file tree
 */
export const PaperReaderPage = defineComponent({
  name: 'PaperReaderPage',
  setup() {
    const route = useRoute()
    const slug = route.params.slug as string

    const { papers, loadPapers, getPaper } = usePapers()
    const loading = ref(true)
    const error = ref<string | null>(null)
    const paper = ref<Paper | null>(null)

    const fileTree = ref<FileNode[]>([])
    const selectedFile = ref('README.md')
    const fileContent = ref('')
    const fileType = ref<'markdown' | 'code' | 'image' | 'pdf' | 'text'>('markdown')
    const fileLanguage = ref('plaintext')
    const fileUrl = ref('')
    const fileLoading = ref(false)

    const sidebarCollapsed = ref(false)

    onMounted(async () => {
      try {
        if (papers.value.length === 0) {
          await loadPapers()
        }

        paper.value = getPaper(slug)

        if (!paper.value) {
          error.value = 'Paper not found'
          return
        }

        const tree = await $fetch<FileNode[]>(`/api/papers/${slug}/files`)
        fileTree.value = tree

        await loadFile('README.md')
      } catch (e: any) {
        error.value = e.message || 'Failed to load paper'
      } finally {
        loading.value = false
      }
    })

    const loadFile = async (path: string) => {
      fileLoading.value = true
      try {
        const data = await $fetch<{
          path: string
          type: 'markdown' | 'code' | 'image' | 'pdf' | 'text'
          content: string | null
          url?: string
          language?: string
        }>(`/api/papers/${slug}/file`, {
          params: { path }
        })

        selectedFile.value = path
        fileType.value = data.type
        fileContent.value = data.content || ''
        fileLanguage.value = data.language || 'plaintext'
        fileUrl.value = data.url || ''
      } catch (e: any) {
        fileContent.value = `Error loading file: ${e.message}`
        fileType.value = 'text'
      } finally {
        fileLoading.value = false
      }
    }

    const selectFile = (path: string) => {
      loadFile(path)
    }

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }

    const highlightedCode = computed(() => {
      if (!fileContent.value || fileType.value !== 'code') return ''
      try {
        return highlightCode(fileContent.value, fileLanguage.value)
      } catch {
        return fileContent.value
      }
    })

    const renderedContent = computed(() => {
      if (!fileContent.value) return ''
      if (fileType.value === 'markdown') {
        const result = marked.parse(fileContent.value)
        return typeof result === 'string' ? result : ''
      }
      if (fileType.value === 'text') {
        return `<pre>${fileContent.value}</pre>`
      }
      return fileContent.value
    })

    const paperPath = computed(() => `~/claude-papers/papers/${slug}`)

    useHead({
      title: paper.value ? `${paper.value.title} - Research Library` : 'Paper - Research Library'
    })

    return () => (
      <div class={styles.container}>
        {loading.value && (
          <div class={styles.loadingState}>
            <div class={styles.spinner} />
            <p>Loading research materials...</p>
          </div>
        )}

        {error.value && (
          <div class={styles.errorState}>
            <div class={styles.errorIcon}>⚠</div>
            <h2>Unable to Load Paper</h2>
            <p>{error.value}</p>
            <a href="/" class={styles.backHome}>← Return to Library</a>
          </div>
        )}

        {!loading.value && !error.value && (
          <div class={styles.reader}>
            <nav class={styles.topBar}>
              <a href="/" class={styles.backToLibrary}>
                <span class={styles.backArrow}>←</span>
                <span class={styles.backText}>Library</span>
              </a>

              <div class={styles.paperTitleNav}>
                <h1>{paper.value?.title}</h1>
              </div>

              <div class={styles.actions}>
                <VSCodeButton path={paperPath.value} />
                {paper.value?.url && (
                  <a
                    href={paper.value.url}
                    target="_blank"
                    class={styles.externalLink}
                    title="View original paper"
                  >
                    <span>Original Paper</span>
                    <span class={styles.arrow}>↗</span>
                  </a>
                )}
              </div>
            </nav>

            <div class={styles.mainContent}>
              <aside
                class={[styles.sidebar, sidebarCollapsed.value && styles.collapsed].filter(Boolean).join(' ')}
              >
                <div class={styles.sidebarInner}>
                  {!sidebarCollapsed.value ? (
                    <div class={styles.sidebarHeader}>
                      <h3>Study Materials</h3>
                      <button onClick={toggleSidebar} class={styles.collapseBtn} title="Collapse">
                        ←
                      </button>
                    </div>
                  ) : (
                    <button onClick={toggleSidebar} class={styles.expandBtn} title="Expand">
                      →
                    </button>
                  )}

                  {!sidebarCollapsed.value && (
                    <div class={styles.fileTree}>
                      {fileTree.value.map((node) => (
                        <FileTreeNode
                          key={node.path}
                          node={node}
                          selectedPath={selectedFile.value}
                          onSelect={selectFile}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </aside>

              <main class={styles.readingPane}>
                <div class={styles.readingHeader}>
                  <div class={styles.breadcrumb}>
                    <span class={[styles.crumb, styles.paperName].join(' ')}>{slug}</span>
                    <span class={styles.separator}>/</span>
                    <span class={[styles.crumb, styles.fileName].join(' ')}>
                      {selectedFile.value || 'README.md'}
                    </span>
                  </div>
                </div>

                <article class={styles.content}>
                  {fileLoading.value && (
                    <div class={styles.fileLoading}>
                      <div class={styles.shimmer} />
                    </div>
                  )}

                  {fileType.value === 'image' && !fileLoading.value && (
                    <div class={[styles.fileViewer, styles.imageViewer].join(' ')}>
                      <img src={fileUrl.value} alt={selectedFile.value} />
                    </div>
                  )}

                  {fileType.value === 'pdf' && !fileLoading.value && (
                    <div class={[styles.fileViewer, styles.pdfViewer].join(' ')}>
                      <iframe src={fileUrl.value} frameborder="0"></iframe>
                    </div>
                  )}

                  {fileType.value === 'code' && !fileLoading.value && (
                    <div class={[styles.fileViewer, styles.codeViewer].join(' ')}>
                      <pre>
                        <code
                          class={`language-${fileLanguage.value}`}
                          innerHTML={highlightedCode.value}
                        />
                      </pre>
                    </div>
                  )}

                  {fileContent.value && fileType.value !== 'code' && fileType.value !== 'image' && fileType.value !== 'pdf' && !fileLoading.value && (
                    <div innerHTML={renderedContent.value} class={styles.markdownBody} />
                  )}

                  {!fileContent.value && !fileLoading.value && (
                    <div class={styles.emptyState}>
                      <p>No content available</p>
                    </div>
                  )}
                </article>
              </main>
            </div>
          </div>
        )}
      </div>
    )
  }
})

export default PaperReaderPage
