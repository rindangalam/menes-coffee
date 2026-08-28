<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Icons from '@/components/ui/Icons.vue'
import { useSEO } from '@/composables/useSEO'

const { meta: seoMeta } = useSEO({
  title: 'Lokasi & Jam Buka - Menes Coffee & Eatery Padang',
  description: 'Temukan Menes Coffee & Eatery di Jl. Kartini No. 24, Padang. Buka setiap hari 08.00-04.00. Late night hangout spot dengan area indoor/outdoor, photobox, pet-friendly.',
})

const settings = ref({
  address: 'Jl. Kartini No. 24, Padang Pasir, Kec. Padang Barat, Kota Padang, Sumatera Barat',
  phone: '',
  email: '',
  instagram: 'https://instagram.com/menescoffee',
  google_maps: 'https://www.google.com/maps/place/Menes+Coffee+%26+Eatery+-+Padang/@-0.9406298,100.3597797,18z',
  opening_hours: {
    monday: { open: '08:00', close: '04:00', closed: false },
    tuesday: { open: '08:00', close: '04:00', closed: false },
    wednesday: { open: '08:00', close: '04:00', closed: false },
    thursday: { open: '08:00', close: '04:00', closed: false },
    friday: { open: '08:00', close: '04:00', closed: false },
    saturday: { open: '08:00', close: '04:00', closed: false },
    sunday: { open: '08:00', close: '04:00', closed: false },
  }
})

const days = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
  { key: 'sunday', label: 'Minggu' },
]

const getDayInfo = (dayKey) => {
  return settings.value.opening_hours[dayKey] || { open: '08:00', close: '04:00', closed: false }
}

const formatTime = (timeStr) => {
  if (!timeStr) return '08:00'
  const [hours, minutes] = timeStr.split(':')
  return `${hours}:${minutes}`
}

onMounted(async () => {
  try {
    const { data } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['address', 'phone', 'email', 'instagram', 'google_maps', 'opening_hours'])
    
    if (data) {
      data.forEach(item => {
        if (item.key === 'opening_hours') {
          settings.value.opening_hours = { ...settings.value.opening_hours, ...item.value }
        } else {
          settings.value[item.key] = item.value
        }
      })
    }
  } catch (err) {
    console.error('Failed to load location settings:', err)
  }
})
</script>

<template>
  <div class="min-h-screen">
    <section class="section bg-white border-b border-ink-100">
      <div class="container-main">
        <h1 class="font-serif text-4xl md:text-5xl text-ink-900 mb-2">Lokasi & Jam Buka</h1>
        <p class="text-ink-500">Temukan kami di jantung Padang</p>
      </div>
    </section>

    <section class="section bg-paper-50">
      <div class="container-main">
        <div class="grid lg:grid-cols-2 gap-12">
          <!-- Info Panel -->
          <div>
            <div class="card p-8 h-full">
              <h2 class="font-serif text-2xl md:text-3xl text-ink-900 mb-6">Kunjungi Kami</h2>
              
              <address class="text-ink-600 not-italic mb-8 leading-relaxed">
                <strong class="text-ink-900">Menes Coffee & Eatery</strong><br />
                {{ settings.address }}
              </address>

              <div class="space-y-4 mb-8">
                <div class="flex items-center gap-3 p-4 bg-ink-50 rounded-token-md">
                  <div class="w-10 h-10 bg-brand-100 rounded-token-md flex items-center justify-center flex-shrink-0">
                    <Icons name="CalendarIcon" class="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p class="font-medium text-ink-900">Alamat</p>
                    <p class="text-ink-600 text-sm">{{ settings.address }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-3 p-4 bg-ink-50 rounded-token-md">
                  <div class="w-10 h-10 bg-sage-100 rounded-token-md flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-ink-900">Jam Buka</p>
                    <p class="text-ink-600 text-sm">Setiap hari: 08.00 – 04.00</p>
                    <p class="text-brand-600 text-xs mt-1">Late night hangout spot</p>
                  </div>
                </div>

                <div class="flex items-center gap-3 p-4 bg-ink-50 rounded-token-md">
                  <div class="w-10 h-10 bg-accent-gold/20 rounded-token-md flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-ink-900">Kontak</p>
                    <p class="text-ink-600 text-sm">Hubungi via Instagram @menescoffee</p>
                  </div>
                </div>
              </div>

              <a
                :href="settings.google_maps"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary w-full"
              >
                <Icons name="CalendarIcon" class="w-5 h-5" />
                Buka di Google Maps
              </a>
            </div>
          </div>

          <!-- Map -->
          <div class="relative aspect-[4/3] rounded-token-xl overflow-hidden shadow-token-lg">
            <iframe
              :src="settings.google_maps.replace('place/', 'embed?pb=!1m18!1m12!1m3!1d3984.5!2d100.357!3d-0.9406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b8e8e8e8e8e8%3A0x8e8e8e8e8e8e8e8e!2sMenes%20Coffee%20%26%20Eatery!5e0!3m2!1sid!2sid!4v1234567890')"
              class="w-full h-full border-0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Lokasi Menes Coffee & Eatery di Google Maps"
            ></iframe>
          </div>
        </div>

        <!-- Opening Hours Detail -->
        <div class="mt-12">
          <h3 class="font-serif text-2xl text-ink-900 mb-6 text-center">Jam Operasional Detail</h3>
          <div class="grid grid-cols-2 md:grid-cols-7 gap-3">
            <div
              v-for="day in days"
              :key="day.key"
              class="card p-4 text-center"
            >
              <p class="font-medium text-ink-900 capitalize mb-1">{{ day.label }}</p>
              <p class="text-brand-600 font-semibold" v-if="!getDayInfo(day.key).closed">
                {{ formatTime(getDayInfo(day.key).open) }} – {{ formatTime(getDayInfo(day.key).close) }}
              </p>
              <p class="text-ink-400 text-sm" v-else>Tutup</p>
            </div>
          </div>
        </div>

        <!-- Identity Section -->
        <div class="mt-16 p-8 bg-ink-950 rounded-token-xl text-center text-white">
          <h3 class="font-serif text-2xl md:text-3xl mb-4">Bukan Cuma Tempat Ngopi</h3>
          <p class="text-ink-300 max-w-2xl mx-auto mb-6 leading-relaxed">
            Menes buka hingga jam 04:00 bukan sekadar angka jam — tapi identitas kami sebagai tempat nongkrong malam
            yang nyaman, aman, dan penuh suasana. Di sini jam malam terasa berbeda: lebih tenang, lebih dekat, lebih asik.
          </p>
          <div class="flex flex-wrap gap-3 justify-center">
            <span class="badge bg-ink-800 text-ink-300 border border-ink-700 px-3 py-1">Late Night Vibes</span>
            <span class="badge bg-ink-800 text-ink-300 border border-ink-700 px-3 py-1">Safe & Comfortable</span>
            <span class="badge bg-ink-800 text-ink-300 border border-ink-700 px-3 py-1">Perfect untuk Bukber</span>
            <span class="badge bg-ink-800 text-ink-300 border border-ink-700 px-3 py-1">Meeting Santai Malam</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>