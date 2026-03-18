<script setup lang="ts">
import { ref, onMounted } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 20
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 20
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <main class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Parallax Background Layers -->
    <div 
      class="absolute inset-0 opacity-20"
      :style="{
        transform: `translate(${mouseX * 0.5}px, ${mouseY * 0.5}px)`
      }"
    >
      <div class="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30" />
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30" />
    </div>

    <div 
      class="absolute inset-0 opacity-10"
      :style="{
        transform: `translate(${mouseX * 1}px, ${mouseY * 1}px)`
      }"
    >
      <div class="absolute top-40 right-40 w-64 h-64 bg-pink-500 rounded-full blur-2xl opacity-40" />
      <div class="absolute bottom-40 left-40 w-64 h-64 bg-cyan-500 rounded-full blur-2xl opacity-40" />
    </div>

    <!-- Main Content -->
    <div 
      class="relative z-10 text-center px-6"
      :style="{
        transform: `translate(${mouseX * 1.5}px, ${mouseY * 1.5}px)`
      }"
    >
      <h1 class="text-7xl md:text-9xl font-bold text-white mb-8 tracking-tight">
        URLify
      </h1>
      <p class="text-2xl md:text-3xl text-slate-300 mb-12 max-w-2xl mx-auto">
        Modern URL Shortener with Analytics
      </p>
      
      <NuxtLink
        to="/dashboard"
        class="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 3v18h18"/>
          <path d="m19 9-5 5-4-4-3 3"/>
        </svg>
        Open Dashboard
      </NuxtLink>
    </div>

    <!-- Floating Elements -->
    <div 
      class="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full opacity-60"
      :style="{
        transform: `translate(${mouseX * 2}px, ${mouseY * 2}px)`
      }"
    />
    <div 
      class="absolute top-3/4 right-1/3 w-3 h-3 bg-purple-300 rounded-full opacity-60"
      :style="{
        transform: `translate(${-mouseX * 1.5}px, ${-mouseY * 1.5}px)`
      }"
    />
    <div 
      class="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-300 rounded-full opacity-60"
      :style="{
        transform: `translate(${mouseX * 3}px, ${-mouseY * 2}px)`
      }"
    />
  </main>
</template>
