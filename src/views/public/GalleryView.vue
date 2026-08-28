<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import Skeleton from '@/components/ui/Skeleton.vue'
import Icons from '@/components/ui/Icons.vue'
import { useSEO } from '@/composables/useSEO'

const { meta: seoMeta } = useSEO({
  title: 'Galeri - Menes Coffee & Eatery Padang',
  description: 'Galeri foto Menes Coffee & Eatery: area indoor & outdoor, makanan, minuman, photobox, dan suasana late night. Momen-momen indah di jantung Padang.',
})

const gallery = ref([])
const loading = ref(true)
const categories = ref([])
const activeCategory = ref(null)

// Local fallback images from Instagram
const localGalleryImages = [
  { id: 'local-1', image_url: '/images/gallery-01-no-rush.jpg', caption: 'NO RUSH. NONOISE. JUST HER.', category: 'interior', sort_order: 1 },
  { id: 'local-2', image_url: '/images/gallery-02-lifestyle.jpg', caption: 'SHE KNOWS HOW TO ENJOY THE NIGHT', category: 'people', sort_order: 2 },
  { id: 'local-3', image_url: '/images/gallery-03-reel-music.jpg', caption: 'Put on your favorite song', category: 'reels', sort_order: 3 },
  { id: 'local-4', image_url: '/images/gallery-05-reel-ready.jpg', caption: 'Ready to be more?', category: 'reels', sort_order: 4 },
  { id: 'local-5', image_url: '/images/gallery-06-study.jpg', caption: 'Study & Work Space', category: 'interior', sort_order: 5 },
  { id: 'local-6', image_url: '/images/gallery-11-perfection.jpg', caption: 'Perfection in every cup', category: 'food', sort_order: 6 },
  { id: 'local-7', image_url: '/images/gallery-12-hiring.jpg', caption: 'Join Our Team', category: 'events', sort_order: 7 },
]

const fetchGallery = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error

    gallery.value = data || []

    // Extract unique categories
    const cats = [...new Set(data.map(item => item.category).filter(Boolean))]
    categories.value = cats
  } catch (err) {
    console.error('Failed to load gallery:', err)
  } finally {
    loading.value = false
  }
}

const filteredGallery = computed(() => {
  const source = gallery.value.length > 0 ? gallery.value : localGalleryImages
  if (!activeCategory.value) return source
  return source.filter(item => item.category === activeCategory.value)
})

onMounted(fetchGallery)
</script>

<template>
  <div class="min-h-screen bg-paper-50">
    <section class="section bg-white border-b border-ink-100">
      <div class="container-main">
        <h1 class="font-serif text-4xl md:text-5xl text-ink-900 mb-2">Galeri</h1>
        <p class="text-ink-500">Momen-momen indah di Menes Coffee & Eatery</p>
      </div>
    </section>

    <section class="section">
      <div class="container-main">
        <!-- Category Filter -->
        <div v-if="categories.length > 0" class="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Kategori galeri">
          <button
            v-for="cat in categories"
            :key="cat"
            :class="[
              'px-4 py-2 rounded-token-full text-sm font-medium transition-all duration-token-fast',
              activeCategory === cat
                ? 'bg-terracotta-600 text-white shadow-token-md'
                : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
            ]"
            @click="activeCategory = cat"
            role="tab"
            :aria-selected="activeCategory === cat"
          >
            {{ cat }}
          </button>
          <button
            :class="[
              'px-4 py-2 rounded-token-full text-sm font-medium transition-all duration-token-fast',
              activeCategory === null
                ? 'bg-terracotta-600 text-white shadow-token-md'
                : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
            ]"
            @click="activeCategory = null"
            role="tab"
            :aria-selected="activeCategory === null"
          >
            Semua
          </button>
        </div>

        <!-- Asymmetric Grid - Editorial Style -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Skeleton variant="image" class="md:col-span-2 lg:col-span-3 lg:row-span-2" />
          <Skeleton variant="image" class="md:col-span-1 lg:col-span-2" />
          <Skeleton variant="image" class="md:col-span-1 lg:col-span-2" />
          <Skeleton variant="image" class="md:col-span-1 lg:col-span-1" />
          <Skeleton variant="image" class="md:col-span-1 lg:col-span-1" />
          <Skeleton variant="image" class="md:col-span-1 lg:col-span-2" />
          <Skeleton variant="image" class="md:col-span-1 lg:col-span-2" />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4" v-if="filteredGallery.length > 0">
          <template v-for="(item, index) in filteredGallery" :key="item.id">
            <!-- Large featured (first item) -->
            <article v-if="index === 0" class="lg:col-span-3 lg:row-span-2 group relative aspect-[4/3] rounded-token-xl overflow-hidden shadow-token-lg">
              <img
                :src="item.image_url"
                :alt="item.caption || 'Galeri Menes'"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
                <p class="font-semibold text-lg">{{ item.caption || 'Menes Coffee & Eatery' }}</p>
                <p class="text-sm opacity-90" v-if="item.category">{{ item.category }}</p>
              </div>
            </article>

            <!-- Second item - medium tall -->
            <article v-else-if="index === 1" class="md:col-span-1 lg:col-span-2 lg:row-span-2 group relative aspect-[3/4] rounded-token-xl overflow-hidden shadow-token-lg">
              <img
                :src="item.image_url"
                :alt="item.caption || 'Galeri Menes'"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                <p class="font-semibold">{{ item.caption || 'Menes Coffee & Eatery' }}</p>
              </div>
            </article>

            <!-- Third item - medium -->
            <article v-else-if="index === 2" class="md:col-span-1 lg:col-span-2 group relative aspect-[4/3] rounded-token-xl overflow-hidden shadow-token-lg">
              <img
                :src="item.image_url"
                :alt="item.caption || 'Galeri Menes'"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                <p class="font-semibold">{{ item.caption || 'Menes Coffee & Eatery' }}</p>
              </div>
            </article>

            <!-- Small items -->
            <article v-else class="group relative aspect-square rounded-token-lg overflow-hidden shadow-token-md">
              <img
                :src="item.image_url"
                :alt="item.caption || 'Galeri Menes'"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                <p class="font-medium text-sm truncate">{{ item.caption || 'Menes Coffee & Eatery' }}</p>
              </div>
            </article>
          </template>
        </div>

        <div v-if="!loading && filteredGallery.length === 0" class="col-span-full text-center py-16">
          <Icons name="PhotoIcon" class="w-12 h-12 mx-auto text-ink-300 mb-3" />
          <p class="text-ink-500">Belum ada foto galeri</p>
        </div>
      </div>
    </section>
  </div>
</template>