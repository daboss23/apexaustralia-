// Generate display-ready sprint frames directly from the supplied 8K master.
// Frames 1–270, including the composited tunnel flight, remain untouched.
import { mkdir, chmod, stat, copyFile, readdir } from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { createGunzip } from 'node:zlib'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const cache = path.resolve('.next/cache/apex-sprint-4k-v1')
const output = path.resolve('public/hero-frames-hq')
await mkdir(cache, { recursive: true })
await mkdir(output, { recursive: true })
const source = path.join(cache, 'master-8k.mp4')
const binary = path.join(cache, 'ffmpeg')
const frames = path.join(cache, 'frames')
await mkdir(frames, { recursive: true })

async function download(url, destination, gzip = false) {
  const response = await fetch(url, { signal: AbortSignal.timeout(180000) })
  if (!response.ok || !response.body) throw new Error(`Download failed: ${response.status} ${url}`)
  const stream = Readable.fromWeb(response.body)
  if (gzip) await pipeline(stream, createGunzip(), createWriteStream(destination))
  else await pipeline(stream, createWriteStream(destination))
}
const size = async (p) => (await stat(p).catch(() => ({ size: 0 }))).size
if ((await size(source)) !== 232026345) {
  console.log('Downloading the original 7680×4320 sprint master')
  await download('https://github.com/daboss23/apexaustralia-/releases/download/untagged-b4ece9c6ca8656444408/Upscaled.Boss.Motion.scroll.vid.mp4', source)
  if ((await size(source)) !== 232026345) throw new Error('Unexpected 8K master size')
}
if (!(await size(binary))) {
  if (process.platform !== 'linux' || process.arch !== 'x64') throw new Error('Run this asset build on the Vercel Linux x64 builder')
  await download('https://github.com/eugeneware/ffmpeg-static/releases/download/b6.1.1/ffmpeg-linux-x64.gz', binary, true)
  await chmod(binary, 0o755)
}
const names = Array.from({ length: 87 }, (_, i) => `frame-${i + 271}.webp`)
const cached = new Set(await readdir(frames))
if (!names.every(name => cached.has(name))) {
  console.log('Extracting 87 3840×2160 frames at WebP quality 95 from the 8K master')
  // The existing sequence uses fps=16, source frame 1 -> hero frame 234.
  // Keep the same fps filter BEFORE trimming so timestamps align exactly.
  const result = spawnSync(binary, [
    '-y', '-hide_banner', '-loglevel', 'warning', '-threads', '2', '-i', source,
    '-vf', 'fps=16,trim=start_frame=37:end_frame=124,setpts=PTS-STARTPTS,scale=3840:2160:flags=lanczos',
    '-frames:v', '87', '-c:v', 'libwebp', '-quality', '95', '-compression_level', '4',
    '-threads', '2', '-start_number', '271', path.join(frames, 'frame-%03d.webp'),
  ], { stdio: 'inherit', timeout: 600000 })
  if (result.error || result.status !== 0) throw result.error || new Error('8K frame extraction failed')
}
for (const name of names) {
  if (!(await size(path.join(frames, name)))) throw new Error(`Missing frame: ${name}`)
  await copyFile(path.join(frames, name), path.join(output, name))
}
console.log('8K-derived 4K sprint assets ready; original tunnel sequence preserved')
