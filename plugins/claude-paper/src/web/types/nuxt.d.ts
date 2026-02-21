/* eslint-disable */
declare global {
  // Nuxt auto-imports - restored for TSX context
  const ref: typeof import('vue')['ref']
  const computed: typeof import('vue')['computed']
  const reactive: typeof import('vue')['reactive']
  const watch: typeof import('vue')['watch']
  const watchEffect: typeof import('vue')['watchEffect']
  const onMounted: typeof import('vue')['onMounted']
  const onUnmounted: typeof import('vue')['onUnmounted']
  const nextTick: typeof import('vue')['nextTick']
  const useHead: typeof import('@unhead/vue')['useHead']
  const useRoute: typeof import('vue-router')['useRoute']
  const useRouter: typeof import('vue-router')['useRouter']
  const usePapers: typeof import('~/composables/usePapers')['usePapers']
  const $fetch: typeof import('ofetch')['$fetch']
  const definePageMeta: typeof import('nuxt/dist/pages/runtime')['definePageMeta']

  // Nuxt config and server functions
  function defineNuxtConfig(config: any): void
  function defineEventHandler<T>(handler: (event: H3Event) => T | Promise<T>): T
  function createError(options: { statusCode: number; statusMessage?: string; message?: string }): Error
  function getRouterParam(event: H3Event, key: string): string | undefined
  function getQuery<T = any>(event: H3Event): T
  function sendRedirect(event: H3Event, location: string, statusCode?: number): void
  function setHeader(event: H3Event, name: string, value: string): void

  interface H3Event {
    node: {
      req: any
      res: any
    }
    context: any
  }

  // Components
  const NuxtLink: typeof import('nuxt/dist/app/components')['NuxtLink']
}

export {}
