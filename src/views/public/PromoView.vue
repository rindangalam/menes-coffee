<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import Skeleton from '@/components/ui/Skeleton.vue'
import Badge from '@/components/ui/Badge.vue'
import Icons from '@/components/ui/Icons.vue'
import { useSEO } from '@/composables/useSEO'

const { meta: seoMeta } = useSEO({
  title: 'Promo & Blog - Menes Coffee & Eatery Padang',
  description: 'Promo terbaru, event, dan artikel dari Menes Coffee & Eatery. Promo harian, diskon menu, dan cerita menarik dari kafe favorit di Padang.',
})

const posts = ref([])
const loading = ref(true)
const activeType = ref('all')

const now = new Date()

const validPromos = computed(() => {
  return posts.value.filter(post => {
    if (post.type !== 'promo') return true
    if (!post.valid_until) return true
    return new Date(post.valid_until) >= now
  })
})

const filteredPosts = computed(() => {
  let result = validPromos.value
  if (activeType.value === 'promo') {
    result = result.filter(p => p.type === 'promo')
  } else if (activeType.value === 'article') {
    result = result.filter(p => p.type === 'article')
  }
  return result
})

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const fetchPosts = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) throw error
    posts.value = data || []
  } catch (err) {
    console.error('Failed to load posts:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchPosts)
</script>

<template>
  <div class="min-h-screen bg-paper-50">
    <section class="section bg-white border-b border-ink-100">
      <div class="container-main">
        <h1 class="font-serif text-4xl md:text-5xl text-ink-900 mb-2">Promo & Blog</h1>
        <p class="text-ink-500">Promo terbaru, event, dan cerita dari Menes</p>
      </div>
    </section>

    <section class="section">
      <div class="container-main">
        <!-- Type Filter -->
        <div class="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Tipe konten">
          <button
            :class="[
              'px-4 py-2 rounded-token-full text-sm font-medium transition-all duration-token-fast',
              activeType === 'promo'
                ? 'bg-terracotta-600 text-white shadow-token-md'
                : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
            ]"
            @click="activeType = 'promo'"
            role="tab"
            :aria-selected="activeType === 'promo'"
          >
            Promo
          </button>
          <button
            :class="[
              'px-4 py-2 rounded-token-full text-sm font-medium transition-all duration-token-fast',
              activeType === 'article'
                ? 'bg-terracotta-600 text-white shadow-token-md'
                : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
            ]"
            @click="activeType = 'article'"
            role="tab"
            :aria-selected="activeType === 'article'"
          >
            Artikel
          </button>
          <button
            :class="[
              'px-4 py-2 rounded-token-full text-sm font-medium transition-all duration-token-fast',
              activeType === 'all'
                ? 'bg-terracotta-600 text-white shadow-token-md'
                : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
            ]"
            @click="activeType = 'all'"
            role="tab"
            :aria-selected="activeType === 'all'"
          >
            Semua
          </button>
        </div>

        <!-- Posts Grid -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton variant="card" v-for="i in 6" :key="i" />
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="post in filteredPosts"
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
                <Icons name="PhotoIcon" class="w-12 h-12" />
              </div>
              <div class="absolute top-3 left-3 flex gap-2">
                <Badge :variant="post.type === 'promo' ? 'featured' : 'default'">
                  {{ post.type === 'promo' ? 'Promo' : 'Artikel' }}
                </Badge>
                <Badge v-if="post.type === 'promo' && post.valid_until" variant="pending">
                  Berlaku s/d {{ formatDate(post.valid_until) }}
                </Badge>
              </div>
            </div>
            <div class="p-5">
              <p class="text-ink-500 text-sm mb-2">{{ formatDate(post.published_at) }}</p>
              <h3 class="font-semibold text-ink-900 text-lg mb-2 line-clamp-2">{{ post.title }}</h3>
              <p class="text-ink-600 text-sm line-clamp-3 mb-4">{{ post.content }}</p>
              <div class="flex items-center justify-between">
                <span class="text-ink-500 text-sm">Menes Coffee & Eatery</span>
              </div>
            </div>
          </article>

          <div v-if="filteredPosts.length === 0" class="col-span-full text-center py-16">
            <Icons name="MegaphoneIcon" class="w-12 h-12 mx-auto text-ink-300 mb-3" />
            <p class="text-ink-500">Belum ada {{ activeType === 'promo' ? 'promo' : activeType === 'article' ? 'artikel' : 'konten' }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>