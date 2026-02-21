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
    const homedir = ref<string | null>(null)
    const isLoading = ref(true)
    const error = ref<string | null>(null)

    onMounted(async () => {
      try {
        const data = await $fetch<{ homedir: string }>('/api/system/homedir')
        homedir.value = data.homedir
      } catch (e) {
        error.value = 'Failed to get home directory'
        console.error('Failed to get homedir:', e)
      } finally {
        isLoading.value = false
      }
    })

    const openInVSCode = () => {
      if (!homedir.value) {
        alert('Unable to determine home directory')
        return
      }

      const expandedPath = props.path.replace('~', homedir.value)
      window.location.href = `vscode://file${expandedPath}`
    }

    return () => (
      <button
        class={styles.button}
        onClick={openInVSCode}
        disabled={isLoading.value || !homedir.value}
        data-testid="vscode-button"
      >
        {isLoading.value ? '...' : 'Open in VS Code'}
      </button>
    )
  }
})

export default VSCodeButton
