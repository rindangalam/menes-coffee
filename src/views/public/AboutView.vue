<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Icons from '@/components/ui/Icons.vue'
import { useSEO } from '@/composables/useSEO'

const { meta: seoMeta } = useSEO({
  title: 'Tentang Kami - Menes Coffee & Eatery Padang',
  description: 'Cerita di balik Menes Coffee & Eatery: ruang nyaman untuk mahasiswa, keluarga, dan teman-teman. Area indoor & outdoor luas, photobox, pet-friendly, buka hingga 04.00.',
})

let observer = null

const setupObserver = () => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
}

const values = [
  {
    title: 'Late Night',
    desc: 'Buka hingga 04:00 — ruang paling hidup saat kota mulai tenang.',
  },
  {
    title: 'Indoor & Outdoor',
    desc: 'Area luas yang nyaman untuk kerja, nongkrong, dan acara rombongan.',
  },
  {
    title: 'Keluarga & Hewan',
    desc: 'Ramah untuk keluarga, teman, dan hewan peliharaan kecil.',
  },
]

const ABOUT_FALLBACK = [
  { type: 'photo', src: '/images/about.jpg', poster: '', caption: 'Interior Menes Coffee & Eatery' },
  { type: 'photo', src: '/images/gallery-01-no-rush.jpg', poster: '', caption: 'No rush, no noise' },
  { type: 'video', src: '/images/candidates/reels/videos/DGaiFZRJxfv.mp4', poster: '/images/candidates/reels/DGaiFZRJxfv.jpg', caption: 'Cozy indoor, breezy outdoor' },
  { type: 'video', src: '/images/candidates/reels/videos/DIlfQBcSLiH.mp4', poster: '/images/candidates/reels/DIlfQBcSLiH.jpg', caption: 'No rush, no pressure' },
]

const aboutMedia = ref(ABOUT_FALLBACK.map(m => ({ ...m })))
const activeMedia = ref(0)
let mediaTimer = null

const goToMedia = (i) => {
  activeMedia.value = (i + aboutMedia.value.length) % aboutMedia.value.length
  restartMedia()
}

const nextMedia = () => goToMedia(activeMedia.value + 1)
const prevMedia = () => goToMedia(activeMedia.value - 1)

const restartMedia = () => {
  if (mediaTimer) clearInterval(mediaTimer)
  mediaTimer = setInterval(() => {
    activeMedia.value = (activeMedia.value + 1) % aboutMedia.value.length
  }, 7000)
}

const loadAboutMedia = async () => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('category', 'about')
      .order('sort_order', { ascending: true })

    if (error) throw error
    if (!data || data.length === 0) return

    aboutMedia.value = data.map(i => ({
      type: i.media_type || 'photo',
      src: i.media_type === 'video' ? i.video_url : i.image_url,
      poster: i.media_type === 'video' ? (i.image_url || undefined) : '',
      caption: i.caption || 'Menes Coffee & Eatery',
    }))
    activeMedia.value = 0
    restartMedia()
  } catch (err) {
    console.error('Failed to load about media:', err)
  }
}

onMounted(() => {
  setupObserver()
  restartMedia()
  loadAboutMedia()
  document.querySelectorAll('.will-animate').forEach(el => observer.observe(el))
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  if (mediaTimer) clearInterval(mediaTimer)
})
</script>

<template>
  <div class="min-h-screen">
    <section class="bg-white border-b border-ink-100 overflow-hidden">
      <div class="container-main py-token-4xl">
        <div class="max-w-3xl mx-auto text-center">
          <div class="eyebrow mb-6 animate-slide-up" style="--reveal-delay: 0ms;">Tentang Kami</div>
          <h1 class="font-serif text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] text-ink-900 mb-6 animate-slide-up" style="--reveal-delay: 120ms;">
            Ruang untuk
            <em class="text-brand-600" style="font-family: var(--font-serif); font-style: italic;">semua momen</em>
          </h1>
          <p class="text-lg text-ink-500 max-w-xl mx-auto animate-slide-up" style="--reveal-delay: 240ms;">
            Cerita di balik Menes Coffee & Eatery — tempat yang lahir dari keinginan menciptakan ruang yang benar-benar nyaman untuk semua orang.
          </p>
        </div>
      </div>
    </section>

    <section class="section bg-paper-50">
      <div class="container-main">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="relative aspect-[4/3] rounded-token-xl overflow-hidden shadow-token-lg will-animate">
            <!-- Media slides -->
            <div
              v-for="(m, i) in aboutMedia"
              :key="m.src"
              class="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
              :class="i === activeMedia ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            >
              <img
                v-if="m.type === 'photo'"
                :src="m.src"
                :alt="m.caption"
                class="w-full h-full object-cover"
                loading="eager"
              />
              <video
                v-else
                :src="m.src"
                :poster="m.poster || undefined"
                class="w-full h-full object-cover bg-ink-950"
                autoplay
                muted
                loop
                playsinline
                preload="metadata"
              ></video>
            </div>
            <div class="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-token-xl pointer-events-none"></div>

            <!-- Caption -->
            <div class="absolute bottom-4 left-4 z-10">
              <span :key="'alm-' + activeMedia" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-token-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-medium animate-fade-in">
                <Icons v-if="aboutMedia[activeMedia].type === 'video'" name="PlayIcon" class="w-3 h-3" />
                <Icons v-else name="PhotoIcon" class="w-3 h-3" />
                {{ aboutMedia[activeMedia].caption }}
              </span>
            </div>

            <!-- Arrows -->
            <button
              @click="prevMedia"
              aria-label="Media sebelumnya"
              class="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-token-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-colors"
            >
              <Icons name="ChevronLeftIcon" class="w-4 h-4" />
            </button>
            <button
              @click="nextMedia"
              aria-label="Media berikutnya"
              class="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-token-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-colors"
            >
              <Icons name="ChevronRightIcon" class="w-4 h-4" />
            </button>

            <!-- Dots -->
            <div class="absolute bottom-4 right-4 z-10 flex items-center gap-2">
              <button
                v-for="(m, i) in aboutMedia"
                :key="'adot-' + i"
                @click="goToMedia(i)"
                :aria-label="`Media ${i + 1}`"
                class="h-1.5 rounded-token-full transition-all duration-500"
                :class="i === activeMedia ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'"
              ></button>
            </div>
          </div>
          <div class="will-animate">
            <h2 class="font-serif text-3xl md:text-4xl text-ink-900 mb-6">Ruang untuk Semua Momen</h2>
            <p class="text-ink-600 leading-relaxed mb-6">
              Menes Coffee & Eatery lahir dari keinginan menciptakan tempat yang benar-benar nyaman untuk semua orang.
              Dari mahasiswa yang butuh tempat ngerjain tugas, anak muda yang mau nongkrong bareng temen-temen,
              keluarga yang mau makan malam bareng, hingga yang butuh tempat meeting santai atau acara spesial seperti buka bersama.
            </p>
            <p class="text-ink-600 leading-relaxed mb-8">
              Buka dari pagi hingga dini hari (08.00–04.00), kami hadir dengan menu yang beragam — kopi signature,
              makanan berat khas Padang, pizza, pasta, hingga dessert — semua dengan harga yang terjangkau.
            </p>
            <div class="flex flex-wrap gap-3">
              <span class="badge-available">Indoor & Outdoor Luas</span>
              <span class="badge-available">Late Night Sampai 04:00</span>
              <span class="badge-available">Photobox Aesthetic</span>
              <span class="badge-available">Pet Friendly</span>
              <span class="badge-available">Family Friendly</span>
            </div>
          </div>
        </div>

        <!-- Values -->
        <div class="grid md:grid-cols-3 gap-6 mt-20">
          <div
            v-for="(value, i) in values"
            :key="value.title"
            class="card p-8 will-animate"
            :style="{ '--reveal-delay': (i % 3) * 100 + 'ms' }"
          >
            <p class="text-[10px] uppercase tracking-[0.2em] text-brand-600 font-medium mb-3">0{{ i + 1 }}</p>
            <h3 class="font-serif text-2xl text-ink-900 mb-3">{{ value.title }}</h3>
            <p class="text-ink-600 leading-relaxed">{{ value.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>