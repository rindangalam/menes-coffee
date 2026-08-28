<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Badge from '@/components/ui/Badge.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import Icons from '@/components/ui/Icons.vue'

const messages = ref([])
const loading = ref(true)
const showDetailModal = ref(false)
const selectedMessage = ref(null)
const markingRead = ref(null)

const formatDateTime = (dateTimeStr) => {
  return new Date(dateTimeStr).toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const fetchMessages = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    messages.value = data || []
  } catch (err) {
    console.error('Failed to load messages:', err)
  } finally {
    loading.value = false
  }
}

const viewMessage = (msg) => {
  selectedMessage.value = msg
  showDetailModal.value = true

  // Auto mark as read when viewed
  if (!msg.is_read) {
    markAsRead(msg.id)
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedMessage.value = null
}

const markAsRead = async (id) => {
  markingRead.value = id
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id)

    if (error) throw error

    const idx = messages.value.findIndex(m => m.id === id)
    if (idx !== -1) {
      messages.value[idx].is_read = true
    }

    if (selectedMessage.value?.id === id) {
      selectedMessage.value.is_read = true
    }
  } catch (err) {
    console.error('Mark as read error:', err)
  } finally {
    markingRead.value = null
  }
}

onMounted(fetchMessages)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-serif text-3xl text-ink-900">Pesan Masuk</h1>
        <p class="text-ink-500 mt-1">Kelola pesan kontak dari pengunjung</p>
      </div>
    </div>

    <div class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="text-left text-sm text-ink-500 border-b border-ink-200 bg-ink-50">
            <th class="p-4 font-medium w-10"></th>
            <th class="p-4 font-medium">Nama</th>
            <th class="p-4 font-medium hidden md:table-cell">Email</th>
            <th class="p-4 font-medium">Pesan</th>
            <th class="p-4 font-medium">Waktu</th>
            <th class="p-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ink-200">
          <tr
            v-for="msg in messages"
            :key="msg.id"
            :class="[
              'hover:bg-ink-50 transition-colors',
              !msg.is_read ? 'bg-amber-50' : ''
            ]"
            @click="viewMessage(msg)"
          >
            <td class="p-4">
              <div v-if="!msg.is_read" class="w-2 h-2 bg-terracotta-600 rounded-full flex-shrink-0" aria-label="Belum dibaca" />
            </td>
            <td class="p-4 font-medium text-ink-900">{{ msg.name }}</td>
            <td class="p-4 hidden md:table-cell text-ink-600">{{ msg.email }}</td>
            <td class="p-4 text-ink-600 max-w-md truncate">{{ msg.message }}</td>
            <td class="p-4 text-ink-500 text-sm">{{ formatDateTime(msg.created_at) }}</td>
            <td class="p-4">
              <Badge :variant="msg.is_read ? 'confirmed' : 'pending'">
                {{ msg.is_read ? 'Dibaca' : 'Baru' }}
              </Badge>
            </td>
          </tr>
          <tr v-if="messages.length === 0">
            <td colspan="6" class="p-8 text-center text-ink-500">Belum ada pesan masuk</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <Modal v-model:modelValue="showDetailModal" :title="`Pesan dari ${selectedMessage?.name}`" @close="closeDetailModal" size="lg">
      <div v-if="selectedMessage" class="space-y-4">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="label">Nama</label>
            <p class="text-ink-900">{{ selectedMessage.name }}</p>
          </div>
          <div>
            <label class="label">Email</label>
            <p class="text-ink-900">{{ selectedMessage.email }}</p>
          </div>
          <div class="sm:col-span-2">
            <label class="label">Pesan</label>
            <p class="text-ink-600 whitespace-pre-wrap">{{ selectedMessage.message }}</p>
          </div>
          <div>
            <label class="label">Waktu</label>
            <p class="text-ink-600">{{ formatDateTime(selectedMessage.created_at) }}</p>
          </div>
          <div>
            <label class="label">Status</label>
            <Badge :variant="selectedMessage.is_read ? 'confirmed' : 'pending'" class="text-base px-3 py-1">
              {{ selectedMessage.is_read ? 'Dibaca' : 'Baru' }}
            </Badge>
          </div>
        </div>
        <div class="pt-4 border-t border-ink-200 flex justify-end gap-3" v-if="!selectedMessage.is_read">
          <Button variant="primary" @click="markAsRead(selectedMessage.id)" :loading="markingRead === selectedMessage.id">
            <Icons name="CheckIcon" class="w-4 h-4" /> Tandai Dibaca
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>