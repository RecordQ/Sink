<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, onUnmounted, ref } from 'vue'

const { title } = useAppConfig()
const canvasRef = ref<HTMLCanvasElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points
let animationId: number
let mouseX = 0
let mouseY = 0

function initThreeJS() {
  if (!canvasRef.value)
    return

  // Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xFFFFFF)

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  )
  camera.position.z = 50

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  // Create galaxy particles
  const particlesGeometry = new THREE.BufferGeometry()
  const particleCount = 8000

  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const colorPalette = [
    new THREE.Color(0xFF1493), // Pink
    new THREE.Color(0x00FFFF), // Cyan
    new THREE.Color(0xFFFF00), // Yellow
    new THREE.Color(0xFF00FF), // Magenta
    new THREE.Color(0x9370DB), // Purple
    new THREE.Color(0xFF69B4), // Hot pink
  ]

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3

    // Create spiral galaxy formation
    const radius = Math.random() * 50
    const spinAngle = radius * 0.5
    const branchAngle = ((i % 6) / 6) * Math.PI * 2

    const randomX = Math.random() ** 3 * (Math.random() < 0.5 ? 1 : -1) * 2
    const randomY = Math.random() ** 3 * (Math.random() < 0.5 ? 1 : -1) * 2
    const randomZ = Math.random() ** 3 * (Math.random() < 0.5 ? 1 : -1) * 2

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

    // Colorful particles
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]!
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // Particle material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  })

  particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  // Animation
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    // Rotate galaxy
    particles.rotation.y += 0.001
    particles.rotation.x += 0.0005

    // Mouse parallax
    camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05
    camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.05
    camera.lookAt(scene.position)

    renderer.render(scene, camera)
  }

  animate()

  // Handle window resize
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', handleResize)

  // Mouse movement
  const handleMouseMove = (event: MouseEvent) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1
    mouseY = (event.clientY / window.innerHeight) * 2 - 1
  }

  window.addEventListener('mousemove', handleMouseMove)

  return () => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', handleMouseMove)
  }
}

onMounted(() => {
  const cleanup = initThreeJS()
  onUnmounted(() => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    if (renderer) {
      renderer.dispose()
    }
    if (cleanup) {
      cleanup()
    }
  })
})
</script>

<template>
  <main class="relative h-screen w-screen flex items-center justify-center overflow-hidden bg-white">
    <!-- Three.js Canvas -->
    <canvas ref="canvasRef" class="fixed inset-0 w-screen h-screen" />

    <!-- Main Content -->
    <div class="relative z-10 text-center px-6 max-w-5xl">
      <!-- Title with gradient -->
      <h1 class="text-8xl md:text-9xl font-black mb-6 tracking-tighter">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 drop-shadow-lg">
          {{ title }}
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Shorten. Track. Analyze.
      </p>

      <p class="text-xl md:text-2xl text-gray-700 mb-12 font-medium">
        Lightning-fast URL shortening powered by Cloudflare ⚡
      </p>

      <!-- CTA Button -->
      <NuxtLink
        to="/dashboard"
        class="group relative inline-flex items-center gap-3 px-10 py-5 text-xl font-bold text-white bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-full hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50"
      >
        <span class="relative z-10">Open Dashboard</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="relative z-10 group-hover:translate-x-1 transition-transform"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </NuxtLink>

      <!-- Feature badges -->
      <div class="mt-16 flex flex-wrap justify-center gap-4 text-gray-700 text-sm font-semibold">
        <div class="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-md">
          🚀 Instant Links
        </div>
        <div class="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-md">
          📊 Real-time Analytics
        </div>
        <div class="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-md">
          🔒 100% Secure
        </div>
        <div class="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-md">
          ☁️ Edge Computing
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
canvas {
  display: block;
}
</style>
