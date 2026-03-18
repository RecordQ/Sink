<script setup lang="ts">
</script>

<template>
  <main class="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
    <!-- Animated Gradient Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 opacity-80 animate-gradient-shift" />
    
    <!-- Floating Geometric Shapes -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Large circles -->
      <div class="absolute top-20 -left-20 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div class="absolute top-40 -right-20 w-80 h-80 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div class="absolute -bottom-20 left-1/3 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      
      <!-- Small accent shapes -->
      <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-lg rotate-12 opacity-20 animate-float" />
      <div class="absolute top-1/3 right-1/4 w-24 h-24 bg-pink-400 rounded-full opacity-30 animate-float animation-delay-1000" />
      <div class="absolute bottom-1/4 left-1/3 w-28 h-28 bg-cyan-400 rounded-lg -rotate-12 opacity-25 animate-float animation-delay-2000" />
    </div>

    <!-- Grid overlay -->
    <div class="absolute inset-0 bg-grid-pattern opacity-10" />

    <!-- Main Content -->
    <div class="relative z-10 text-center px-6 max-w-5xl">
      <!-- Title with gradient -->
      <h1 class="text-8xl md:text-9xl font-black mb-6 tracking-tighter">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 animate-gradient-x drop-shadow-2xl">
          URLify
        </span>
      </h1>
      
      <!-- Subtitle with glow -->
      <p class="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
        Shorten. Track. Analyze.
      </p>
      
      <p class="text-xl md:text-2xl text-white/90 mb-12 font-medium">
        Lightning-fast URL shortening powered by Cloudflare's global edge network ⚡
      </p>
      
      <!-- CTA Button -->
      <NuxtLink
        to="/dashboard"
        class="group relative inline-flex items-center gap-3 px-10 py-5 text-xl font-bold text-black bg-white rounded-full hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-white/50"
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
          <path d="M5 12h14"/>
          <path d="m12 5 7 7-7 7"/>
        </svg>
        <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity" />
      </NuxtLink>
      
      <!-- Feature badges -->
      <div class="mt-16 flex flex-wrap justify-center gap-4 text-white/80 text-sm font-semibold">
        <div class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          🚀 Instant Links
        </div>
        <div class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          📊 Real-time Analytics
        </div>
        <div class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          🔒 100% Secure
        </div>
        <div class="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          ☁️ Edge Computing
        </div>
      </div>
    </div>

    <!-- Decorative elements -->
    <div class="absolute top-10 left-10 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
    <div class="absolute bottom-10 right-10 w-3 h-3 bg-cyan-400 rounded-full animate-ping animation-delay-1000" />
    <div class="absolute top-1/2 left-10 w-2 h-2 bg-pink-400 rounded-full animate-ping animation-delay-2000" />
  </main>
</template>

<style scoped>
@keyframes gradient-shift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(20px, -30px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(30px, 10px) scale(1.05); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient-shift {
  animation: gradient-shift 10s ease infinite;
}

.animate-blob {
  animation: blob 7s ease-in-out infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-gradient-x {
  background-size: 200% auto;
  animation: gradient-x 3s linear infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
}
</style>
