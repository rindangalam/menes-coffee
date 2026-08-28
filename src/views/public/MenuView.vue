<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import Skeleton from '@/components/ui/Skeleton.vue'
import Badge from '@/components/ui/Badge.vue'
import MenuCard from '@/components/public/MenuCard.vue'
import Icons from '@/components/ui/Icons.vue'
import { useSEO } from '@/composables/useSEO'

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
  }
})
</script>

<template>
  <div class="min-h-screen bg-paper-50">
    <section class="section bg-white border-b border-ink-100">
      <div class="container-main">
        <h1 class="font-serif text-4xl md:text-5xl text-ink-900 mb-2">Menu</h1>
        <p class="text-ink-500">Kopi signature, makanan berat, pizza, pasta, dan dessert</p>
      </div>
    </section>

    <section class="section">
      <div class="container-main">
        <!-- Category Tabs -->
        <div class="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Kategori menu">
          <button
            v-for="cat in categories"
            :key="cat.id"
            :class="[
              'px-4 py-2 rounded-token-full text-sm font-medium transition-all duration-token-fast',
              activeCategory === cat.id
                ? 'bg-terracotta-600 text-white shadow-token-md'
                : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
            ]"
            @click="activeCategory = cat.id"
            role="tab"
            :aria-selected="activeCategory === cat.id"
          >
            {{ cat.name }}
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

        <!-- Menu Grid -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton variant="card" v-for="i in 6" :key="i" />
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MenuCard
            v-for="item in filteredMenu"
            :key="item.id"
            :item="item"
          />
        </div>

        <div v-if="!loading && filteredMenu.length === 0" class="col-span-full text-center py-12">
          <Icons name="ImageIcon" class="w-12 h-12 mx-auto text-ink-300 mb-3" />
          <p class="text-ink-500">Tidak ada menu di kategori ini</p>
        </div>
      </div>
    </section>
  </div>
</template>