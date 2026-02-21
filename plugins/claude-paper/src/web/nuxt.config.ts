// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  devServer: {
    port: 5815
  },

  modules: ['@nuxt/content'],

  // Runtime config for environment variables
  runtimeConfig: {
    // Server-side only (private) - can use process.env
    // Keys here are available via useRuntimeConfig()
    public: {
      // Client-side safe values
      papersDir: process.env.CLAUDE_PAPERS_DIR || ''
    }
  },

  app: {
    head: {
      title: 'Claude Paper Library',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Interactive research paper study library' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  // TypeScript configuration
  typescript: {
    strict: false,
    typeCheck: false
  },

  // Vite configuration for TSX and CSS Modules
  vite: {
    css: {
      modules: {
        localsConvention: 'camelCase'
      }
    }
  },

  // Auto-imports configuration
  imports: {
    dirs: ['composables']
  },

  // Component auto-registration (including TSX)
  components: [
    {
      path: '~/components',
      pathPrefix: false,
      extensions: ['.tsx', '.ts', '.vue']
    }
  ]
})
