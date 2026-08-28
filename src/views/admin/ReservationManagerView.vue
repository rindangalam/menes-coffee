<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Modal from '@/components/ui/Modal.vue'
import Icons from '@/components/ui/Icons.vue'

const reservations = ref([])
const loading = ref(true)
const showDetailModal = ref(false)
const selectedReservation = ref(null)
const updatingStatus = ref(null)

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const formatTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':')
  return `${hours}:${minutes}`
}

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
    pending: 'Pending',
    confirmed: 'Dikonfirmasi',
    cancelled: 'Dibatalkan',
  }
  return labels[status] || status
}

const fetchReservations = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    reservations.value = data || []
  } catch (err) {
    console.error('Failed to load reservations:', err)
  } finally {
    loading.value = false
  }
}

const updateStatus = async (id, newStatus) => {
  updatingStatus.value = id
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) throw error

    const idx = reservations.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      reservations.value[idx].status = newStatus
    }

    if (selectedReservation.value?.id === id) {
      selectedReservation.value.status = newStatus
    }
  } catch (err) {
    console.error('Update status error:', err)
    alert('Gagal mengupdate status')
  } finally {
    updatingStatus.value = null
  }
}

const viewDetail = (res) => {
  selectedReservation.value = res
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedReservation.value = null
}

onMounted(fetchReservations)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-serif text-3xl text-ink-900">Manajemen Reservasi</h1>
        <p class="text-ink-500 mt-1">Kelola reservasi meja pelanggan</p>
      </div>
    </div>

    <div class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="text-left text-sm text-ink-500 border-b border-ink-200 bg-ink-50">
            <th class="p-4 font-medium">Nama</th>
            <th class="p-4 font-medium hidden md:table-cell">Telepon</th>
            <th class="p-4 font-medium">Tanggal & Jam</th>
            <th class="p-4 font-medium hidden lg:table-cell">Tamu</th>
            <th class="p-4 font-medium">Status</th>
            <th class="p-4 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ink-200">
          <tr v-for="res in reservations" :key="res.id" class="hover:bg-ink-50">
            <td class="p-4 font-medium text-ink-900">{{ res.name }}</td>
            <td class="p-4 hidden md:table-cell text-ink-600">{{ res.phone }}</td>
            <td class="p-4">
              <div>
                <p class="font-medium text-ink-900">{{ formatDate(res.reservation_date) }}</p>
                <p class="text-ink-500 text-sm">{{ formatTime(res.reservation_time) }}</p>
              </div>
            </td>
            <td class="p-4 hidden lg:table-cell text-ink-600">{{ res.guest_count }} orang</td>
            <td class="p-4">
              <Badge :variant="res.status">{{ statusLabel(res.status) }}</Badge>
            </td>
            <td class="p-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <Button
                  v-if="res.status === 'pending'"
                  variant="primary"
                  size="sm"
                  :loading="updatingStatus === res.id"
                  @click="updateStatus(res.id, 'confirmed')"
                >
                  <Icons name="CheckIcon" class="w-4 h-4" /> Konfirmasi
                </Button>
                <Button
                  v-if="res.status !== 'cancelled'"
                  variant="ghost"
                  size="sm"
                  class="text-terracotta-600 hover:bg-terracotta-50"
                  :loading="updatingStatus === res.id"
                  @click="updateStatus(res.id, 'cancelled')"
                >
                  <Icons name="XIcon" class="w-4 h-4" /> Batalkan
                </Button>
                <Button variant="ghost" size="sm" @click="viewDetail(res)" aria-label="Detail {{ res.name }}">
                  <Icons name="EditIcon" class="w-4 h-4" />
                </Button>
              </div>
            </td>
          </tr>
          <tr v-if="reservations.length === 0">
            <td colspan="6" class="p-8 text-center text-ink-500">Belum ada reservasi</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <Modal v-model:modelValue="showDetailModal" :title="`Detail Reservasi - ${selectedReservation?.name}`" @close="closeDetailModal" size="lg">
      <div v-if="selectedReservation" class="space-y-4">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="label">Nama</label>
            <p class="text-ink-900">{{ selectedReservation.name }}</p>
          </div>
          <div>
            <label class="label">Telepon</label>
            <p class="text-ink-900">{{ selectedReservation.phone }}</p>
          </div>
          <div>
            <label class="label">Email</label>
            <p class="text-ink-900">{{ selectedReservation.email || '-' }}</p>
          </div>
          <div>
            <label class="label">Tanggal</label>
            <p class="text-ink-900">{{ formatDate(selectedReservation.reservation_date) }}</p>
          </div>
          <div>
            <label class="label">Jam</label>
            <p class="text-ink-900">{{ formatTime(selectedReservation.reservation_time) }}</p>
          </div>
          <div>
            <label class="label">Jumlah Tamu</label>
            <p class="text-ink-900">{{ selectedReservation.guest_count }} orang</p>
          </div>
          <div class="sm:col-span-2">
            <label class="label">Status</label>
            <Badge :variant="selectedReservation.status" class="text-base px-3 py-1">{{ statusLabel(selectedReservation.status) }}</Badge>
          </div>
          <div class="sm:col-span-2">
            <label class="label">Catatan</label>
            <p class="text-ink-600">{{ selectedReservation.notes || '-' }}</p>
          </div>
          <div class="sm:col-span-2">
            <label class="label">Dibuat</label>
            <p class="text-ink-600">{{ formatDateTime(selectedReservation.created_at) }}</p>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>