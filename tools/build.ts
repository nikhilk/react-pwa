// build.ts
// Shared build primitives: font download, icon rendering, JS/CSS compilation
//

import * as fs from 'fs'
import * as path from 'path'
import { Resvg } from '@resvg/resvg-js'

export const ROOT = path.join(import.meta.dir, '..')
export const SRC = path.join(ROOT, 'src')
export const STATIC = path.join(ROOT, 'static')

const FONTS: [string, string][] = [
  ['dm-sans-latin.woff2', 'https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K6z9mXg.woff2'],
  ['dm-sans-italic-latin.woff2', 'https://fonts.gstatic.com/s/dmsans/v17/rP2Wp2ywxg089UriCZaSExd86J3t9jz86MvyyKy58UfivUw.woff2'],
  ['dm-mono-latin.woff2', 'https://fonts.gstatic.com/s/dmmono/v16/aFTU7PB1QTsUX8KYthqQBK6PYK0.woff2'],
  ['dm-mono-italic-latin.woff2', 'https://fonts.gstatic.com/s/dmmono/v16/aFTW7PB1QTsUX8KYth-gBqSIQq_0Xg.woff2'],
]

const ICON_SIZES = [192, 512]

type AppStringsOptions = {
  assets?: string[]
  buildTime?: Date
}

export async function loadAppStrings(options?: AppStringsOptions) {
  const pkg = await Bun.file(path.join(ROOT, 'package.json')).json()
  const app = pkg.app || {}

  // Compact timestamp (e.g. 20260531T143022) safe for use in cache names
  const timestamp = options?.buildTime
    ? options.buildTime.toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, '')
    : ''

  return {
    '{{APP_TITLE}}': app.title || 'App',
    '{{APP_NAME}}': app.name || 'App',
    '{{APP_SHORT_NAME}}': app.shortName || app.name || 'App',
    '{{APP_DESCRIPTION}}': app.description || '',
    '{{APP_THEME_COLOR}}': app.themeColor || '#000000',
    '{{APP_BACKGROUND_COLOR}}': app.backgroundColor || '#ffffff',
    '{{APP_CACHE_NAME}}': timestamp ? `app-${timestamp}` : 'app',
    '// APP_ASSETS': options?.assets ? options.assets.map((a) => `'${a}',`).join('\n  ') : '',
  } as Record<string, string>
}

export async function downloadFonts(outDir: string) {
  fs.mkdirSync(outDir, { recursive: true })
  for (const [name, url] of FONTS) {
    const dest = path.join(outDir, name)
    if (fs.existsSync(dest)) {
      continue
    }
    const res = await fetch(url)
    await Bun.write(dest, await res.arrayBuffer())
    console.log(`  ↓ ${name}`)
  }
}

export async function renderIcons(outDir: string) {
  const svg = fs.readFileSync(path.join(STATIC, 'icon.svg'), 'utf-8')
  fs.mkdirSync(outDir, { recursive: true })
  for (const size of ICON_SIZES) {
    const dest = path.join(outDir, `icon-${size}.png`)
    if (fs.existsSync(dest)) {
      continue
    }
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: size },
    })
    const png = resvg.render().asPng()
    fs.writeFileSync(dest, png)
    console.log(`  ■ icon-${size}.png`)
  }
}

export async function copyStatic(outDir: string, appStrings: Record<string, string>, skip?: string[]) {
  for (const file of new Bun.Glob('**/*').scanSync(STATIC)) {
    if (skip?.includes(file)) {
      continue
    }
    const src = Bun.file(path.join(STATIC, file))
    if (file.endsWith('.html') || file.endsWith('.json') || file.endsWith('.js')) {
      let content = await src.text()
      for (const [key, value] of Object.entries(appStrings)) {
        content = content.replaceAll(key, value)
      }
      await Bun.write(path.join(outDir, file), content)
    }
    else {
      await Bun.write(path.join(outDir, file), src)
    }
  }
}

type CompileOptions = {
  outDir: string
  minify: boolean
  define?: Record<string, string>
}

export async function compile(opts: CompileOptions) {
  const result = await Bun.build({
    entrypoints: [path.join(SRC, 'main.tsx')],
    outdir: opts.outDir,
    naming: 'main.js',
    minify: opts.minify,
    define: opts.define,
  })

  const tailwind = Bun.spawn(
    [
      'npx', '@tailwindcss/cli',
      '-i', path.join(SRC, 'styles.css'),
      '-o', path.join(opts.outDir, 'styles.css'),
      ...(opts.minify ? ['--minify'] : []),
    ],
    { stdout: 'ignore', stderr: 'pipe' },
  )
  await tailwind.exited

  return result
}
