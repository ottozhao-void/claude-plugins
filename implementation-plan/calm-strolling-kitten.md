# TypeScript & TSX Refactoring Plan

## Context

The web viewer (`plugins/claude-paper/src/web/`) currently uses **Vue Single File Components (SFC)** with partial TypeScript adoption. This refactoring will:

1. Convert all Vue SFC components to **TSX components**
2. Establish a unified type system with centralized type definitions
3. Implement CSS Modules for styling (replacing `<style scoped>`)
4. Implement stricter type checking
5. Standardize on modern Vue 3 TSX patterns

**Current Issues:**
- 3 files still use JavaScript (`PaperContent.vue`, `VSCodeButton.vue`, `index.vue`)
- No `tsconfig.json` (relying on Nuxt's implicit configuration)
- Types duplicated across files (e.g., `FileNode` interface appears twice)
- `any` types used in error handlers
- Scoped styles in SFC won't work in TSX (need CSS Modules)

---

## Implementation Approach

### Phase 1: Foundation - Configuration & Type Infrastructure

#### 1.1 Create Centralized Type Definitions
**File:** `plugins/claude-paper/src/web/types/index.ts` (new)

```typescript
// Core Paper Types
export interface Paper {
  title: string
  slug: string
  authors: string[]
  abstract: string
  githubLinks?: string[]
  codeLinks?: string[]
  url?: string
  date?: string
}

// File System Types
export interface FileNode {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FileNode[]
}

// API Response Types
export interface PaperFileResponse {
  path: string
  type: FileType
  content: string | null
  url?: string
  language?: string
}

export interface PaperMarkdownResponse {
  slug: string
  markdown: string
}

export interface HomeDirResponse {
  homedir: string
}

// File Type Enum
export type FileType =
  | 'image'
  | 'pdf'
  | 'code'
  | 'markdown'
  | 'text'
  | 'unknown'

// Error Types
export interface ApiError {
  statusCode?: number
  statusMessage?: string
  message?: string
}
```

#### 1.2 Create TypeScript Configuration
**File:** `plugins/claude-paper/src/web/tsconfig.json` (new)

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node", "vite/client"],
    "paths": {
      "~/*": ["./*"],
      "@/*": ["./*"],
      "~~/*": ["./*"],
      "@@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/*.vue",
    ".nuxt/tsconfig.json"
  ],
  "exclude": [
    "node_modules",
    ".nuxt",
    "dist"
  ]
}
```

#### 1.3 Update nuxt.config.ts for TSX Support
**File:** `plugins/claude-paper/src/web/nuxt.config.ts`

Add Vite JSX configuration:
```typescript
export default defineNuxtConfig({
  // ... existing config ...

  vite: {
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'vue'
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[local]_[hash:base64:5]'
      }
    }
  },

  typescript: {
    strict: true,
    typeCheck: true
  }
})
```

#### 1.4 Update package.json
**File:** `plugins/claude-paper/src/web/package.json`

Add devDependencies and scripts:
```json
{
  "scripts": {
    "type-check": "vue-tsc --noEmit",
    "build": "npm run type-check && nuxt build"
  },
  "devDependencies": {
    "vue-tsc": "^2.0.0",
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0"
  }
}
```

---

### Phase 2: Convert Components to TSX

#### 2.1 Convert `components/VSCodeButton.vue` → `VSCodeButton.tsx`
**New files:**
- `plugins/claude-paper/src/web/components/VSCodeButton.tsx`
- `plugins/claude-paper/src/web/components/VSCodeButton.module.css`

**Key changes:**
- Convert to `defineComponent` with render function
- Use CSS Modules for styles
- Add proper TypeScript types
- Explicit imports (no auto-imports in TSX)

#### 2.2 Convert `components/PaperCard.vue` → `PaperCard.tsx`
**New files:**
- `plugins/claude-paper/src/web/components/PaperCard.tsx`
- `plugins/claude-paper/src/web/components/PaperCard.module.css`

**Key changes:**
- Convert v-for to `.map()`
- Convert v-if to conditional rendering
- Handle `@click.stop` with `e.stopPropagation()`
- Import `NuxtLink` from `#app`

#### 2.3 Convert `components/FileTreeNode.vue` → `FileTreeNode.tsx`
**New files:**
- `plugins/claude-paper/src/web/components/FileTreeNode.tsx`
- `plugins/claude-paper/src/web/components/FileTreeNode.module.css`

**Key changes:**
- Handle recursive component (explicitly register in `components` option)
- Convert dynamic classes to array syntax
- Emit events via `emit` parameter

#### 2.4 Convert `components/PaperContent.vue` → `PaperContent.tsx`
**New files:**
- `plugins/claude-paper/src/web/components/PaperContent.tsx`
- `plugins/claude-paper/src/web/components/PaperContent.module.css`

**Key changes:**
- Convert computed property to computed ref
- Use `v-html` equivalent `innerHTML` or use `dom-html` plugin

---

### Phase 3: Convert Pages to TSX

#### 3.1 Convert `pages/index.vue` → `pages/index.tsx`
**New files:**
- `plugins/claude-paper/src/web/pages/index.tsx`
- `plugins/claude-paper/src/web/pages/index.module.css`

**Key changes:**
- Multi-condition rendering (loading, error, empty, success states)
- Import `useHead` from `#app`
- Register PaperCard component explicitly

#### 3.2 Convert `pages/papers/[slug].vue` → `pages/papers/[slug].tsx`
**New files:**
- `plugins/claude-paper/src/web/pages/papers/[slug].tsx`
- `plugins/claude-paper/src/web/pages/papers/[slug].module.css`

**Key changes:**
- Complex page with multiple conditional states
- File tree recursion
- Multiple content type viewers (image, pdf, code, markdown)
- This is the largest file (~804 lines) - will take the most time

---

### Phase 4: Update Composables & Fix Types

#### 4.1 Update `composables/usePapers.ts`
- Import types from centralized `~/types`
- Replace `catch (e: any)` with proper error types
- Remove duplicate type definitions

#### 4.2 Update API Route Files
Files:
- `server/api/papers/[slug]/files.get.ts`
- `server/api/papers/[slug]/file.get.ts`

Changes:
- Import types from centralized `~/types`
- Replace `any` with `ApiError` interface

---

### Phase 5: Extract CSS to CSS Modules

For each component, extract `<style scoped>` to `.module.css` files:

**Example conversion:**
```css
/* Vue SFC scoped style */
.paper-card { ... }

/* CSS Module */
.paperCard { ... } /* camelCase for TypeScript */
```

**All CSS Module files to create:**
- `components/VSCodeButton.module.css`
- `components/PaperCard.module.css`
- `components/FileTreeNode.module.css`
- `components/PaperContent.module.css`
- `pages/index.module.css`
- `pages/papers/[slug].module.css`

---

## Critical Files to Modify

### New Files to Create
- `plugins/claude-paper/src/web/types/index.ts` - Centralized type definitions
- `plugins/claude-paper/src/web/tsconfig.json` - TypeScript configuration
- `plugins/claude-paper/src/web/components/VSCodeButton.tsx`
- `plugins/claude-paper/src/web/components/VSCodeButton.module.css`
- `plugins/claude-paper/src/web/components/PaperCard.tsx`
- `plugins/claude-paper/src/web/components/PaperCard.module.css`
- `plugins/claude-paper/src/web/components/FileTreeNode.tsx`
- `plugins/claude-paper/src/web/components/FileTreeNode.module.css`
- `plugins/claude-paper/src/web/components/PaperContent.tsx`
- `plugins/claude-paper/src/web/components/PaperContent.module.css`
- `plugins/claude-paper/src/web/pages/index.tsx`
- `plugins/claude-paper/src/web/pages/index.module.css`
- `plugins/claude-paper/src/web/pages/papers/[slug].tsx`
- `plugins/claude-paper/src/web/pages/papers/[slug].module.css`

### Existing Files to Modify
- `plugins/claude-paper/src/web/package.json` - Add dependencies and scripts
- `plugins/claude-paper/src/web/nuxt.config.ts` - Add JSX and TypeScript configuration
- `plugins/claude-paper/src/web/composables/usePapers.ts` - Fix types, use centralized types
- `plugins/claude-paper/src/web/server/api/papers/[slug]/files.get.ts` - Fix error types
- `plugins/claude-paper/src/web/server/api/papers/[slug]/file.get.ts` - Fix error types

### Files to Delete (after conversion)
- `plugins/claude-paper/src/web/components/VSCodeButton.vue`
- `plugins/claude-paper/src/web/components/PaperCard.vue`
- `plugins/claude-paper/src/web/components/FileTreeNode.vue`
- `plugins/claude-paper/src/web/components/PaperContent.vue`
- `plugins/claude-paper/src/web/pages/index.vue`
- `plugins/claude-paper/src/web/pages/papers/[slug].vue`

---

## Order of Operations

### Sequence 1: Setup (Foundation)
1. Create `types/index.ts` with centralized types
2. Create `tsconfig.json`
3. Update `nuxt.config.ts` for JSX/TSX support
4. Update `package.json` with new dependencies
5. Install dependencies: `npm install`

### Sequence 2: Simple Components First
6. Convert `VSCodeButton.vue` → `VSCodeButton.tsx` (simplest)
7. Convert `PaperContent.vue` → `PaperContent.tsx` (simple)
8. Test these components work

### Sequence 3: Medium Complexity
9. Convert `PaperCard.vue` → `PaperCard.tsx`
10. Convert `FileTreeNode.vue` → `FileTreeNode.tsx` (recursive)
11. Test components work

### Sequence 4: Pages
12. Convert `pages/index.vue` → `pages/index.tsx`
13. Test home page works
14. Convert `pages/papers/[slug].vue` → `pages/papers/[slug].tsx` (most complex)
15. Test paper viewer works

### Sequence 5: Cleanup
16. Update composables to use centralized types
17. Fix API files error types
18. Run `npm run type-check` and fix errors
19. Run `npm run build`
20. Full manual testing
21. Delete old .vue files

---

## Success Criteria

- All components converted to `.tsx` files
- All styles extracted to `.module.css` files
- Zero `any` types (except properly narrowed error handlers)
- Centralized types in `types/index.ts`
- `npm run type-check` passes
- `npm run build` succeeds
- No runtime regressions
- All features work: paper list, paper viewer, file tree, markdown rendering, code highlighting

---

## Post-Refactoring Benefits

1. **Full TypeScript Coverage**: Type safety across entire codebase
2. **Better IDE Support**: Enhanced autocomplete and refactoring
3. **CSS Modules**: Scoped styles without Vue SFC dependency
4. **TSX Ecosystem**: Access to React-like patterns and libraries
5. **Consistent Code Style**: Uniform component structure
6. **Easier Testing**: TSX components can be tested with standard Vue test utilities

---

## TSX Pattern Reference

| Vue SFC Directive | TSX Equivalent |
|------------------|----------------|
| `v-if="condition"` | `{condition && <Element />}` |
| `v-else-if="x"` | `{x ? <A /> : <B />}` |
| `v-for="item in list"` | `{list.map(item => <Element key={item.id} />)}` |
| `@click="handler"` | `onClick={handler}` |
| `@click.stop` | `onClick={(e) => { e.stopPropagation(); handler(); }}` |
| `:class="{ active }"` | `class={[active && styles.active]}` |
| `v-model="value"` | `value={value} onUpdate:value={(v) => value = v}` |
| `<NuxtLink>` | Import from `#app` and use as `<NuxtLink>` |

---

## Estimated Time Investment

- **Phase 1 (Foundation):** 30 minutes
- **Phase 2 (Components):** 2 hours (4 components)
- **Phase 3 (Pages):** 1.5 hours (2 pages, [slug] is complex)
- **Phase 4 (Composables):** 20 minutes
- **Phase 5 (Testing):** 30 minutes

**Total:** ~4.5 hours
