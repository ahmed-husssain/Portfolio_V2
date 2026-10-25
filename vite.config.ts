import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import githubCommitsHandler from './src/lib/github/apiHandler.ts'

function githubCommitsDevPlugin(): Plugin {
  return {
    name: 'github-commits-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/github-commits', async (req, res) => {
        try {
          await githubCommitsHandler(req, res)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Internal server error in dev api', message: String(err) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    mdx(),
    react(),
    tailwindcss(),
    githubCommitsDevPlugin(),
  ],
  server: {
    watch: {
      ignored: ['**/*.mp4', '**/*.log'],
    },
  },
})

