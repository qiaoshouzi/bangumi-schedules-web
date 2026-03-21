// @ts-check
import { defineConfig } from 'astro/config'
import { execSync } from 'node:child_process'

const getGitHash = (cwd = './') => {
  try {
    return execSync('git rev-parse HEAD', { cwd }).toString().trim()
  } catch (e) {
    console.error(e)
    return 'unknown'
  }
}

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'always',
  server: {
    host: '0.0.0.0',
  },
  vite: {
    define: {
      'import.meta.env.PUBLIC_MAIN_GIT_HASH': JSON.stringify(getGitHash()),
      'import.meta.env.PUBLIC_DB_GIT_HASH': JSON.stringify(getGitHash('./db')),
    },
  },
})
