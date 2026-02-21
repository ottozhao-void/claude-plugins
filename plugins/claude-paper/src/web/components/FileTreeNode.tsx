import { defineComponent, ref, computed, type PropType } from 'vue'
import type { FileNode } from '@/types/file'
import { getFileIcon } from '@/utils/file'
import styles from './FileTreeNode.module.css'

/**
 * FileTreeNode component props
 */
export interface FileTreeNodeProps {
  node: FileNode
  selectedPath: string
  onSelect?: (path: string) => void
}

/**
 * FileTreeNode component - recursive file tree display
 */
export const FileTreeNode = defineComponent<FileTreeNodeProps>({
  name: 'FileTreeNode',
  props: {
    node: {
      type: Object as PropType<FileNode>,
      required: true
    },
    selectedPath: {
      type: String,
      required: true
    },
    onSelect: {
      type: Function as PropType<(path: string) => void>,
      default: undefined
    }
  },
  setup(props, { emit }) {
    const expanded = ref(false)

    const isDirectory = computed(() => props.node.type === 'directory')
    const isSelected = computed(() => props.node.path === props.selectedPath)

    const handleClick = () => {
      if (isDirectory.value) {
        expanded.value = !expanded.value
      } else {
        if (props.onSelect) {
          props.onSelect(props.node.path)
        } else {
          emit('select', props.node.path)
        }
      }
    }

    const handleChildSelect = (path: string) => {
      if (props.onSelect) {
        props.onSelect(path)
      } else {
        emit('select', path)
      }
    }

    return () => {
      const { node } = props
      const directoryClass = isDirectory.value ? styles.directory : ''
      const fileClass = !isDirectory.value ? styles.file : ''
      const selectedClass = isSelected.value ? styles.selected : ''
      const nodeContentClass = [
        styles.nodeContent,
        directoryClass,
        fileClass,
        selectedClass
      ].filter(Boolean).join(' ')

      return (
        <div class={styles.treeNode}>
          <div
            class={nodeContentClass}
            onClick={handleClick}
          >
            {isDirectory.value ? (
              <span class={`${styles.icon} ${styles.expandIcon}`}>
                {expanded.value ? '▼' : '▶'}
              </span>
            ) : (
              <span class={`${styles.icon} ${styles.fileIcon}`}>
                {getFileIcon(node.name)}
              </span>
            )}
            <span class={styles.nodeLabel}>{node.name}</span>
          </div>

          {isDirectory.value && expanded.value && node.children && (
            <div class={styles.children}>
              {node.children.map((child) => (
                <FileTreeNode
                  key={child.path}
                  node={child}
                  selectedPath={props.selectedPath}
                  onSelect={handleChildSelect}
                />
              ))}
            </div>
          )}
        </div>
      )
    }
  }
})

export default FileTreeNode
