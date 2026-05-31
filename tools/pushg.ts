// pushg.ts
// Publishes the contents of public/ to a GitHub repo
//

import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import * as build from './build'

const PUBLIC = path.join(build.ROOT, 'public')

const pkg = await Bun.file(path.join(build.ROOT, 'package.json')).json()
const repo = pkg.app?.servingRepo
if (!repo) {
  console.error('No app.servingRepo configured in package.json')
  process.exit(1)
}

const swPath = path.join(PUBLIC, 'sw.js')
if (!fs.existsSync(swPath)) {
  console.error('public/ is empty — run pub:build first')
  process.exit(1)
}

const sw = fs.readFileSync(swPath, 'utf-8')
const match = sw.match(/CACHE_NAME\s*=\s*'app-(\d{8}T\d{6})'/)
if (!match) {
  console.error('Could not parse build timestamp from public/sw.js')
  process.exit(1)
}
const timestamp = match[1]

function run(cmd: string[], cwd: string) {
  const result = Bun.spawnSync(cmd, { cwd, stdout: 'pipe', stderr: 'pipe' })
  if (result.exitCode !== 0) {
    throw new Error(result.stderr.toString())
  }
  return result.stdout.toString().trim()
}

// Use a throwaway repo so the serving repo gets a single clean commit
// with only build artifacts
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `pushg-${timestamp}-`))
try {
  fs.cpSync(PUBLIC, tmp, { recursive: true })
  run(['git', 'init'], tmp)
  run(['git', 'add', '.'], tmp)
  run(['git', 'commit', '-m', `Deploy ${timestamp}`], tmp)
  run(['git', 'push', '--force', repo, 'HEAD:main'], tmp)
  console.log(`Published to ${repo}`)
}
finally {
  fs.rmSync(tmp, { recursive: true, force: true })
}
