<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Icons from '@/components/ui/Icons.vue'

const stats = ref({
  todayReservations: 0,
  unreadMessages: 0,
  pendingReservations: 0,
  availableMenu: 0,
})

const recentReservations = ref([])
const loading = ref(true)

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

const formatTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':')
  return `${hours}:${minutes}`
}

const statusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    confirmed: 'Dikonfirmasi',
    cancelled: 'Dibatalkan',
  }
  return labels[status] || status
}

const fetchDashboardData = async () => {
  loading.value = true
  const today = new Date().toISOString().split('T')[0]

  try {
    const [
      { count: todayReservations },
      { count: unreadMessages },
      { count: pendingReservations },
      { count: availableMenu },
      { data: recentRes },
    ] = await Promise.all([
      supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('reservation_date', today),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('menu_items').select('*', { count: 'exact', head: true }).eq('is_available', true),
      supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    stats.value.todayReservations = todayReservations || 0
    stats.value.unreadMessages = unreadMessages || 0
    stats.value.pendingReservations = pendingReservations || 0
    stats.value.availableMenu = availableMenu || 0
    recentReservations.value = recentRes || []
  } catch (err) {
    console.error('Failed to load dashboard:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboardData)
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-serif text-3xl text-ink-900">Dashboard</h1>
        <p class="text-ink-500 mt-1">Ringkasan aktivitas hari ini</p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-ink-500 text-sm mb-1">Reservasi Hari Ini</p>
            <p v-if="loading" class="font-serif text-3xl font-bold text-ink-900"><Skeleton variant="text" :lines="1" className="w-20" /></p>
            <p v-else class="font-serif text-3xl font-bold text-ink-900">{{ stats.todayReservations }}</p>
          </div>
          <div class="w-12 h-12 bg-terracotta-100 rounded-token-lg flex items-center justify-center">
            <Icons name="CalendarIcon" class="w-6 h-6 text-terracotta-600" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-ink-500 text-sm mb-1">Pesan Belum Dibaca</p>
            <p v-if="loading" class="font-serif text-3xl font-bold text-ink-900"><Skeleton variant="text" :lines="1" className="w-20" /></p>
            <p v-else class="font-serif text-3xl font-bold text-ink-900">{{ stats.unreadMessages }}</p>
          </div>
          <div class="w-12 h-12 bg-sage-100 rounded-token-lg flex items-center justify-center">
            <Icons name="ChatIcon" class="w-6 h-6 text-sage-600" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-ink-500 text-sm mb-1">Reservasi Pending</p>
            <p v-if="loading" class="font-serif text-3xl font-bold text-ink-900"><Skeleton variant="text" :lines="1" className="w-20" /></p>
            <p v-else class="font-serif text-3xl font-bold text-ink-900">{{ stats.pendingReservations }}</p>
          </div>
          <div class="w-12 h-12 bg-amber-100 rounded-token-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-ink-500 text-sm mb-1">Menu Tersedia</p>
            <p v-if="loading" class="font-serif text-3xl font-bold text-ink-900"><Skeleton variant="text" :lines="1" className="w-20" /></p>
            <p v-else class="font-serif text-3xl font-bold text-ink-900">{{ stats.availableMenu }}</p>
          </div>
          <div class="w-12 h-12 bg-ink-100 rounded-token-lg flex items-center justify-center">
            <Icons name="MenuIcon" class="w-6 h-6 text-ink-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions + Recent Reservations -->
    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Quick Actions -->
      <div class="lg:col-span-1 card p-6">
        <h2 class="font-semibold text-ink-900 mb-4">Aksi Cepat</h2>
        <div class="space-y-3">
          <Button variant="primary" full-width @click="$router.push('/admin/menu')">
            <Icons name="MenuIcon" class="w-5 h-5" /> Tambah Menu
          </Button>
          <Button variant="secondary" full-width @click="$router.push('/admin/promo')">
            <Icons name="MegaphoneIcon" class="w-5 h-5" /> Tambah Promo
          </Button>
          <Button variant="secondary" full-width @click="$router.push('/admin/reservasi')">
            <Icons name="CalendarIcon" class="w-5 h-5" /> Lihat Reservasi
          </Button>
          <Button variant="secondary" full-width @click="$router.push('/admin/pesan')">
            <Icons name="ChatIcon" class="w-5 h-5" /> Lihat Pesan
          </Button>
        </div>
      </div>

      <!-- Recent Reservations -->
      <div class="lg:col-span-2 card">
        <div class="p-6 border-b border-ink-200 flex items-center justify-between">
          <h2 class="font-semibold text-ink-900">Reservasi Terbaru</h2>
          <Button variant="ghost" size="sm" @click="$router.push('/admin/reservasi')">Lihat Semua</Button>
        </div>
        <div class="divide-y divide-ink-200">
          <div v-if="loading" class="p-6">
            <Skeleton variant="text" v-for="i in 5" :key="i" className="w-3/4" />
          </div>
          <template v-else>
            <div v-for="res in recentReservations" :key="res.id" class="p-4 hover:bg-ink-50 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-terracotta-100 rounded-token-full flex items-center justify-center">
                  <Icons name="CalendarIcon" class="w-5 h-5 text-terracotta-600" />
                </div>
                <div>
                  <p class="font-medium text-ink-900">{{ res.name }}</p>
                  <p class="text-ink-500 text-sm">{{ formatDate(res.reservation_date) }} · {{ formatTime(res.reservation_time) }} · {{ res.guest_count }} orang</p>
                </div>
              </div>
              <Badge :variant="res.status">
                {{ statusLabel(res.status) }}
              </Badge>
            </div>
            <div v-if="recentReservations.length === 0" class="p-6 text-center text-ink-500">
              Belum ada reservasi hari ini
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>