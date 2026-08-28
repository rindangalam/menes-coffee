<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import MenuCard from '@/components/public/MenuCard.vue'
import Badge from '@/components/ui/Badge.vue'
import Icons from '@/components/ui/Icons.vue'
import { useSEO } from '@/composables/useSEO'

const featuredMenu = ref([])
const promos = ref([])
const testimonials = ref([])
const loading = ref(true)

// Scroll reveal
const revealEls = ref([])
let observer = null

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const now = new Date()

const validPromos = computed(() => {
  return promos.value.filter(post => {
    if (post.type !== 'promo') return true
    if (!post.valid_until) return true
    return new Date(post.valid_until) >= now
  })
})

const experienceItems = [
  {
    icon: 'HomeIcon',
    title: 'Indoor & Outdoor',
    desc: 'Area luas nyaman untuk nongkrong, meeting, atau acara rombongan',
    tone: 'brand',
  },
  {
    icon: '',
    title: 'Late Night',
    desc: 'Buka hingga jam 04:00 — tempat nongkrong malam favorit di Padang',
    tone: 'dark',
  },
  {
    icon: 'PhotoIcon',
    title: 'Photobox',
    desc: 'Spot foto aesthetic buat dokumentasi momen seru',
    tone: 'gold',
  },
  {
    icon: 'UsersIcon',
    title: 'Family & Pet Friendly',
    desc: 'Ramah untuk keluarga & hewan peliharaan kecil',
    tone: 'sage',
  },
]

const onReveal = () => {
  const els = document.querySelectorAll('.will-animate')
  els.forEach(el => observer.observe(el))
}

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

onMounted(async () => {
  setupObserver()
  onReveal()

  try {
    const [{ data: menuData }, { data: postsData }, { data: testData }] = await Promise.all([
      supabase
        .from('menu_items')
        .select(`
          *,
          categories (name)
        `)
        .eq('is_available', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(6),
      supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10),
      supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    if (menuData) {
      featuredMenu.value = menuData.map(item => ({
        ...item,
        category_name: item.categories?.name
      }))
    }

    if (postsData) {
      promos.value = postsData
    }

    if (testData) {
      testimonials.value = testData
    }
  } catch (err) {
    console.error('Failed to load home data:', err)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

// SEO
const { meta: seoMeta } = useSEO({
  title: 'Menes Coffee & Eatery - Padang | Ngopi, Makan, Nongkrong Sampai Larut',
  description: 'Menes Coffee & Eatery Padang - Tempat ngopi, makan, dan nongkrong sampai larut. Area indoor & outdoor luas, photobox, pet-friendly di jantung Padang. Buka 08.00-04.00.',
})
</script>

<template>
  <div class="min-h-screen bg-warm-50">
    <!-- Grain overlay -->
    <div class="grain-overlay" aria-hidden="true"></div>

    <!-- Hero Section -->
    <section class="relative min-h-[100dvh] flex items-end md:items-center overflow-hidden bg-ink-950 text-white">
      <!-- Background image with parallax scale -->
      <div class="absolute inset-0 z-0 will-change-transform">
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80"
          alt="Menes Coffee & Eatery interior"
          class="w-full h-full object-cover opacity-40 scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/30"></div>
      </div>

      <div class="relative z-10 container-main px-6 pt-32 pb-24 md:py-32 w-full">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-token-full bg-white/10 backdrop-blur-sm border border-white/15 mb-8 animate-slide-up" style="--reveal-delay: 0ms;">
            <span class="w-2 h-2 rounded-token-full bg-brand-400 animate-pulse"></span>
            <span class="text-[11px] uppercase tracking-[0.25em] font-medium text-ink-200">Buka setiap hari · 08.00 – 04.00</span>
          </div>

          <h1 class="font-serif text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.05] mb-6 animate-slide-up" style="--reveal-delay: 120ms;">
            Ngopi, makan,<br />
            <span class="text-brand-400 italic">nongkrong</span> sampai larut
          </h1>

          <p class="text-lg md:text-xl text-ink-300 max-w-2xl mb-10 animate-slide-up" style="--reveal-delay: 240ms;">
            Area indoor & outdoor luas, photobox, dan pet-friendly di jantung Padang. Kopi signature, makanan lokal hingga western — buka sampai dini hari.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 animate-slide-up" style="--reveal-delay: 360ms;">
            <Button size="lg" @click="$router.push('/menu')" class="hover:shadow-brand-glow">
              Lihat Menu
              <span class="w-7 h-7 bg-white/20 rounded-token-full flex items-center justify-center">
                <Icons name="ArrowUpRightIcon" class="w-3.5 h-3.5" />
              </span>
            </Button>
            <router-link
              to="/reservasi"
              class="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-lg font-medium rounded-token-full bg-transparent text-white border border-white/25 hover:bg-white/10 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
            >
              Reservasi Meja
              <Icons name="CalendarIcon" class="w-4 h-4" />
            </router-link>
          </div>
        </div>

        <!-- Floating stat chips -->
        <div class="hidden md:flex absolute bottom-8 right-8 lg:right-16 gap-4 animate-fade-in" style="animation-delay: 600ms;">
          <div class="px-4 py-3 rounded-token-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <p class="font-serif text-3xl text-white">04:00</p>
            <span class="text-[10px] uppercase tracking-widest text-ink-300">Buka sampai</span>
          </div>
          <div class="px-4 py-3 rounded-token-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <p class="font-serif text-3xl text-white">4.6</p>
            <span class="text-[10px] uppercase tracking-widest text-ink-300">Google Rating</span>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-400 animate-fade-in" style="animation-delay: 800ms;">
        <span class="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
        <div class="w-6 h-10 rounded-full border-2 border-ink-600 flex justify-center pt-2">
          <div class="w-1 h-2 rounded-token-full bg-ink-400 animate-bounce"></div>
        </div>
      </div>
    </section>

    <!-- Brand Statement -->
    <section class="py-24 md:py-32 bg-warm-50 relative">
      <div class="container-main">
        <div class="max-w-3xl mx-auto text-center will-animate">
          <span class="eyebrow mb-6">Tentang Kami</span>
          <h2 class="font-serif text-4xl md:text-5xl lg:text-6xl text-ink-900 mb-8">
            Ruang nyaman untuk <span class="italic text-brand-600">siapapun</span>
          </h2>
          <p class="text-ink-600 text-lg md:text-xl leading-relaxed">
            Menes Coffee & Eatery hadir sebagai ruang yang nyaman untuk siapapun — mahasiswa yang ngerjain tugas, anak muda yang nongkrong bareng temen-temen, keluarga yang mau makan malam bareng, hingga yang butuh tempat meeting santai. Buka dari pagi hingga dini hari, kami menyediakan menu kopi signature, makanan berat, pizza, pasta, dan dessert dengan harga terjangkau.
          </p>
        </div>
      </div>
    </section>

    <!-- Menes Experience - Asymmetric bento -->
    <section class="py-24 md:py-32 bg-paper-100 relative">
      <div class="container-main">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 will-animate">
          <div class="max-w-xl">
            <span class="eyebrow mb-6">Menes Experience</span>
            <h2 class="font-serif text-4xl md:text-5xl text-ink-900">Lebih dari sekadar <span class="italic text-brand-600">kopi</span></h2>
          </div>
          <p class="text-ink-500 mt-4 md:mt-0 max-w-sm">Setiap sudut Menes dirancang untuk bikin betah — dari pagi sampai larut malam.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <!-- Card 1: Large brand -->
          <div class="md:col-span-2 md:row-span-2 will-animate">
            <div class="bezel-outer h-full">
              <div class="bezel-inner p-8 md:p-12 flex flex-col justify-between min-h-[320px] md:min-h-[420px] bg-gradient-to-br from-ink-950 to-ink-800 text-white">
                <div class="w-14 h-14 rounded-token-2xl bg-brand-500/20 flex items-center justify-center mb-auto">
                  <Icons name="HomeIcon" class="w-7 h-7" />
                </div>
                <div>
                  <h3 class="font-serif text-2xl md:text-4xl mb-3">Indoor & Outdoor Luas</h3>
                  <p class="text-ink-300 max-w-md">Area yang nyaman untuk nongkrong, meeting, atau acara rombongan — indoor yang cozy, outdoor yang sejuk.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2: Photobox gold -->
          <div class="will-animate">
            <div class="bezel-outer h-full">
              <div class="bezel-inner p-8 flex flex-col justify-between min-h-[200px] bg-gradient-to-br from-amber-50 to-warm-50">
                <div class="w-12 h-12 rounded-token-2xl bg-accent-gold/25 flex items-center justify-center">
                  <Icons name="PhotoIcon" class="w-6 h-6 text-accent-gold" />
                </div>
                <div>
                  <h3 class="font-serif text-xl text-ink-900 mb-2">Photobox</h3>
                  <p class="text-ink-500 text-sm">Spot foto aesthetic buat dokumentasi momen seru.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 3: Dark late night -->
          <div class="will-animate">
            <div class="bezel-outer h-full">
              <div class="bezel-inner p-8 flex flex-col justify-between min-h-[200px] bg-ink-950 text-white">
                <div class="w-12 h-12 rounded-token-2xl bg-white/10 flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-serif text-xl mb-2">Late Night</h3>
                  <p class="text-ink-400 text-sm">Buka hingga jam 04:00 — nongkrong malam favorit.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 4: Sage family -->
          <div class="md:col-span-3 will-animate">
            <div class="bezel-outer">
              <div class="bezel-inner p-6 md:flex items-center justify-between gap-8 bg-white">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-token-2xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <Icons name="UsersIcon" class="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h3 class="font-serif text-lg md:text-xl text-ink-900">Family & Pet Friendly</h3>
                    <p class="text-ink-500 text-sm mt-0.5">Ramah untuk keluarga & hewan peliharaan kecil — bawa si kecil, bawa juga si menggemaskan.</p>
                  </div>
                </div>
                <div class="mt-4 md:mt-0 flex items-center gap-2 text-sage-700">
                  <span class="text-sm font-medium">Pet Friendly</span>
                  <Icons name="CheckIcon" class="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Menu -->
    <section class="py-24 md:py-32 bg-warm-50 relative">
      <div class="container-main">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 will-animate">
          <div class="max-w-xl">
            <span class="eyebrow mb-6">Menu Pilihan</span>
            <h2 class="font-serif text-4xl md:text-5xl text-ink-900">Favorit pengunjung & <span class="italic text-brand-600">rekomendasi kami</span></h2>
          </div>
          <Button variant="ghost" @click="$router.push('/menu')" class="mt-4 md:mt-0">
            Lihat Semua Menu
            <Icons name="ArrowUpRightIcon" class="w-4 h-4" />
          </Button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="featured-menu">
          <MenuCard
            v-for="(item, i) in featuredMenu"
            :key="item.id"
            :item="item"
            variant="featured"
            :class="['will-animate', { 'animate-visible': !loading }]"
            :style="{ transitionDelay: `${(i % 3) * 100}ms` }"
          />
          <Skeleton v-if="loading" variant="card" v-for="i in 6" :key="i" />
          <div v-if="!loading && featuredMenu.length === 0" class="col-span-full text-center py-12 text-ink-500">
            <Icons name="ImageIcon" class="w-12 h-12 mx-auto text-ink-300 mb-3" />
            <p>Belum ada menu pilihan</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Promo Section -->
    <section class="py-24 md:py-32 bg-paper-100 relative" v-if="validPromos.length > 0">
      <div class="container-main">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 will-animate">
          <div class="max-w-xl">
            <span class="eyebrow mb-6">Jangan Lewatkan</span>
            <h2 class="font-serif text-4xl md:text-5xl text-ink-900">Promo <span class="italic text-brand-600">Terbaru</span></h2>
          </div>
          <Button variant="ghost" @click="$router.push('/promo')" class="mt-4 md:mt-0">
            Lihat Semua Promo
            <Icons name="ArrowUpRightIcon" class="w-4 h-4" />
          </Button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="(post, i) in validPromos"
            :key="post.id"
            class="card group will-animate"
            :style="{ transitionDelay: `${(i % 3) * 100}ms` }"
          >
            <div class="relative aspect-[16/10] overflow-hidden">
              <img
                v-if="post.image_url"
                :src="post.image_url"
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                loading="lazy"
              />
              <div v-else class="w-full h-full bg-ink-100 flex items-center justify-center text-ink-400">
                <Icons name="MegaphoneIcon" class="w-12 h-12" />
              </div>
              <div class="absolute top-4 left-4 flex gap-2">
                <Badge variant="featured">Promo</Badge>
                <Badge v-if="post.valid_until" variant="pending" class="text-xs">
                  S/d {{ formatDate(post.valid_until) }}
                </Badge>
              </div>
            </div>
            <div class="p-6">
              <p class="text-ink-500 text-sm mb-2">{{ formatDate(post.published_at) }}</p>
              <h3 class="font-semibold text-ink-900 text-lg mb-2 line-clamp-2">{{ post.title }}</h3>
              <p class="text-ink-600 text-sm line-clamp-3 mb-4">{{ post.content }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-24 md:py-32 bg-warm-50 relative" v-if="testimonials.length > 0">
      <div class="container-main">
        <div class="text-center max-w-2xl mx-auto mb-16 will-animate">
          <span class="eyebrow mb-6">Testimoni</span>
          <h2 class="font-serif text-4xl md:text-5xl text-ink-900">Apa kata <span class="italic text-brand-600">pelanggan</span>?</h2>
          <p class="text-ink-500 mt-4">Review asli dari pengunjung Menes</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article
            v-for="(test, i) in testimonials"
            :key="test.id"
            class="card p-8 will-animate"
            :style="{ transitionDelay: `${(i % 3) * 100}ms` }"
          >
            <div class="flex items-center gap-1 mb-4">
              <Icons v-for="s in 5" :key="s" name="StarIcon" :class="s <= test.rating ? 'w-5 h-5 fill-amber-400 text-amber-400' : 'w-5 h-5 text-ink-200'" />
            </div>
            <p class="text-ink-600 leading-relaxed mb-8">"{{ test.message }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 bg-brand-50 rounded-token-full flex items-center justify-center">
                <Icons name="UsersIcon" class="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p class="font-medium text-ink-900">{{ test.customer_name }}</p>
                <p class="text-ink-500 text-sm">{{ formatDate(test.created_at) }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Location -->
    <section class="py-24 md:py-32 bg-paper-100 relative" id="lokasi">
      <div class="container-main">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="will-animate">
            <span class="eyebrow mb-6">Temukan Kami</span>
            <h2 class="font-serif text-4xl md:text-5xl text-ink-900 mb-6">Di jantung <span class="italic text-brand-600">Kota Padang</span></h2>
            <address class="text-ink-600 not-italic mb-6 leading-relaxed text-lg">
              Jl. Kartini No. 24, Padang Pasir,<br />
              Kec. Padang Barat, Kota Padang, Sumatera Barat
            </address>
            <div class="flex items-center gap-2 mb-8">
              <span class="w-2 h-2 rounded-token-full bg-sage-500 animate-pulse"></span>
              <span class="text-ink-700 font-medium">Buka setiap hari 08.00–04.00</span>
            </div>
            <a
              href="https://www.google.com/maps/place/Menes+Coffee+%26+Eatery+-+Padang/@-0.9406298,100.3597797,18z"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary inline-flex px-6 py-3"
            >
              <Icons name="ArrowUpRightIcon" class="w-4 h-4" />
              Buka di Google Maps
            </a>
          </div>
          <div class="will-animate">
            <div class="bezel-outer">
              <div class="bezel-inner aspect-[4/3]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.5!2d100.357!3d-0.9406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b8e8e8e8e8e8%3A0x8e8e8e8e8e8e8e8!2sMenes%20Coffee%20%26%20Eatery!5e0!3m2!1sid!2sid!4v1234567890"
                  class="w-full h-full border-0"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reservation CTA -->
    <section class="relative py-28 md:py-40 bg-ink-950 text-center overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-brand-600 rounded-token-full blur-[100px]"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-800 rounded-token-full blur-[100px]"></div>
      </div>
      <div class="container-main relative z-10 will-animate">
        <h2 class="font-serif text-5xl md:text-6xl lg:text-7xl mb-6">Siap <span class="italic text-brand-400">ngopi</span> & nongkrong?</h2>
        <p class="text-ink-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Dapatkan meja favoritmu — terutama buat rombongan atau acara spesial. Reservasi sekarang, bayar nanti di tempat.
        </p>
        <Button size="lg" class="bg-white text-ink-900 hover:bg-ink-100 hover:shadow-brand-glow" @click="$router.push('/reservasi')">
          Reservasi Sekarang
          <span class="w-7 h-7 bg-ink-900/10 rounded-token-full flex items-center justify-center">
            <Icons name="ArrowUpRightIcon" class="w-3.5 h-3.5" />
          </span>
        </Button>
      </div>
    </section>
  </div>
</template>
