// dev.ts
// Development build and optional dev server with SSE live reload
//

import * as fs from 'fs'
import * as path from 'path'
import * as build from './build'

const port = process.argv[2] ? parseInt(process.argv[2]) : 0
const BUILD = path.join(build.ROOT, 'build')

const appStrings = await build.loadAppStrings()
const clients = new Set<ReadableStreamDefaultController>()

function notifyClients() {
  for (const c of clients) {
    try {
      c.enqueue('data: reload\n\n')
    }
    catch {
      clients.delete(c)
    }
  }
}

async function rebuild() {
  const start = Date.now()
  try {
    const result = await build.compile({ outDir: BUILD, minify: false })
    if (!result.success) {
      console.error('Build failed:', result.logs)
      return
    }

    await build.copyStatic(BUILD, appStrings)

    console.log(`Built in ${Date.now() - start}ms`)
    notifyClients()
  }
  catch (e) {
    console.error('Build error:', e)
  }
}

await build.downloadFonts(path.join(BUILD, 'fonts'))
await build.renderIcons(path.join(BUILD, 'icons'))
await rebuild()

if (!port) {
  process.exit(0)
}

fs.watch(build.SRC, { recursive: true }, () => rebuild())
fs.watch(build.STATIC, { recursive: true }, () => rebuild())

const LIVE_RELOAD_SCRIPT =
  '<script>'
  + 'new EventSource("/__sse")'
  + '.addEventListener("message",()=>location.reload())'
  + '</script>'

// SSE connections are long-lived; avoid premature timeout with idleTimeout
Bun.serve({
  port,
  idleTimeout: 255,
  async fetch(req) {
    const url = new URL(req.url)

    if (url.pathname === '/__sse') {
      const stream = new ReadableStream({
        start(controller) {
          clients.add(controller)
          req.signal.addEventListener(
            'abort',
            () => clients.delete(controller),
          )
        },
      })
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }

    const reqPath = url.pathname === '/'
      ? '/index.html'
      : url.pathname

    try {
      const file = Bun.file(path.join(BUILD, reqPath))

      if (await file.exists()) {
        if (reqPath.endsWith('.html')) {
          const html = await file.text()
          return new Response(
            html.replace('</body>', `${LIVE_RELOAD_SCRIPT}</body>`),
            { headers: { 'Content-Type': 'text/html' } },
          )
        }
        return new Response(file)
      }

      // SPA fallback: serve index.html for unknown paths so client-side 
      // routing works
      const index = Bun.file(path.join(BUILD, 'index.html'))
      const html = await index.text()
      return new Response(
        html.replace('</body>', `${LIVE_RELOAD_SCRIPT}</body>`),
        { headers: { 'Content-Type': 'text/html' } },
      )
    }
    catch {
      // In case the index file has not been built yet.
      return new Response(
        `<html><body><p>Building…</p>${LIVE_RELOAD_SCRIPT}</body></html>`,
        { headers: { 'Content-Type': 'text/html' } },
      )
    }
  },
})

console.log(`Dev server running at http://localhost:${port}`)
