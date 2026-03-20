<script setup>
import { decryptText } from '@@/app/utils/crypto'
import { Lock } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.slug
const password = ref('')
const error = ref('')
const loading = ref(false)

definePageMeta({
  layout: 'home',
})

async function submit() {
  if (!password.value)
    return
  loading.value = true
  error.value = ''

  try {
    const data = await $fetch('/api/link/verify', {
      method: 'POST',
      body: {
        slug,
        password: password.value,
        query: route.query,
      },
    })

    if (data && data.url) {
      if (data.url.startsWith('ENC:')) {
        const decUrl = await decryptText(data.url, password.value)
        if (decUrl) {
          window.location.href = decUrl
        }
        else {
          error.value = 'Failed to decrypt URL internally. The password may be corrupted.'
        }
      }
      else {
        window.location.href = data.url
      }
    }
  }
  catch (e) {
    if (e.response?.status === 401) {
      error.value = 'Incorrect password'
    }
    else {
      error.value = e.message || 'An error occurred'
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="relative h-full w-full flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-950">
    <div class="z-10 relative flex w-[90svw] max-w-sm flex-col">
      <Card class="backdrop-blur-xl bg-background shadow-2xl">
        <CardHeader class="flex flex-col items-center">
          <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Lock class="h-6 w-6 text-primary" />
          </div>
          <CardTitle class="text-2xl font-bold">
            Protected Link
          </CardTitle>
          <CardDescription class="text-center">
            This link requires a password to access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="submit">
            <div class="space-y-2">
              <Input
                v-model="password"
                type="password"
                placeholder="Enter password"
                autofocus
                :disabled="loading"
              />
              <p v-if="error" class="text-sm text-destructive text-center">
                {{ error }}
              </p>
            </div>

            <Button class="w-full" type="submit" :disabled="loading || !password">
              <span v-if="loading" class="animate-pulse">Verifying...</span>
              <span v-else>Unlock Link</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <div class="mt-8 flex justify-center">
        <a href="/">
          <img
            src="/icon.png"
            alt="Sink"
            class="h-8 grayscale opacity-50 transition-opacity hover:opacity-100"
          >
        </a>
      </div>
    </div>
  </main>
</template>
