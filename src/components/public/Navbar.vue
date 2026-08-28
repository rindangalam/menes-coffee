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
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
      isScrolled
        ? 'pt-3 bg-transparent'
        : 'pt-6 bg-transparent'
    ]"
  >
    <div
      class="mx-auto max-w-container-xl px-4"
    >
      <div
        :class="[
          'transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-token-full',
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-glass border border-warm-100/80'
            : 'bg-transparent border border-transparent'
        ]"
      >
        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center justify-between h-16 px-6" aria-label="Navigasi utama">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-3 group" aria-label="Menes Coffee & Eatery - Beranda">
            <div class="p-1 rounded-token-full bg-white shadow-token-sm group-hover:scale-105 transition-transform duration-300">
              <img src="/logo/logo.png" alt="Menes Coffee & Eatery Logo" class="h-9 w-auto" />
            </div>
            <div class="flex flex-col leading-none">
              <span class="font-serif text-xl text-ink-900">Menes</span>
              <span class="text-[10px] uppercase tracking-[0.2em] text-ink-500 mt-0.5">Coffee & Eatery</span>
            </div>
          </router-link>

          <!-- Nav Links -->
          <div class="flex items-center gap-1">
            <router-link
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="relative px-4 py-2 text-sm font-medium text-ink-700 hover:text-brand-600 transition-colors duration-300 rounded-token-full"
              :class="{ 'text-brand-600 bg-brand-50': route.path === link.path }"
            >
              {{ link.label }}
            </router-link>
          </div>

          <!-- CTA Buttons -->
          <div class="flex items-center gap-3">
            <router-link to="/reservasi" class="btn-primary px-5 py-2.5">
              Reservasi
              <span class="w-6 h-6 rounded-token-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <Icons name="ArrowUpRightIcon" class="w-3.5 h-3.5" />
              </span>
            </router-link>
            <a
              href="https://instagram.com/menescoffee"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-token-full border border-warm-200 bg-white/60 hover:bg-white hover:border-brand-300 flex items-center justify-center text-ink-700 hover:text-brand-600 transition-all duration-300"
              aria-label="Instagram Menes Coffee"
            >
              <Icons name="PhotoIcon" class="w-5 h-5" />
            </a>
          </div>
        </nav>

        <!-- Mobile Top Bar -->
        <div class="lg:hidden flex items-center justify-between h-16 px-4">
          <router-link to="/" class="flex items-center gap-2" aria-label="Menes Coffee & Eatery - Beranda">
            <div class="p-0.5 rounded-token-full bg-white shadow-token-sm">
              <img src="/logo/logo.png" alt="Menes Coffee & Eatery Logo" class="h-7 w-auto" />
            </div>
            <span class="font-serif text-lg text-ink-900">Menes</span>
          </router-link>

          <button
            type="button"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="w-10 h-10 rounded-token-full flex flex-col items-center justify-center gap-[5px] focus:outline-none"
            :class="mobileMenuOpen ? 'bg-white/10' : 'bg-white/70 border border-warm-200'"
            :aria-label="mobileMenuOpen ? 'Tutup menu' : 'Buka menu'"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu"
          >
            <span class="block w-[18px] h-[2px] bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]" :class="mobileMenuOpen ? 'translate-y-[7px] rotate-45' : 'text-ink-900'" />
            <span class="block w-[18px] h-[2px] bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]" :class="mobileMenuOpen ? 'opacity-0' : 'text-ink-900'" />
            <span class="block w-[18px] h-[2px] bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]" :class="mobileMenuOpen ? '-translate-y-[7px] -rotate-45' : 'text-ink-900'" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Fullscreen Overlay -->
    <Transition name="menu-fade">
      <div
        v-if="mobileMenuOpen"
        id="mobile-menu"
        class="fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-2xl flex flex-col lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
      >
        <div class="flex-1 overflow-y-auto px-6 pt-28 pb-10 space-y-1">
          <router-link
            v-for="(link, i) in mobileNavLinks"
            :key="link.path"
            :to="link.external ? undefined : link.path"
            :href="link.external ? link.path : undefined"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            @click="link.external || closeMobileMenu()"
            class="flex items-center justify-between px-4 py-4 text-2xl font-serif transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            :class="link.highlight
              ? 'bg-brand-600 text-white rounded-token-2xl mt-4'
              : 'text-ink-200 hover:text-white hover:bg-white/5 rounded-token-2xl'"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            {{ link.label }}
            <Icons v-if="link.external" name="UploadIcon" class="w-6 h-6 opacity-50" />
            <Icons v-else name="ArrowUpRightIcon" class="w-6 h-6 opacity-40" />
          </router-link>
        </div>

        <div class="p-6 border-t border-white/10">
          <div class="flex items-center gap-3">
            <span class="text-ink-400 text-sm">Ikuti kami</span>
            <a href="https://instagram.com/menescoffee" target="_blank" rel="noopener noreferrer" class="w-11 h-11 bg-white/10 hover:bg-brand-600 rounded-token-full flex items-center justify-center transition-colors">
              <Icons name="PhotoIcon" class="w-5 h-5" />
            </a>
            <a href="https://tiktok.com/@menescoffee" target="_blank" rel="noopener noreferrer" class="w-11 h-11 bg-white/10 hover:bg-brand-600 rounded-token-full flex items-center justify-center transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.32, 0.72, 0, 1);
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
