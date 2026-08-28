<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Icons from '@/components/ui/Icons.vue'

const settings = ref({
  business_name: 'Menes Coffee & Eatery',
  address: 'Jl. Kartini No. 24, Padang Pasir, Kec. Padang Barat, Kota Padang, Sumatera Barat',
  phone: '',
  email: '',
  instagram: 'https://instagram.com/menescoffee',
  tiktok: 'https://tiktok.com/@menescoffee',
  google_maps: 'https://www.google.com/maps/place/Menes+Coffee+%26+Eatery+-+Padang/@-0.9406298,100.3597797,18z',
  opening_hours: {}
})

const currentYear = new Date().getFullYear()

const footerLinks = {
  navigasi: [
    { label: 'Menu', path: '/menu' },
    { label: 'Tentang Kami', path: '/tentang' },
    { label: 'Galeri', path: '/galeri' },
    { label: 'Lokasi', path: '/lokasi' },
    { label: 'Kontak', path: '/kontak' },
  ],
  promo: [
    { label: 'Promo Terbaru', path: '/promo' },
  ]
}

const socials = [
  { href: 'instagram', icon: 'PhotoIcon', label: 'Instagram' },
  { href: 'tiktok', icon: 'tiktok', label: 'TikTok' },
  { href: 'google_maps', icon: 'CalendarIcon', label: 'Google Maps' },
]

onMounted(async () => {
  try {
    const { data } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['business_name', 'address', 'phone', 'email', 'instagram', 'tiktok', 'google_maps', 'opening_hours'])
    
    if (data) {
      data.forEach(item => {
        settings.value[item.key] = item.value
      })
    }
  } catch (err) {
    console.error('Failed to load footer settings:', err)
  }
})
</script>

<template>
  <footer class="bg-ink-950 text-white relative overflow-hidden">
    <!-- Glow accents -->
    <div class="absolute top-0 left-1/4 w-72 h-72 bg-brand-600/10 rounded-token-full blur-[100px] pointer-events-none"></div>

    <div class="container-main pt-token-5xl pb-token-xl relative z-10">
      <!-- Top: brand + CTA -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16 pb-12 border-b border-white/10">
        <div class="flex items-center gap-4">
          <div class="p-1 rounded-token-full bg-white/10 border border-white/10">
            <img src="/logo/logo.png" alt="Menes Coffee & Eatery Logo" class="h-14 w-auto" />
          </div>
          <div>
            <p class="font-serif text-3xl md:text-4xl text-white">{{ settings.business_name }}</p>
            <p class="text-ink-400 text-sm mt-1">Ngopi, makan & nongkrong sampai larut di Padang.</p>
          </div>
        </div>
        <router-link to="/reservasi" class="btn-primary px-6 py-3 self-start">
          Reservasi Sekarang
          <Icons name="ArrowUpRightIcon" class="w-4 h-4" />
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-token-2xl mb-token-4xl">
        <!-- Brand / Social Column -->
        <div class="lg:col-span-1">
          <div class="flex gap-3">
            <a
              :href="settings.instagram"
              target="_blank"
              rel="noopener noreferrer"
              class="w-11 h-11 bg-white/5 border border-white/10 rounded-token-full flex items-center justify-center hover:bg-brand-600 hover:border-brand-600 hover:-translate-y-0.5 transition-all duration-300"
              aria-label="Instagram"
            >
              <Icons name="PhotoIcon" class="w-5 h-5" />
            </a>
            <a
              :href="settings.tiktok"
              target="_blank"
              rel="noopener noreferrer"
              class="w-11 h-11 bg-white/5 border border-white/10 rounded-token-full flex items-center justify-center hover:bg-brand-600 hover:border-brand-600 hover:-translate-y-0.5 transition-all duration-300"
              aria-label="TikTok"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              :href="settings.google_maps"
              target="_blank"
              rel="noopener noreferrer"
              class="w-11 h-11 bg-white/5 border border-white/10 rounded-token-full flex items-center justify-center hover:bg-brand-600 hover:border-brand-600 hover:-translate-y-0.5 transition-all duration-300"
              aria-label="Google Maps"
            >
              <Icons name="CalendarIcon" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Navigasi Column -->
        <div>
          <h3 class="font-medium text-lg mb-5 relative pb-3 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-brand-500 after:rounded-token-full">Navigasi</h3>
          <nav aria-label="Navigasi footer">
            <ul class="space-y-3">
              <li v-for="link in footerLinks.navigasi" :key="link.path">
                <router-link
                  :to="link.path"
                  class="text-ink-400 hover:text-white transition-colors text-sm"
                >
                  {{ link.label }}
                </router-link>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Promo Column -->
        <div>
          <h3 class="font-medium text-lg mb-5 relative pb-3 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-brand-500 after:rounded-token-full">Promo & Event</h3>
          <nav aria-label="Promo footer">
            <ul class="space-y-3">
              <li v-for="link in footerLinks.promo" :key="link.path">
                <router-link
                  :to="link.path"
                  class="text-ink-400 hover:text-white transition-colors text-sm"
                >
                  {{ link.label }}
                </router-link>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Info Column -->
        <div>
          <h3 class="font-medium text-lg mb-5 relative pb-3 after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-brand-500 after:rounded-token-full">Informasi</h3>
          <address class="text-ink-400 not-italic text-sm leading-relaxed space-y-4">
            <div class="flex items-start gap-3">
              <Icons name="CalendarIcon" class="w-5 h-5 flex-shrink-0 mt-0.5 text-brand-400" />
              <span>{{ settings.address }}</span>
            </div>
            <div v-if="settings.phone" class="flex items-start gap-3">
              <svg class="w-5 h-5 flex-shrink-0 mt-0.5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a :href="`tel:${settings.phone}`" class="hover:text-white transition-colors">{{ settings.phone }}</a>
            </div>
            <div v-if="settings.email" class="flex items-start gap-3">
              <svg class="w-5 h-5 flex-shrink-0 mt-0.5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a :href="`mailto:${settings.email}`" class="hover:text-white transition-colors">{{ settings.email }}</a>
            </div>
          </address>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-white/10 mb-token-xl" />

      <!-- Bottom Bar -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-ink-500 text-sm">
        <p>&copy; {{ currentYear }} {{ settings.business_name }}. Hak cipta dilindungi.</p>
        <div class="flex items-center gap-6">
          <a
            :href="settings.instagram"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-brand-400 transition-colors"
          >
            Instagram
          </a>
          <a
            :href="settings.tiktok"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-brand-400 transition-colors"
          >
            TikTok
          </a>
          <router-link
            to="/kontak"
            class="hover:text-brand-400 transition-colors"
          >
            Hubungi Kami
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>
