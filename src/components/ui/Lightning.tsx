'use client'

import { useEffect, useRef } from 'react'

/**
 * Lightning — a WebGL fragment shader that draws a branching electrical bolt.
 *
 * Adapted from the open-source "hero-odyssey" hero component. What changed, and
 * why, because all of it matters on this page:
 *
 * - **It cleaned up nothing.** The original's effect returned without cancelling
 *   its `requestAnimationFrame`, so every prop change started a *second* render
 *   loop over the same canvas and neither ever stopped — on a route with a
 *   colour slider that is a loop per drag. It also never deleted the program,
 *   shaders or buffer. Both are fixed; the loop is cancelled and the GL objects
 *   are released on unmount.
 * - **It resized the canvas every frame.** `resizeCanvas()` ran inside `render`,
 *   so `clientWidth` — a forced layout — was read once per frame forever. Here
 *   the size is taken from a ResizeObserver, same as the film canvas next to it
 *   (see ScrollCinemaHero: a layout read from a rAF while GSAP is writing pin
 *   styles on the same frame is the jerkiest thing you can do to a scrub).
 * - **`paused`.** The bolt belongs to Act 0 only. Once the headline has split it
 *   is fully faded out, and a full-screen ten-octave fbm shader that nobody can
 *   see is pure heat. Paused stops the loop entirely.
 * - **`resolutionCap`.** The shader is fill-rate bound: cost scales with pixels,
 *   and it is 10 octaves of value noise *per pixel*. It is also a soft glow, so
 *   it survives being drawn small and stretched — the backing store is capped
 *   (700px longest side by default) and CSS scales it up. On a phone this is the
 *   difference between free and dropped frames.
 *
 * The look is otherwise the original shader, retuned to the brand: `hue` is
 * degrees, and 196 is T-Apex blue (#00AEEF).
 */
export type LightningProps = {
  /** Hue in degrees. 196 ≈ the brand blue. */
  hue?: number
  /** Horizontal position of the bolt, in ±1 clip space. 0 is centre. */
  xOffset?: number
  speed?: number
  intensity?: number
  /** Noise scale — higher is more, finer branches. */
  size?: number
  /** Stop the render loop. The last frame stays on the canvas. */
  paused?: boolean
  /** Cap on the backing store's longest side, in device pixels. */
  resolutionCap?: number
  className?: string
}

const VERT = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uHue;
uniform float uXOffset;
uniform float uSpeed;
uniform float uIntensity;
uniform float uSize;

#define OCTAVE_COUNT 10

vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

float hash11(float p) {
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 rotate2d(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, -s, s, c);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float a = hash12(ip);
    float b = hash12(ip + vec2(1.0, 0.0));
    float c = hash12(ip + vec2(0.0, 1.0));
    float d = hash12(ip + vec2(1.0, 1.0));
    vec2 t = smoothstep(0.0, 1.0, fp);
    return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < OCTAVE_COUNT; ++i) {
        value += amplitude * noise(p);
        p *= rotate2d(0.45);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv = 2.0 * uv - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    uv.x += uXOffset;

    uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;

    float dist = abs(uv.x);
    vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
    vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
    gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, src: string, type: number) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // eslint-disable-next-line no-console
    console.error('Lightning shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function Lightning({
  hue = 196,
  xOffset = 0,
  speed = 1,
  intensity = 1,
  size = 1,
  paused = false,
  resolutionCap = 700,
  className,
}: LightningProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Live values the render loop reads, so changing a prop retunes the running
  // loop instead of tearing down the GL context and building a new one.
  const uniforms = useRef({ hue, xOffset, speed, intensity, size })
  uniforms.current = { hue, xOffset, speed, intensity, size }
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (!gl) return

    const vs = compile(gl, VERT, gl.VERTEX_SHADER)
    const fs = compile(gl, FRAG, gl.FRAGMENT_SHADER)
    if (!vs || !fs) return
    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      // eslint-disable-next-line no-console
      console.error('Lightning program link error:', gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const aPosition = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(aPosition)
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'iResolution')
    const uTime = gl.getUniformLocation(program, 'iTime')
    const uHue = gl.getUniformLocation(program, 'uHue')
    const uX = gl.getUniformLocation(program, 'uXOffset')
    const uSpeed = gl.getUniformLocation(program, 'uSpeed')
    const uIntensity = gl.getUniformLocation(program, 'uIntensity')
    const uSize = gl.getUniformLocation(program, 'uSize')

    // Sizing lives here, not in the frame loop. Cap the longest side; the bolt
    // is a glow, so drawing it small and letting CSS stretch it is invisible.
    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return
      const scale = Math.min(1, resolutionCap / Math.max(w, h))
      const bw = Math.max(1, Math.round(w * scale))
      const bh = Math.max(1, Math.round(h * scale))
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw
        canvas.height = bh
        gl.viewport(0, 0, bw, bh)
      }
    }
    resize()

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize)
      ro.observe(canvas)
    } else {
      window.addEventListener('resize', resize)
    }

    const start = performance.now()
    let raf = 0
    const render = () => {
      raf = requestAnimationFrame(render)
      if (pausedRef.current || !canvas.width) return
      const u = uniforms.current
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.uniform1f(uHue, u.hue)
      gl.uniform1f(uX, u.xOffset)
      gl.uniform1f(uSpeed, u.speed)
      gl.uniform1f(uIntensity, u.intensity)
      gl.uniform1f(uSize, u.size)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      ro?.disconnect()
      window.removeEventListener('resize', resize)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    // Props are read through refs, so the context is built exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolutionCap])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
