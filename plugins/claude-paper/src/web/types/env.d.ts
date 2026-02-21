/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.css' {
  const styles: { [className: string]: string }
  export default styles
}

declare module '*.module.css' {
  const styles: { [className: string]: string }
  export default styles
}

declare module '*.md' {
  const content: string
  export default content
}

declare global {
  interface Window {
    __NUXT__?: any
  }
}

export {}
