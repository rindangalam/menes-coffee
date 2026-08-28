<script setup>
import { ref, onMounted, computed, onUnmounted, onBeforeUnmount, nextTick } from 'vue'
import { supabase } from '@/lib/supabase'
import Skeleton from '@/components/ui/Skeleton.vue'
import Icons from '@/components/ui/Icons.vue'
import { useSEO } from '@/composables/useSEO'

let observer = null

const setupObserver = () => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
}

const observeReveal = () => {
  if (!observer) setupObserver()
  document.querySelectorAll('.will-animate').forEach(el => observer.observe(el))
}

const { meta: seoMeta } = useSEO({
  title: 'Galeri - Menes Coffee & Eatery Padang',
  description: 'Galeri foto Menes Coffee & Eatery: area indoor & outdoor, makanan, minuman, photobox, dan suasana late night. Momen-momen indah di jantung Padang.',
})

const gallery = ref([])
const loading = ref(true)
const categories = ref([])
const activeCategory = ref(null)

const IG_BASE = 'https://www.instagram.com/p/'
const IG_POSTS = [
  { code: 'DI_NaftSwjB', caption: 'Menes Coffee & Eatery', category: 'interior' },
  { code: 'DI8Z3sZRQ6U', caption: 'Menes Coffee & Eatery', category: 'food' },
  { code: 'DIoKJJGy1-W', caption: 'Menes Coffee & Eatery', category: 'food' },
  { code: 'DH4_XqsRZD5', caption: 'Menes Coffee & Eatery', category: 'interior' },
  { code: 'DHptwBxRhUP', caption: 'Menes Coffee & Eatery', category: 'interior' },
  { code: 'DHI_nPCy_ao', caption: 'Menes Coffee & Eatery', category: 'people' },
  { code: 'DG0WCpYpwxL', caption: 'Menes Coffee & Eatery', category: 'food' },
  { code: 'DGX7kCTpuqd', caption: 'Menes Coffee & Eatery', category: 'interior' },
  { code: 'DGVK09Hphk5', caption: 'Menes Coffee & Eatery', category: 'food' },
  { code: 'DGSzIyRpXnf', caption: 'Menes Coffee & Eatery', category: 'people' },
  { code: 'DGPzxXfpquc', caption: 'Menes Coffee & Eatery', category: 'interior' },
  { code: 'DGNY4R9Mpaw', caption: 'Menes Coffee & Eatery', category: 'people' },
  { code: 'DGFjv2EpbW7', caption: 'Menes Coffee & Eatery', category: 'interior' },
  { code: 'DF7M1NXvYs5', caption: 'Menes Coffee & Eatery', category: 'interior' },
  { code: 'DF4hdFqvyKL', caption: 'Menes Coffee & Eatery', category: 'people' },
  { code: 'DFX0WbgSKXo', caption: 'Menes Coffee & Eatery', category: 'food' },
  { code: 'DEt2VhBS2Ye', caption: 'Menes Coffee & Eatery', category: 'interior' },
  { code: 'DCoXyxWvqkH', caption: 'Menes Coffee & Eatery', category: 'interior' },
  { code: 'DCYSKcSvI4N', caption: 'Menes Coffee & Eatery', category: 'food' },
  { code: 'DCTbMaQJYMT', caption: 'Menes Coffee & Eatery', category: 'interior' },
  { code: 'DCQlBgPpHtk', caption: 'Menes Coffee & Eatery', category: 'interior' },
]

// Local reels (downloaded MP4) — videos are featured large in the masonry
const localReels = [
  { code: 'DGaiFZRJxfv', caption: 'Cozy indoor, breezy outdoor', category: 'suasana' },
  { code: 'DGc7nXwpgas', caption: 'Great coffee starts with great control', category: 'coffee' },
  { code: 'DGKi48XJQfl', caption: 'Kopi yang pas, teman yang seru', category: 'people' },
  { code: 'DIyAzCmxLkZ', caption: "It's not about where you're going, it's how you show up", category: 'suasana' },
  { code: 'DHLne_qSjbC', caption: 'After iftar & tarawih, recharge', category: 'suasana' },
  { code: 'DHlesvUSKIL', caption: 'Own the moment. Be You!', category: 'people' },
  { code: 'DGXfaKRJzJE', caption: 'Two girls, slice of happiness', category: 'food' },
  { code: 'DIlfQBcSLiH', caption: 'No rush, no pressure', category: 'suasana' },
]

const localReelMedia = localReels.map((r, i) => ({
  id: `reel-${r.code}`,
  media_type: 'video',
  image_url: `/images/candidates/reels/${r.code}.jpg`,
  video_url: `/images/candidates/reels/videos/${r.code}.mp4`,
  caption: r.caption,
  category: r.category,
  source: 'instagram',
  source_url: `${IG_BASE}reel/${r.code}/`,
  sort_order: i,
}))

// Local gallery photos (curated) + candidate photos
const curatedPhotos = [
  { id: 'cur-0', image_url: '/images/about.jpg', caption: 'Interior Menes Coffee & Eatery', category: 'interior' },
  { id: 'cur-1', image_url: '/images/gallery-01-no-rush.jpg', caption: 'NO RUSH. NONOISE. JUST HER.', category: 'interior' },
  { id: 'cur-2', image_url: '/images/gallery-02-lifestyle.jpg', caption: 'SHE KNOWS HOW TO ENJOY THE NIGHT', category: 'people' },
  { id: 'cur-3', image_url: '/images/gallery-06-study.jpg', caption: 'Study & Work Space', category: 'interior' },
  { id: 'cur-4', image_url: '/images/gallery-11-perfection.jpg', caption: 'Perfection in every cup', category: 'food' },
  { id: 'cur-5', image_url: '/images/gallery-05-reel-ready.jpg', caption: 'Ready to be more?', category: 'reels' },
  { id: 'cur-6', image_url: '/images/gallery-03-reel-music.jpg', caption: 'Put on your favorite song', category: 'reels' },
  { id: 'cur-7', image_url: '/images/gallery-12-hiring.jpg', caption: 'Join Our Team', category: 'events' },
]

const localGalleryImages = [
  ...IG_POSTS.map((p, i) => ({
    id: `ig-${p.code}`,
    media_type: 'photo',
    image_url: `/gallery/instagram/photo/${p.code}.jpg`,
    caption: p.caption,
    category: p.category,
    source: 'instagram',
    source_url: `${IG_BASE}${p.code}/`,
    sort_order: 100 + i,
  })),
  ...curatedPhotos.map((p, i) => ({
    id: p.id,
    media_type: 'photo',
    image_url: p.image_url,
    caption: p.caption,
    category: p.category,
    source: 'internal',
    sort_order: 200 + i,
  })),
]

const sourceLabels = {
  instagram: 'Instagram',
  menu: 'Menu',
  maps: 'Google Maps',
  internal: 'Internal',
}

// Reserved placements appear on dedicated pages (hero/about/experience), not the gallery grid
const RESERVED_PLACEMENTS = ['hero', 'about', 'experience']

const fetchGallery = async () => {
  loading.value = true
  observeReveal()
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error

    gallery.value = data || []
  } catch (err) {
    console.error('Failed to load gallery:', err)
  } finally {
    // Always derive categories from both DB rows and curated local media
    // (excluding reserved placement rows used by hero/about/experience)
    const dbItems = gallery.value || []
    const merged = [...localReelMedia, ...localGalleryImages, ...dbItems]
    categories.value = [...new Set(merged.map(item => item.category).filter(c => c && !RESERVED_PLACEMENTS.includes(c)))]
    loading.value = false
    await nextTick()
    observeReveal()
  }
}

// Combined curated local set: featured reels (videos) + photos
const localCombined = computed(() => {
  return [...localReelMedia, ...localGalleryImages].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
})

const filteredGallery = computed(() => {
  // Prefer DB-managed grid media (excludes reserved hero/about/experience rows);
  // fall back to the curated local set when the DB has no grid items.
  const dbGrid = (gallery.value || []).filter(item => !RESERVED_PLACEMENTS.includes(item.category))
  const source = dbGrid.length > 0
    ? dbGrid.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    : [...localCombined.value].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
  if (!activeCategory.value) return source
  return source.filter(item => item.category === activeCategory.value)
})

// Lightbox state
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const openLightbox = (index) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const lightboxItem = computed(() => currentList.value[lightboxIndex.value] || null)

const lightboxNext = () => {
  if (currentList.value.length === 0) return
  lightboxIndex.value = (lightboxIndex.value + 1) % currentList.value.length
}

const lightboxPrev = () => {
  if (currentList.value.length === 0) return
  lightboxIndex.value = (lightboxIndex.value - 1 + currentList.value.length) % currentList.value.length
}

// Masonry sizing: videos always large/tall; photos alternate big-small for a lively mix
const photoRatios = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-square']
const masonryItems = computed(() => {
  let photoIdx = 0
  return filteredGallery.value.map(item => {
    const type = item.media_type || 'photo'
    if (type === 'video') return { ...item, sizeClass: 'aspect-[3/4]' }
    if (type === 'embed') return { ...item, sizeClass: 'aspect-[16/10]' }
    const cls = photoRatios[photoIdx % photoRatios.length]
    photoIdx++
    return { ...item, sizeClass: cls }
  })
})

const currentList = computed(() => masonryItems.value)

onMounted(fetchGallery)

const onKeydown = (e) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowRight') lightboxNext()
  else if (e.key === 'ArrowLeft') lightboxPrev()
}

window.addEventListener('keydown', onKeydown)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="min-h-screen bg-paper-50">
    <section class="bg-white border-b border-ink-100 overflow-hidden">
      <div class="container-main py-token-4xl">
        <div class="max-w-3xl mx-auto text-center">
          <div class="eyebrow mb-6 animate-slide-up" style="--reveal-delay: 0ms;">Galeri</div>
          <h1 class="font-serif text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] text-ink-900 mb-6 animate-slide-up" style="--reveal-delay: 120ms;">
            Momen yang
            <em class="text-brand-600" style="font-family: var(--font-serif); font-style: italic;">abadi</em>
            di sini
          </h1>
          <p class="text-lg text-ink-500 max-w-xl mx-auto animate-slide-up" style="--reveal-delay: 240ms;">
            Suasana indoor & outdoor, makanan, minuman, photobox, dan cerita late night di jantung Padang.
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-main">
        <!-- Category Filter -->
        <div v-if="categories.length > 0" class="flex flex-wrap gap-2 mb-10 justify-center" role="tablist" aria-label="Kategori galeri">
          <button
            v-for="cat in categories"
            :key="cat"
            :class="[
              'px-5 py-2.5 rounded-token-full text-sm font-medium capitalize transition-all duration-token-fluid',
              activeCategory === cat
                ? 'bg-ink-950 text-white shadow-brand-glow scale-[1.02]'
                : 'bg-ink-100/70 text-ink-700 hover:bg-ink-200'
            ]"
            @click="activeCategory = cat"
            role="tab"
            :aria-selected="activeCategory === cat"
          >
            {{ cat }}
          </button>
          <button
            :class="[
              'px-5 py-2.5 rounded-token-full text-sm font-medium transition-all duration-token-fluid',
              activeCategory === null
                ? 'bg-ink-950 text-white shadow-brand-glow scale-[1.02]'
                : 'bg-ink-100/70 text-ink-700 hover:bg-ink-200'
            ]"
            @click="activeCategory = null"
            role="tab"
            :aria-selected="activeCategory === null"
          >
            Semua
          </button>
        </div>

        <!-- Masonry Grid - mixed photo/video sizes -->
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Skeleton variant="image" class="aspect-square" v-for="i in 8" :key="i" />
        </div>

        <div v-else-if="masonryItems.length > 0" class="columns-2 md:columns-3 lg:columns-4 gap-4">
          <button
            v-for="(item, index) in masonryItems"
            :key="item.id"
            class="group relative w-full break-inside-avoid mb-4 rounded-token-xl overflow-hidden shadow-token-md will-animate block text-left focus:outline-none focus:ring-2 focus:ring-brand-500"
            :class="item.sizeClass"
            @click="openLightbox(index)"
            :aria-label="`Buka ${item.media_type === 'video' ? 'video' : 'foto'}: ${item.caption || 'Galeri Menes'}`"
            :style="{ '--reveal-delay': (index % 4) * 80 + 'ms' }"
          >
            <img
              v-if="(item.media_type || 'photo') === 'photo'"
              :src="item.image_url"
              :alt="item.caption || 'Galeri Menes'"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <video
              v-else-if="(item.media_type || 'photo') === 'video'"
              :src="item.video_url"
              :poster="item.image_url || undefined"
              class="w-full h-full object-cover bg-ink-950"
              autoplay
              muted
              loop
              playsinline
              preload="metadata"
            ></video>
            <iframe
              v-else
              :src="item.embed_url"
              class="w-full h-full border-0"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              title="Embed galeri"
            ></iframe>

            <!-- Play badge for videos -->
            <div
              v-if="(item.media_type || 'photo') === 'video'"
              class="absolute inset-0 flex items-center justify-center"
            >
              <span class="w-12 h-12 rounded-token-full bg-white/25 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                <Icons name="PlayIcon" class="w-5 h-5" />
              </span>
            </div>

            <!-- Overlay caption -->
            <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/75 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="flex items-center justify-between gap-2">
                <p class="font-medium text-sm line-clamp-1">{{ item.caption || 'Menes Coffee & Eatery' }}</p>
                <span
                  v-if="item.source_url"
                  class="flex-shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-wide bg-white/25 px-2 py-0.5 rounded-token-full"
                >
                  {{ sourceLabels[item.source] || 'Sumber' }}
                  <Icons name="ArrowUpRightIcon" class="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          </button>
        </div>

        <div v-if="!loading && filteredGallery.length === 0" class="col-span-full text-center py-16">
          <Icons name="PhotoIcon" class="w-12 h-12 mx-auto text-ink-300 mb-3" />
          <p class="text-ink-500">Belum ada foto galeri</p>
        </div>

        <!-- Lightbox popup -->
        <Teleport to="body">
          <div
            v-if="lightboxOpen && lightboxItem"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/95 p-4 md:p-8 backdrop-blur-sm"
            @click.self="closeLightbox"
            role="dialog"
            aria-modal="true"
            :aria-label="`Lightbox: ${lightboxItem.caption || 'Galeri Menes'}`"
          >
            <!-- Close -->
            <button
              @click="closeLightbox"
              aria-label="Tutup"
              class="absolute top-4 right-4 z-10 w-11 h-11 rounded-token-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-colors"
            >
              <Icons name="XIcon" class="w-5 h-5" />
            </button>

            <!-- Prev / Next -->
            <button
              @click="lightboxPrev"
              aria-label="Sebelumnya"
              class="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-token-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-colors"
            >
              <Icons name="ChevronLeftIcon" class="w-5 h-5" />
            </button>
            <button
              @click="lightboxNext"
              aria-label="Berikutnya"
              class="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-token-full bg-white/10 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-colors"
            >
              <Icons name="ChevronRightIcon" class="w-5 h-5" />
            </button>

            <!-- Media -->
            <figure class="relative max-w-4xl w-full max-h-[80vh] flex flex-col items-center justify-center animate-fade-in">
              <div class="relative max-h-[70vh] w-full flex items-center justify-center overflow-hidden rounded-token-xl">
                <img
                  v-if="lightboxItem.media_type !== 'video' && !lightboxItem.embed_url"
                  :src="lightboxItem.image_url"
                  :alt="lightboxItem.caption || 'Galeri Menes'"
                  class="max-w-full max-h-[70vh] object-contain rounded-token-xl shadow-2xl"
                />
                <video
                  v-else-if="lightboxItem.media_type === 'video'"
                  :src="lightboxItem.video_url"
                  :poster="lightboxItem.image_url || undefined"
                  class="max-w-full max-h-[70vh] object-contain rounded-token-xl shadow-2xl bg-ink-950"
                  controls
                  autoplay
                  playsinline
                ></video>
                <iframe
                  v-else
                  :src="lightboxItem.embed_url"
                  class="w-full aspect-video max-h-[70vh] border-0 rounded-token-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  title="Embed galeri"
                ></iframe>
              </div>
              <figcaption class="mt-4 flex items-center justify-center gap-3 text-white/90">
                <span class="inline-flex items-center gap-2">
                  <Icons v-if="lightboxItem.media_type === 'video'" name="FilmIcon" class="w-4 h-4" />
                  <Icons v-else name="PhotoIcon" class="w-4 h-4" />
                  {{ lightboxItem.caption || 'Menes Coffee & Eatery' }}
                </span>
                <a
                  v-if="lightboxItem.source_url"
                  :href="lightboxItem.source_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-brand-300 hover:text-brand-200 px-2.5 py-1 rounded-token-full bg-white/10"
                >
                  {{ sourceLabels[lightboxItem.source] || 'Sumber' }}
                  <Icons name="ArrowUpRightIcon" class="w-3 h-3" />
                </a>
              </figcaption>
              <span class="mt-2 text-xs text-ink-400">{{ lightboxIndex + 1 }} / {{ currentList.length }}</span>
            </figure>
          </div>
        </Teleport>
      </div>
    </section>
  </div>
</template>