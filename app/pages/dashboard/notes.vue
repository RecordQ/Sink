<script setup lang="ts">
import type { Note } from '@@/schemas/note'
import { computed, onMounted, ref, watch } from 'vue'

const notes = ref<Note[]>([])
const loading = ref(false)
const selectedNote = ref<Note | null>(null)
const searchQuery = ref('')

const filteredNotes = computed(() => {
  if (!searchQuery.value)
    return notes.value
  const query = searchQuery.value.toLowerCase()
  return notes.value.filter(note =>
    note.title.toLowerCase().includes(query)
    || note.content.toLowerCase().includes(query),
  )
})

async function loadNotes() {
  loading.value = true
  try {
    const response = await useAPI('/api/notes/list')
    notes.value = response.notes || []
    if (notes.value.length > 0 && !selectedNote.value) {
      selectedNote.value = { ...notes.value[0] }
    }
  }
  catch (error) {
    console.error('Failed to load notes:', error)
  }
  finally {
    loading.value = false
  }
}

async function createNewNote() {
  const newNote = {
    title: 'New Note',
    content: '',
  }

  try {
    const note = await useAPI('/api/notes/create', {
      method: 'POST',
      body: newNote,
    })
    notes.value.unshift(note)
    selectedNote.value = { ...note }
  }
  catch (error) {
    console.error('Failed to create note:', error)
  }
}

async function saveNote() {
  if (!selectedNote.value || !selectedNote.value.id)
    return

  try {
    const updated = await useAPI(`/api/notes/${selectedNote.value.id}`, {
      method: 'PUT',
      body: {
        title: selectedNote.value.title,
        content: selectedNote.value.content,
      },
    })
    const index = notes.value.findIndex(n => n.id === updated.id)
    if (index !== -1) {
      notes.value[index] = updated
    }
  }

  catch (error: any) {
    console.error('Failed to update note:', error)

    // If note not found, refresh the notes list
    if (error?.status === 404) {
      await loadNotes()
      // Clear selected note if it no longer exists
      if (selectedNote.value && !notes.value.find(n => n.id === selectedNote.value?.id)) {
        selectedNote.value = notes.value.length > 0
          ? {
              ...notes.value[0]!,
              title: notes.value[0]!.title || '',
              content: notes.value[0]!.content || '',
            }
          : null
      }
    }
  }
}

async function deleteNote(id: string) {
  // eslint-disable-next-line no-alert
  if (!confirm('Are you sure you want to delete this note?'))
    return

  try {
    await useAPI(`/api/notes/${id}`, {
      method: 'DELETE',
    })
    notes.value = notes.value.filter(n => n.id !== id)
    if (selectedNote.value?.id === id) {
      selectedNote.value = notes.value.length > 0
        ? {
            ...notes.value[0]!,
            title: notes.value[0]!.title || '',
            content: notes.value[0]!.content || '',
          }
        : null
    }
  }
  catch (error) {
    console.error('Failed to delete note:', error)
  }
}

function selectNote(note: Note) {
  selectedNote.value = { ...note }
}

// Auto-save on content change
watch(() => selectedNote.value?.content, () => {
  if (selectedNote.value?.id) {
    saveNote()
  }
}, { debounce: 1000 })

watch(() => selectedNote.value?.title, () => {
  if (selectedNote.value?.id) {
    saveNote()
  }
}, { debounce: 1000 })

onMounted(() => {
  loadNotes()
})
</script>

<template>
  <main class="space-y-6">
    <DashboardBreadcrumb title="Notes" />
    <DashboardNav />

    <div class="flex h-[calc(100vh-12rem)] bg-[#FFFBEF] font-sans rounded-lg overflow-hidden border border-[#E5D9C5]">
      <!-- Notes List -->
      <div class="w-80 border-r border-[#E5D9C5] bg-white flex flex-col">
        <!-- Toolbar -->
        <div class="p-3 border-b border-[#E5D9C5] flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800">
            Notes
          </h2>
          <button
            class="flex items-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors font-medium text-sm"
            @click="createNewNote"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Note
          </button>
        </div>

        <!-- Search -->
        <div class="p-3 border-b border-[#E5D9C5]">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          >
        </div>

        <!-- Notes List -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="loading" class="p-4 text-center text-gray-500 text-sm">
            Loading...
          </div>
          <div v-else-if="filteredNotes.length === 0" class="p-4 text-center text-gray-500 text-sm">
            {{ searchQuery ? 'No notes found' : 'No notes yet' }}
          </div>
          <div
            v-for="note in filteredNotes"
            :key="note.id"
            class="p-3 border-b border-gray-100 cursor-pointer transition-colors" :class="[
              selectedNote?.id === note.id ? 'bg-yellow-50' : 'hover:bg-gray-50',
            ]"
            @click="selectNote(note)"
          >
            <h3 class="font-semibold text-gray-900 truncate text-sm mb-1">
              {{ note.title || 'Untitled' }}
            </h3>
            <p class="text-xs text-gray-500 mb-1">
              {{ new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
            </p>
            <p class="text-xs text-gray-600 line-clamp-2">
              {{ note.content || 'No additional text' }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-2 border-t border-[#E5D9C5] text-center text-xs text-gray-500">
          {{ notes.length }} {{ notes.length === 1 ? 'Note' : 'Notes' }}
        </div>
      </div>

      <!-- Editor -->
      <div v-if="selectedNote" class="flex-1 flex flex-col">
        <!-- Toolbar -->
        <div class="px-6 py-3 border-b border-[#E5D9C5] flex items-center justify-between bg-[#FFFBEF]">
          <div class="text-xs text-gray-600">
            {{ new Date(selectedNote.updatedAt || selectedNote.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            }) }}
          </div>
          <div class="flex items-center gap-2">
            <button
              class="flex items-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors font-medium text-sm"
              @click="saveNote"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save
            </button>
            <button
              class="p-2 hover:bg-[#F5ECD7] rounded-md transition-colors text-gray-600 hover:text-red-600"
              title="Delete Note"
              @click="deleteNote(selectedNote.id!)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Note Content -->
        <div class="flex-1 overflow-y-auto px-6 py-6">
          <input
            v-model="selectedNote.title"
            placeholder="Title"
            class="w-full text-3xl font-bold mb-4 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
          >
          <textarea
            v-model="selectedNote.content"
            placeholder="Start typing..."
            class="w-full h-full bg-transparent border-none outline-none text-gray-800 text-base leading-relaxed resize-none placeholder-gray-400 font-normal"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex-1 flex items-center justify-center bg-[#FFFBEF]">
        <div class="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mx-auto mb-4 text-yellow-600 opacity-50"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p class="text-gray-600 text-lg">
            Select a note or create a new one
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
