import type { CSSProperties } from 'vue'

/**
 * Common component props
 */
export interface BaseComponentProps {
  className?: string
  style?: CSSProperties
  testId?: string
}

/**
 * Loading state
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * Async data state
 */
export interface AsyncData<T> {
  data: T | null
  state: LoadingState
  error: string | null
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string
  path?: string
}
