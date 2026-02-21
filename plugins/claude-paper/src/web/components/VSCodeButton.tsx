import { defineComponent, onMounted, ref } from 'vue'
import styles from './VSCodeButton.module.css'

/**
 * VSCodeButton component props
 */
export interface VSCodeButtonProps {
  path: string
}

/**
 * VSCodeButton component - opens file in VS Code
 */
export const VSCodeButton = defineComponent<VSCodeButtonProps>({
  name: 'VSCodeButton',
  props: {
    path: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const papersDir = ref<string | null>(null)
    const isLoading = ref(true)
    const error = ref<string | null>(null)

    onMounted(async () => {
      try {
        const data = await $fetch<{ papersDir: string }>('/api/system/homedir')
        papersDir.value = data.papersDir
      } catch (e) {
        error.value = 'Failed to get papers directory'
        console.error('Failed to get papersDir:', e)
      } finally {
        isLoading.value = false
      }
    })

    const openInVSCode = () => {
      if (!papersDir.value) {
        alert('Unable to determine papers directory')
        return
      }

      // Replace papersDir path for VS Code URL
      const expandedPath = props.path.replace('~', papersDir.value)
      window.location.href = `vscode://file${expandedPath}`
    }

    return () => (
      <button
        class={styles.button}
        onClick={openInVSCode}
        disabled={isLoading.value || !papersDir.value}
        data-testid="vscode-button"
      >
        {isLoading.value ? '...' : 'Open in VS Code'}
      </button>
    )
  }
})

export default VSCodeButton
