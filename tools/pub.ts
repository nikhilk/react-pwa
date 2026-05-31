// pub.ts
// Production build script — bundles and assembles into public/
//

import * as path from 'path'
import * as fs from 'fs'
import * as build from './build'

const PUBLIC = path.join(build.ROOT, 'public')

fs.rmSync(PUBLIC, { recursive: true, force: true })
fs.mkdirSync(PUBLIC, { recursive: true })

await build.downloadFonts(path.join(PUBLIC, 'fonts'))
await build.renderIcons(path.join(PUBLIC, 'icons'))

const result = await build.compile({
  outDir: PUBLIC,
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
})

if (!result.success) {
  console.error('Build failed:', result.logs)
  process.exit(1)
}

const buildTime = new Date()
let appStrings = await build.loadAppStrings({ buildTime })

// First pass: build everything except sw.js, which needs the full asset list
await build.copyStatic(PUBLIC, appStrings, ['sw.js'])

const assets = []
for (const file of new Bun.Glob('**/*').scanSync(PUBLIC)) {
  if (file === 'sw.js') {
    continue
  }
  assets.push('./' + file)
}
assets.sort()

// Glob only matches files; add root URL so the service worker caches it
// for offline navigation
assets.unshift('./')

// Reload appSettings with the full asset list as a result of building, and
// now generate the service worker precache manifest
appStrings = await build.loadAppStrings({ buildTime, assets })
let sw = await Bun.file(path.join(build.STATIC, 'sw.js')).text()
for (const [key, value] of Object.entries(appStrings)) {
  sw = sw.replaceAll(key, value)
}
await Bun.write(path.join(PUBLIC, 'sw.js'), sw)

console.log(`Build complete → public/ (${buildTime.toLocaleString()})`)
