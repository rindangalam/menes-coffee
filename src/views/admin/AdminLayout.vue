<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Icons from '@/components/ui/Icons.vue'
import { provide } from 'vue'

const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)
const user = ref(null)
const userRole = ref('staff')

const navItems = [
  { name: 'AdminDashboard', label: 'Dashboard', icon: 'HomeIcon' },
  { name: 'AdminMenu', label: 'Menu', icon: 'MenuIcon' },
  { name: 'AdminReservations', label: 'Reservasi', icon: 'CalendarIcon' },
  { name: 'AdminMessages', label: 'Pesan', icon: 'ChatIcon' },
  { name: 'AdminGallery', label: 'Galeri', icon: 'PhotoIcon' },
  { name: 'AdminTestimonials', label: 'Testimoni', icon: 'StarIcon' },
  { name: 'AdminPromo', label: 'Promo & Blog', icon: 'MegaphoneIcon' },
  { name: 'AdminSettings', label: 'Pengaturan', icon: 'SettingsIcon' },
]

const adminOnlyItems = [
  { name: 'AdminUsers', label: 'Admin Users', icon: 'UsersIcon' },
]

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/admin/login')
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    user.value = session.user
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('name, role')
      .eq('auth_uid', session.user.id)
      .single()
    if (adminUser) {
      userRole.value = adminUser.role
    }
  }
})

provide('sidebarOpen', sidebarOpen)
</script>

<template>
  <div class="min-h-screen bg-ink-50 flex">
    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-ink-950/60 z-40 lg:hidden"
      @click="sidebarOpen = false"
      aria-hidden="true"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-ink-200 transform transition-transform duration-300 ease-in-out flex flex-col',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      aria-label="Navigasi admin"
    >
      <div class="p-4 border-b border-ink-200 flex items-center gap-2">
        <img src="/logo/logo.png" alt="Menes Coffee & Eatery Logo" class="h-8 w-auto" />
        <div>
          <h1 class="font-serif text-xl text-ink-900">Menes Admin</h1>
          <p class="text-xs text-ink-500 mt-1">Coffee & Eatery</p>
        </div>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto" role="navigation" aria-label="Menu utama">
        <div class="px-3 py-2 text-xs font-semibold text-ink-500 uppercase tracking-wider">Utama</div>
        <button
          v-for="item in navItems"
          :key="item.name"
          :class="[
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-token-md text-sm font-medium transition-colors',
            route.name === item.name
              ? 'bg-brand-50 text-brand-700'
              : 'text-ink-700 hover:bg-ink-100'
          ]"
          @click="router.push({ name: item.name })"
        >
          <Icons :name="item.icon" class="w-5 h-5 flex-shrink-0" />
          {{ item.label }}
        </button>
      </nav>

      <nav v-if="userRole === 'superadmin'" class="p-4 space-y-1 border-t border-ink-200" role="navigation" aria-label="Menu sistem">
        <div class="px-3 py-2 text-xs font-semibold text-ink-500 uppercase tracking-wider">Sistem</div>
        <button
          v-for="item in adminOnlyItems"
          :key="item.name"
          :class="[
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-token-md text-sm font-medium transition-colors',
            route.name === item.name
              ? 'bg-brand-50 text-brand-700'
              : 'text-ink-700 hover:bg-ink-100'
          ]"
          @click="router.push({ name: item.name })"
        >
          <Icons :name="item.icon" class="w-5 h-5 flex-shrink-0" />
          {{ item.label }}
        </button>
      </nav>

      <div class="p-4 border-t border-ink-200">
        <div class="flex items-center gap-3 px-3 py-2 mb-2">
          <div class="w-8 h-8 bg-brand-100 rounded-token-full flex items-center justify-center">
            <svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ink-900 truncate">{{ user?.email || 'Admin' }}</p>
            <p class="text-xs text-ink-500 capitalize">{{ userRole }}</p>
          </div>
        </div>
        <Button variant="ghost" full-width @click="logout">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </Button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 lg:ml-0">
      <!-- Top Header -->
      <header class="sticky top-0 z-30 bg-white border-b border-ink-200 lg:hidden">
        <div class="flex items-center justify-between h-16 px-4">
          <button
            type="button"
            @click="sidebarOpen = true"
            class="btn-ghost p-2"
            aria-label="Buka menu"
            aria-expanded="false"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="font-serif text-lg text-ink-900">Menes Admin</h1>
          <div class="w-10" />
        </div>
      </header>

      <main class="flex-1 p-4 lg:p-8 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>