<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Icons from '@/components/ui/Icons.vue'

const router = useRouter()
const route = useRoute()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const scrolledThreshold = 100

const navLinks = [
  { path: '/menu', label: 'Menu' },
  { path: '/tentang', label: 'Tentang' },
  { path: '/galeri', label: 'Galeri' },
  { path: '/lokasi', label: 'Lokasi' },
  { path: '/kontak', label: 'Kontak' },
]

const mobileNavLinks = [
  ...navLinks,
  { path: '/promo', label: 'Promo' },
  { path: '/reservasi', label: 'Reservasi', highlight: true },
  { path: 'https://instagram.com/menescoffee', label: 'Instagram', external: true },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > scrolledThreshold
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    closeMobileMenu()
  }
}
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled
        ? 'bg-white/95 backdrop-blur-sm shadow-token-sm border-b border-ink-100'
        : 'bg-transparent'
    ]"
  >
    <!-- Desktop Nav -->
    <nav class="hidden lg:flex items-center justify-between h-16 px-6 max-w-container-2xl mx-auto" aria-label="Navigasi utama">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2" aria-label="Menes Coffee & Eatery - Beranda">
        <img src="/logo/logo.png" alt="Menes Coffee & Eatery Logo" class="h-8 w-auto" />
        <span class="font-serif text-xl text-ink-900 hidden sm:inline">Menes</span>
        <span class="text-ink-500 text-sm hidden sm:inline">Coffee & Eatery</span>
      </router-link>

      <!-- Nav Links -->
      <div class="flex items-center gap-1">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="px-3 py-2 text-sm font-medium text-ink-700 hover:text-terracotta-600 transition-colors rounded-token-md"
          :class="{ 'text-terracotta-600': route.path === link.path }"
        >
          {{ link.label }}
        </router-link>
      </div>

      <!-- CTA Buttons -->
      <div class="flex items-center gap-3">
        <router-link to="/reservasi" class="btn-primary hidden sm:inline-flex">
          <Icons name="CalendarIcon" class="w-4 h-4" />
          Reservasi
        </router-link>
        <a
          href="https://instagram.com/menescoffee"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-ghost p-2 hidden sm:flex"
          aria-label="Instagram Menes Coffee"
        >
          <Icons name="PhotoIcon" class="w-5 h-5" />
        </a>
      </div>
    </nav>

    <!-- Mobile Nav -->
    <div class="lg:hidden">
      <div class="flex items-center justify-between h-16 px-4">
        <router-link to="/" class="flex items-center gap-2" aria-label="Menes Coffee & Eatery - Beranda">
          <img src="/logo/logo.png" alt="Menes Coffee & Eatery Logo" class="h-6 w-auto" />
          <span class="font-serif text-lg text-ink-900">Menes</span>
        </router-link>

        <button
          type="button"
          @click="mobileMenuOpen = true"
          class="btn-ghost p-2"
          aria-label="Buka menu"
          aria-expanded="false"
          aria-controls="mobile-menu"
        >
          <Icons name="MenuIcon" class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Drawer -->
      <Transition name="drawer">
        <div
          v-if="mobileMenuOpen"
          id="mobile-menu"
          class="fixed inset-0 z-50 bg-ink-950 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
        >
          <!-- Drawer Header -->
          <div class="flex items-center justify-between p-4 border-b border-ink-800">
            <div class="flex items-center gap-2">
              <img src="/logo/logo.png" alt="Menes Coffee & Eatery Logo" class="h-8 w-auto" />
              <span class="font-serif text-xl text-white">Menes</span>
            </div>
            <button
              type="button"
              @click="closeMobileMenu"
              class="btn-ghost p-2 text-white hover:bg-white/10"
              aria-label="Tutup menu"
            >
              <Icons name="XIcon" class="w-6 h-6" />
            </button>
          </div>

          <!-- Drawer Links -->
          <nav class="flex-1 overflow-y-auto p-6 space-y-4" aria-label="Menu mobile">
            <router-link
              v-for="link in mobileNavLinks"
              :key="link.path"
              :to="link.external ? undefined : link.path"
              :href="link.external ? link.path : undefined"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener noreferrer' : undefined"
              @click="link.external || closeMobileMenu()"
              class="flex items-center justify-between px-4 py-4 text-base font-medium rounded-token-lg transition-colors"
              :class="link.highlight
                ? 'bg-terracotta-600 text-white'
                : 'text-ink-200 hover:bg-ink-800 hover:text-white'"
            >
              {{ link.label }}
              <Icons v-if="link.external" name="UploadIcon" class="w-5 h-5 opacity-50" />
            </router-link>
          </nav>

          <!-- Social Links -->
          <div class="p-4 border-t border-ink-800">
            <a
              href="https://instagram.com/menescoffee"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 px-4 py-3 text-ink-200 hover:text-white transition-colors"
            >
              <Icons name="PhotoIcon" class="w-6 h-6" />
              <span>Instagram @menescoffee</span>
            </a>
            <a
              href="https://tiktok.com/@menescoffee"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 px-4 py-3 text-ink-200 hover:text-white transition-colors mt-2"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>TikTok @menescoffee</span>
            </a>
          </div>
        </div>
      </Transition>

      <!-- Overlay -->
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-40 bg-ink-950/60 lg:hidden"
        @click="closeMobileMenu"
        aria-hidden="true"
      />
    </div>
  </header>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>