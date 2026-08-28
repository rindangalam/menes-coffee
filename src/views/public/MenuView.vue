<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue'
import { supabase } from '@/lib/supabase'
import Skeleton from '@/components/ui/Skeleton.vue'
import Badge from '@/components/ui/Badge.vue'
import MenuCard from '@/components/public/MenuCard.vue'
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
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
}

const observeReveal = () => {
  const els = document.querySelectorAll('.will-animate')
  els.forEach(el => observer.observe(el))
}

const { meta: seoMeta } = useSEO({
  title: 'Menu Menes Coffee & Eatery | Kopi Signature, Makanan, Pizza, Pasta, Dessert',
  description: 'Lihat menu lengkap Menes Coffee & Eatery: kopi signature, makanan berat khas Padang, pizza, pasta, dessert, dan minuman. Harga terjangkau, buka 08.00-04.00.',
})

const categories = ref([])
const menuItems = ref([])
const activeCategory = ref(null)
const loading = ref(true)

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const categoryOrder = [
  'Breakfast',
  'Starters',
  'Main Course',
  'Pizza',
  'Pasta',
  'Dessert',
  'Beverages',
  'Signature Latte',
]

const filteredMenu = computed(() => {
  if (!activeCategory.value) return menuItems.value
  return menuItems.value.filter(item => item.category_id === activeCategory.value)
})

onMounted(async () => {
  setupObserver()
  observeReveal()

  try {
    // Fetch categories
    const { data: cats, error: catsError } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (catsError) throw catsError
    categories.value = cats || []

    // Fetch menu items with categories
    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select(`
        *,
        categories (name)
      `)
      .eq('is_available', true)
      .order('sort_order', { ascending: true })

    if (itemsError) throw itemsError

    menuItems.value = items.map(item => ({
      ...item,
      category_name: item.categories?.name
    })).sort((a, b) => {
      const catA = categoryOrder.indexOf(a.category_name || '')
      const catB = categoryOrder.indexOf(b.category_name || '')
      if (catA !== -1 && catB !== -1) return catA - catB
      if (catA !== -1) return -1
      if (catB !== -1) return 1
      return a.sort_order - b.sort_order
    })
  } catch (err) {
    console.error('Failed to load menu:', err)
  } finally {
    loading.value = false
    await nextTick()
    observeReveal()
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="min-h-screen bg-paper-50">
    <section class="bg-white border-b border-ink-100 overflow-hidden">
      <div class="container-main py-token-4xl">
        <div class="max-w-3xl mx-auto text-center">
          <div class="eyebrow mb-6 animate-slide-up" style="--reveal-delay: 0ms;">Menu Kami</div>
          <h1 class="font-serif text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] text-ink-900 mb-6 animate-slide-up" style="--reveal-delay: 120ms;">
            Rasa yang
            <em class="text-brand-600 not-italic" style="font-family: var(--font-serif); font-style: italic;">menyalakan</em>
            semalam
          </h1>
          <p class="text-lg text-ink-500 max-w-xl mx-auto animate-slide-up" style="--reveal-delay: 240ms;">
            Kopi signature, makanan berat khas Padang, pizza, pasta, dan dessert — tersaji dari pagi hingga dini hari.
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-main">
        <!-- Category Tabs -->
        <div class="flex flex-wrap gap-2 mb-10 justify-center" role="tablist" aria-label="Kategori menu">
          <button
            v-for="cat in categories"
            :key="cat.id"
            :class="[
              'px-5 py-2.5 rounded-token-full text-sm font-medium transition-all duration-token-fluid',
              activeCategory === cat.id
                ? 'bg-ink-950 text-white shadow-brand-glow scale-[1.02]'
                : 'bg-ink-100/70 text-ink-700 hover:bg-ink-200'
            ]"
            @click="activeCategory = cat.id"
            role="tab"
            :aria-selected="activeCategory === cat.id"
          >
            {{ cat.name }}
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

        <!-- Menu Grid -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton variant="card" v-for="i in 6" :key="i" />
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            class="will-animate"
            :style="{ '--reveal-delay': (index % 3) * 80 + 'ms' }"
            v-for="(item, index) in filteredMenu"
            :key="item.id"
          >
            <MenuCard :item="item" />
          </div>
        </div>

        <div v-if="!loading && filteredMenu.length === 0" class="col-span-full text-center py-12">
          <Icons name="ImageIcon" class="w-12 h-12 mx-auto text-ink-300 mb-3" />
          <p class="text-ink-500">Tidak ada menu di kategori ini</p>
        </div>
      </div>
    </section>
  </div>
</template>