<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Note } from '@@/schemas/note'

const notes = ref<Note[]>([])
const loading = ref(false)
const selectedNote = ref<Note | null>(null)
const isEditing = ref(false)
const isCreating = ref(false)

const newNote = ref({
  title: '',
  content: '',
})

const loadNotes = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/notes/list')
    notes.value = response.notes || []
  } catch (error) {
    console.error('Failed to load notes:', error)
  } finally {
    loading.value = false
  }
}

const createNote = async () => {
  if (!newNote.value.title || !newNote.value.content) return
  
  try {
    const note = await $fetch('/api/notes/create', {
      method: 'POST',
      body: newNote.value,
    })
    notes.value.unshift(note)
    newNote.value = { title: '', content: '' }
    isCreating.value = false
  } catch (error) {
    console.error('Failed to create note:', error)
  }
}

const updateNote = async () => {
  if (!selectedNote.value) return
  
  try {
    const updated = await $fetch(`/api/notes/${selectedNote.value.id}`, {
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
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update note:', error)
  }
}

const deleteNote = async (id: string) => {
  if (!confirm('Are you sure you want to delete this note?')) return
  
  try {
    await $fetch(`/api/notes/${id}`, {
      method: 'DELETE',
    })
    notes.value = notes.value.filter(n => n.id !== id)
    if (selectedNote.value?.id === id) {
      selectedNote.value = null
    }
  } catch (error) {
    console.error('Failed to delete note:', error)
  }
}

const selectNote = (note: Note) => {
  selectedNote.value = { ...note }
  isEditing.value = false
}

onMounted(() => {
  loadNotes()
})
</script>

<template>
  <div class="flex h-screen bg-background">
    <!-- Sidebar -->
    <div class="w-80 border-r border-border bg-card flex flex-col">
      <div class="p-4 border-b border-border">
        <h2 class="text-xl font-bold mb-4">Notes</h2>
        <button
          @click="isCreating = true"
          class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          + New Note
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div v-if="loading" class="p-4 text-center text-muted-foreground">
          Loading...
        </div>
        <div v-else-if="notes.length === 0" class="p-4 text-center text-muted-foreground">
          No notes yet
        </div>
        <div
          v-for="note in notes"
          :key="note.id"
          @click="selectNote(note)"
          :class="[
            'p-4 border-b border-border cursor-pointer hover:bg-accent transition-colors',
            selectedNote?.id === note.id ? 'bg-accent' : ''
          ]"
        >
          <h3 class="font-semibold truncate">{{ note.title }}</h3>
          <p class="text-sm text-muted-foreground truncate mt-1">
            {{ note.content }}
          </p>
          <p class="text-xs text-muted-foreground mt-2">
            {{ new Date(note.updatedAt || note.createdAt).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Create Note Modal -->
      <div v-if="isCreating" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-card p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
          <h3 class="text-xl font-bold mb-4">Create New Note</h3>
          <input
            v-model="newNote.title"
            placeholder="Note title..."
            class="w-full px-4 py-2 border border-border rounded-md mb-4 bg-background"
          />
          <textarea
            v-model="newNote.content"
            placeholder="Note content..."
            rows="10"
            class="w-full px-4 py-2 border border-border rounded-md mb-4 bg-background resize-none"
          />
          <div class="flex gap-2 justify-end">
            <button
              @click="isCreating = false"
              class="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              @click="createNote"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>

      <!-- Note Viewer/Editor -->
      <div v-if="selectedNote" class="flex-1 flex flex-col p-6">
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <input
              v-if="isEditing"
              v-model="selectedNote.title"
              class="text-3xl font-bold w-full bg-transparent border-b border-border pb-2 mb-4"
            />
            <h1 v-else class="text-3xl font-bold mb-2">{{ selectedNote.title }}</h1>
            <p class="text-sm text-muted-foreground">
              Last updated: {{ new Date(selectedNote.updatedAt || selectedNote.createdAt).toLocaleString() }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              v-if="!isEditing"
              @click="isEditing = true"
              class="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
            >
              Edit
            </button>
            <button
              v-if="isEditing"
              @click="updateNote"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Save
            </button>
            <button
              v-if="isEditing"
              @click="isEditing = false; selectNote(notes.find(n => n.id === selectedNote?.id)!)"
              class="px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deleteNote(selectedNote.id!)"
              class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto">
          <textarea
            v-if="isEditing"
            v-model="selectedNote.content"
            class="w-full h-full p-4 border border-border rounded-md bg-background resize-none"
          />
          <div v-else class="prose dark:prose-invert max-w-none">
            <p class="whitespace-pre-wrap">{{ selectedNote.content }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex-1 flex items-center justify-center text-muted-foreground">
        <div class="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mx-auto mb-4 opacity-50"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p class="text-lg">Select a note or create a new one</p>
        </div>
      </div>
    </div>
  </div>
</template>
