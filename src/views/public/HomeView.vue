<script setup>
import { ref, onMounted, computed } from 'vue'
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

onMounted(async () => {
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

// SEO
const { meta: seoMeta } = useSEO({
  title: 'Menes Coffee & Eatery - Padang | Ngopi, Makan, Nongkrong Sampai Larut',
  description: 'Menes Coffee & Eatery Padang - Tempat ngopi, makan, dan nongkrong sampai larut. Area indoor & outdoor luas, photobox, pet-friendly di jantung Padang. Buka 08.00-04.00.',
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center justify-center bg-ink-950 text-white overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80"
          alt="Menes Coffee & Eatery interior"
          class="w-full h-full object-cover opacity-40"
        />
      </div>
      <div class="relative z-10 container-main px-6 text-center">
        <h1 class="font-serif text-5xl md:text-7xl lg:text-8xl font-normal leading-tight mb-6 animate-fade-in">
          Menes Coffee & Eatery
        </h1>
        <p class="text-lg md:text-xl text-ink-300 max-w-2xl mx-auto mb-10 animate-slide-up" style="animation-delay: 100ms;">
          Ngopi, makan, dan nongkrong sampai larut. Area indoor & outdoor luas, photobox, pet-friendly di jantung Padang.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style="animation-delay: 200ms;">
          <Button size="lg" @click="$router.push('/menu')">Lihat Menu</Button>
          <Button variant="ghost" size="lg" class="bg-white/10 hover:bg-white/20 text-white border-white/20" @click="$router.push('/reservasi')">Reservasi Meja</Button>
        </div>
      </div>
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <!-- Brand Statement -->
    <section class="section bg-white">
      <div class="container-main">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="font-serif text-4xl md:text-5xl text-ink-900 mb-6">Tentang Kami</h2>
          <p class="text-ink-600 text-lg leading-relaxed">
            Menes Coffee & Eatery hadir sebagai ruang yang nyaman untuk siapapun — mahasiswa yang ngerjain tugas, anak muda yang nongkrong bareng temen-temen, keluarga yang mau makan malam bareng, hingga yang butuh tempat meeting santai. Buka dari pagi hingga dini hari, kami menyediakan menu kopi signature, makanan berat, pizza, pasta, dan dessert dengan harga terjangkau.
          </p>
        </div>
      </div>
    </section>

    <!-- Featured Menu -->
    <section class="section bg-paper-100">
      <div class="container-main">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="font-serif text-4xl md:text-5xl text-ink-900">Menu Pilihan</h2>
            <p class="text-ink-500 mt-2">Favorit pengunjung & rekomendasi kami</p>
          </div>
          <Button variant="ghost" @click="$router.push('/menu')">Lihat Semua Menu</Button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="featured-menu">
          <MenuCard
            v-for="item in featuredMenu"
            :key="item.id"
            :item="item"
            variant="featured"
          />
          <Skeleton v-if="loading" variant="card" v-for="i in 6" :key="i" />
          <div v-if="!loading && featuredMenu.length === 0" class="col-span-full text-center py-12 text-ink-500">
            <Icons name="ImageIcon" class="w-12 h-12 mx-auto text-ink-300 mb-3" />
            <p>Belum ada menu pilihan</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Menes Experience -->
    <section class="section bg-white">
      <div class="container-main">
        <h2 class="font-serif text-4xl md:text-5xl text-ink-900 text-center mb-16">Menes Experience</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="card p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-token-full flex items-center justify-center">
              <Icons name="HomeIcon" class="w-8 h-8 text-sage-600" />
            </div>
            <h3 class="font-serif text-xl text-ink-900 mb-2">Indoor & Outdoor</h3>
            <p class="text-ink-600">Area luas nyaman untuk nongkrong, meeting, atau acara rombongan</p>
          </div>
          <div class="card p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-terracotta-100 rounded-token-full flex items-center justify-center">
              <svg class="w-8 h-8 text-terracotta-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="font-serif text-xl text-ink-900 mb-2">Late Night</h3>
            <p class="text-ink-600">Buka hingga jam 04:00 — tempat nongkrong malam favorit di Padang</p>
          </div>
          <div class="card p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-accent-gold/20 rounded-token-full flex items-center justify-center">
              <Icons name="PhotoIcon" class="w-8 h-8 text-accent-gold" />
            </div>
            <h3 class="font-serif text-xl text-ink-900 mb-2">Photobox</h3>
            <p class="text-ink-600">Spot foto aesthetic buat dokumentasi momen seru</p>
          </div>
          <div class="card p-6 text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-ink-100 rounded-token-full flex items-center justify-center">
              <Icons name="UsersIcon" class="w-8 h-8 text-ink-600" />
            </div>
            <h3 class="font-serif text-xl text-ink-900 mb-2">Family & Pet Friendly</h3>
            <p class="text-ink-600">Ramah untuk keluarga & hewan peliharaan kecil</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Promo Section -->
    <section class="section bg-paper-100" v-if="validPromos.length > 0">
      <div class="container-main">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="font-serif text-4xl md:text-5xl text-ink-900">Promo Terbaru</h2>
            <p class="text-ink-500 mt-2">Jangan lewatkan penawaran menarik dari kami</p>
          </div>
          <Button variant="ghost" @click="$router.push('/promo')">Lihat Semua Promo</Button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="post in validPromos"
            :key="post.id"
            class="card group"
          >
            <div class="relative aspect-[16/10] overflow-hidden">
              <img
                v-if="post.image_url"
                :src="post.image_url"
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-400 group-hover:scale-103"
                loading="lazy"
              />
              <div v-else class="w-full h-full bg-ink-100 flex items-center justify-center text-ink-400">
                <Icons name="MegaphoneIcon" class="w-12 h-12" />
              </div>
              <div class="absolute top-3 left-3 flex gap-2">
                <Badge variant="featured">Promo</Badge>
                <Badge v-if="post.valid_until" variant="pending" class="text-xs">
                  S/d {{ formatDate(post.valid_until) }}
                </Badge>
              </div>
            </div>
            <div class="p-5">
              <p class="text-ink-500 text-sm mb-2">{{ formatDate(post.published_at) }}</p>
              <h3 class="font-semibold text-ink-900 text-lg mb-2 line-clamp-2">{{ post.title }}</h3>
              <p class="text-ink-600 text-sm line-clamp-3 mb-4">{{ post.content }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="section bg-white" v-if="testimonials.length > 0">
      <div class="container-main">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="font-serif text-4xl md:text-5xl text-ink-900">Apa Kata Pelanggan?</h2>
            <p class="text-ink-500 mt-2">Review asli dari pengunjung Menes</p>
          </div>
          <Button variant="ghost" @click="$router.push('/promo')">Lihat Semua</Button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article
            v-for="test in testimonials"
            :key="test.id"
            class="card p-6"
          >
            <div class="flex items-center gap-1 mb-4">
              <Icons v-for="i in 5" :key="i" name="StarIcon" :class="i <= test.rating ? 'w-5 h-5 fill-amber-400 text-amber-400' : 'w-5 h-5 text-ink-200'" />
            </div>
            <p class="text-ink-600 leading-relaxed mb-6">"{{ test.message }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-terracotta-100 rounded-token-full flex items-center justify-center">
                <Icons name="UsersIcon" class="w-5 h-5 text-terracotta-600" />
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
    <section class="section bg-paper-100" id="lokasi">
      <div class="container-main">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="font-serif text-4xl md:text-5xl text-ink-900 mb-6">Temukan Kami</h2>
            <address class="text-ink-600 not-italic mb-6 leading-relaxed">
              Jl. Kartini No. 24, Padang Pasir,<br />
              Kec. Padang Barat, Kota Padang, Sumatera Barat
            </address>
            <div class="flex flex-wrap gap-4 mb-6">
              <div class="flex items-center gap-2 text-ink-700">
                <svg class="w-5 h-5 text-terracotta-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Buka setiap hari 08.00–04.00</span>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/place/Menes+Coffee+%26+Eatery+-+Padang/@-0.9406298,100.3597797,18z"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary inline-flex"
            >
              <Icons name="CalendarIcon" class="w-5 h-5" />
              Buka di Google Maps
            </a>
          </div>
          <div class="relative aspect-[4/3] rounded-token-lg overflow-hidden shadow-token-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.5!2d100.357!3d-0.9406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b8e8e8e8e8e8%3A0x8e8e8e8e8e8e8e8e!2sMenes%20Coffee%20%26%20Eatery!5e0!3m2!1sid!2sid!4v1234567890"
              class="w-full h-full border-0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- Reservation CTA -->
    <section class="section-dark text-center">
      <div class="container-main">
        <h2 class="font-serif text-4xl md:text-5xl mb-4">Siap Ngopi & Nongkrong?</h2>
        <p class="text-ink-300 text-lg max-w-2xl mx-auto mb-8">
          Dapatkan meja favoritmu — terutama buat rombongan atau acara spesial. Reservasi sekarang, bayar nanti di tempat.
        </p>
        <Button size="lg" variant="secondary" class="bg-white text-ink-900 hover:bg-ink-100" @click="$router.push('/reservasi')">
          Reservasi Sekarang
        </Button>
      </div>
    </section>
  </div>
</template>