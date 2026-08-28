<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Icons from '@/components/ui/Icons.vue'

const testimonials = ref([])
const loading = ref(true)
const updatingStatus = ref(null)

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

const statusLabel = (status) => {
  const labels = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak',
  }
  return labels[status] || status
}

const fetchTestimonials = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    testimonials.value = data || []
  } catch (err) {
    console.error('Failed to load testimonials:', err)
  } finally {
    loading.value = false
  }
}

const updateStatus = async (id, newStatus) => {
  updatingStatus.value = id
  try {
    const { error } = await supabase
      .from('testimonials')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) throw error

    const idx = testimonials.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      testimonials.value[idx].status = newStatus
    }
  } catch (err) {
    console.error('Update status error:', err)
    alert('Gagal mengupdate status')
  } finally {
    updatingStatus.value = null
  }
}

onMounted(fetchTestimonials)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-serif text-3xl text-ink-900">Manajemen Testimoni</h1>
        <p class="text-ink-500 mt-1">Moderasi review pelanggan</p>
      </div>
    </div>

    <div class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="text-left text-sm text-ink-500 border-b border-ink-200 bg-ink-50">
            <th class="p-4 font-medium">Pelanggan</th>
            <th class="p-4 font-medium">Rating</th>
            <th class="p-4 font-medium">Pesan</th>
            <th class="p-4 font-medium">Status</th>
            <th class="p-4 font-medium">Waktu</th>
            <th class="p-4 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ink-200">
          <tr v-for="test in testimonials" :key="test.id" class="hover:bg-ink-50">
            <td class="p-4 font-medium text-ink-900">{{ test.customer_name }}</td>
            <td class="p-4">
              <div class="flex items-center gap-1">
                <Icons name="StarIcon" v-for="i in 5" :key="i" :class="i <= test.rating ? 'w-4 h-4 fill-amber-400 text-amber-400' : 'w-4 h-4 text-ink-200'" />
              </div>
            </td>
            <td class="p-4 text-ink-600 max-w-md">{{ test.message }}</td>
            <td class="p-4">
              <Badge :variant="test.status">{{ statusLabel(test.status) }}</Badge>
            </td>
            <td class="p-4 text-ink-500 text-sm">{{ formatDateTime(test.created_at) }}</td>
            <td class="p-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <Button
                  v-if="test.status === 'pending'"
                  variant="primary"
                  size="sm"
                  :loading="updatingStatus === test.id"
                  @click="updateStatus(test.id, 'approved')"
                >
                  <Icons name="CheckIcon" class="w-4 h-4" /> Approve
                </Button>
                <Button
                  v-if="test.status === 'pending'"
                  variant="ghost"
                  size="sm"
                  class="text-brand-600 hover:bg-brand-50"
                  :loading="updatingStatus === test.id"
                  @click="updateStatus(test.id, 'rejected')"
                >
                  <Icons name="XIcon" class="w-4 h-4" /> Reject
                </Button>
              </div>
            </td>
          </tr>
          <tr v-if="testimonials.length === 0">
            <td colspan="6" class="p-8 text-center text-ink-500">Belum ada testimoni</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>