/**
 * Standalone Zero-Dependency Commit Snapshot Sync Script
 * Executed by GitHub Actions daily (or manually via workflow_dispatch).
 * Queries GitHub API (using GITHUB_TOKEN) and saves src/data/github-commits-snapshot.json.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const snapshotPath = path.join(rootDir, 'src', 'data', 'github-commits-snapshot.json')

const REPOSITORIES = [
  { owner: 'ahmed-husssain', repo: 'Online-Art-Gallery', branch: 'main' },
  { owner: 'ahmed-husssain', repo: 'ShifaMangementSystem', branch: 'main' },
  { owner: 'AhapraxAhmed', repo: 'mockrithm', branch: 'main' },
  { owner: 'ahmed-husssain', repo: 'RealEstate-', branch: 'main' },
  { owner: 'ahmed-husssain', repo: 'E-books', branch: 'main' },
]

function formatCommitDate(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ''
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
}

async function sync() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  const headers = {
    'User-Agent': 'Portfolio-Commit-Sync-Script',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  // Read existing snapshot for fallback
  let existing = { commits: {}, lastRefreshed: Date.now() }
  try {
    if (fs.existsSync(snapshotPath)) {
      existing = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'))
    }
  } catch {
    // ignore
  }

  const updatedCommits = { ...(existing.commits || {}) }
  let anyUpdated = false

  for (const repo of REPOSITORIES) {
    const key = `${repo.owner.toLowerCase()}/${repo.repo.toLowerCase()}`
    try {
      const url = `https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/commits?sha=${encodeURIComponent(repo.branch)}&per_page=1`
      const res = await fetch(url, { headers })
      if (!res.ok) {
        console.warn(`[sync] Failed to fetch ${key}: HTTP ${res.status}`)
        continue
      }
      const data = await res.json()
      if (Array.isArray(data) && data[0]?.commit) {
        const dateStr = data[0].commit.committer?.date || data[0].commit.author?.date
        const sha = (data[0].sha || '').slice(0, 7)
        if (dateStr && sha) {
          updatedCommits[key] = {
            sha,
            isoDate: dateStr,
            label: formatCommitDate(dateStr),
            branch: repo.branch,
          }
          anyUpdated = true
          console.log(`[sync] ${key} -> ${sha} (${dateStr})`)
        }
      }
    } catch (err) {
      console.warn(`[sync] Error fetching ${key}:`, err.message)
    }
  }

  if (anyUpdated || Object.keys(updatedCommits).length > 0) {
    const output = {
      commits: updatedCommits,
      lastRefreshed: Date.now(),
    }
    fs.writeFileSync(snapshotPath, JSON.stringify(output, null, 2) + '\n', 'utf-8')
    console.log(`[sync] Successfully updated snapshot at ${snapshotPath}`)
  }
}

sync()
