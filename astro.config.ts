// @ts-check
import { defineConfig } from 'astro/config'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const getGitHash = (cwd = './') => {
  try {
    return execSync('git rev-parse HEAD', { cwd }).toString().trim()
  } catch (e) {
    console.error(e)
    return 'unknown'
  }
}

const getAllAssets = (dirPath: string, basePath = '/') => {
  let results: string[] = []
  const files = fs.readdirSync(dirPath)
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file)
    const relPath = path.join(basePath, file).replace(/\\/g, '/')

    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(getAllAssets(fullPath, relPath))
    } else {
      if (!file.endsWith('.html') && !file.endsWith('.map') && file !== 'sw.js') {
        results.push(relPath)
      }
    }
  })
  return results
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

  integrations: [
    {
      name: 'sw-builder',
      hooks: {
        'astro:config:setup': ({ updateConfig }) => {
          updateConfig({
            vite: {
              plugins: [
                {
                  name: 'sw-dev-proxy',
                  configureServer(server) {
                    server.middlewares.use((req, _, next) => {
                      if (req.url === '/sw.js') req.url = '/src/sw.ts'
                      next()
                    })
                  },
                },
              ],
            },
          })
        },
        'astro:build:done': async ({ dir, pages }) => {
          const swInPath = path.resolve(import.meta.dirname, 'src/sw.ts')
          const outDir = fileURLToPath(dir)

          const pageRoutes = pages.map((p) => {
            const route = '/' + p.pathname
            return route === '//' ? '/' : route
          })
          const assets = getAllAssets(outDir)

          await build({
            define: {
              __ASSETS_LIST__: JSON.stringify([...new Set([...pageRoutes, ...assets])]),
              __BUILD_VERSION__: JSON.stringify(Date.now().toString()),
            },
            build: {
              lib: {
                entry: swInPath,
                formats: ['es'],
                fileName: () => 'sw.js',
              },
              outDir,
              emptyOutDir: false,
              minify: true,
              sourcemap: false,
            },
            configFile: false,
          })
          console.log('✅ Service Worker compiled to dist/sw.js')
        },
      },
    },
  ],
})
