<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import ImageUploader from '@/components/admin/ImageUploader.vue'
import Icons from '@/components/ui/Icons.vue'

const categories = ref([])
const menuItems = ref([])
const activeCategory = ref(null)
const loading = ref(true)

const showModal = ref(false)
const editingItem = ref(null)
const form = ref({
  name: '',
  description: '',
  category_id: '',
  price: '',
  image_url: '',
  is_available: true,
  is_featured: false,
  sort_order: 0,
})
const errors = ref({})
const saving = ref(false)

const showDeleteModal = ref(false)
const deletingItem = ref(null)
const deleting = ref(false)

const sortOptions = Array.from({ length: 100 }, (_, i) => ({
  value: String(i),
  label: String(i),
}))

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

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const fetchData = async () => {
  loading.value = true
  try {
    const [{ data: cats }, { data: items }] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase
        .from('menu_items')
        .select(`
          *,
          categories (name)
        `)
        .order('sort_order', { ascending: true }),
    ])

    categories.value = cats || []
    menuItems.value = (items || []).map(item => ({
      ...item,
      category_name: item.categories?.name,
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
}

onMounted(fetchData)

const openAddModal = () => {
  editingItem.value = null
  form.value = {
    name: '',
    description: '',
    category_id: categories.value[0]?.id || '',
    price: '',
    image_url: '',
    is_available: true,
    is_featured: false,
    sort_order: 0,
  }
  errors.value = {}
  showModal.value = true
}

const editItem = (item) => {
  editingItem.value = item
  form.value = {
    name: item.name,
    description: item.description || '',
    category_id: item.category_id || '',
    price: String(item.price),
    image_url: item.image_url || '',
    is_available: item.is_available,
    is_featured: item.is_featured,
    sort_order: item.sort_order || 0,
  }
  errors.value = {}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
  form.value = {
    name: '',
    description: '',
    category_id: '',
    price: '',
    image_url: '',
    is_available: true,
    is_featured: false,
    sort_order: 0,
  }
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Nama menu wajib diisi'
  if (!form.value.category_id) errors.value.category_id = 'Kategori wajib dipilih'
  if (!form.value.price || parseFloat(form.value.price) <= 0) errors.value.price = 'Harga wajib diisi dan > 0'
  return Object.keys(errors.value).length === 0
}

const saveItem = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    const payload = {
      name: form.value.name.trim(),
      description: form.value.description.trim() || null,
      category_id: form.value.category_id || null,
      price: parseFloat(form.value.price),
      image_url: form.value.image_url || null,
      is_available: form.value.is_available,
      is_featured: form.value.is_featured,
      sort_order: parseInt(form.value.sort_order) || 0,
    }

    let error
    if (editingItem.value) {
      const { error: updateError } = await supabase
        .from('menu_items')
        .update(payload)
        .eq('id', editingItem.value.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('menu_items')
        .insert(payload)
      error = insertError
    }

    if (error) throw error

    closeModal()
    await fetchData()
  } catch (err) {
    console.error('Save error:', err)
    errors.value.form = 'Gagal menyimpan. Silakan coba lagi.'
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item) => {
  deletingItem.value = item
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingItem.value = null
}

const deleteItem = async () => {
  if (!deletingItem.value) return

  deleting.value = true
  try {
    // Delete image from storage if exists
    if (deletingItem.value.image_url) {
      const url = new URL(deletingItem.value.image_url)
      const pathParts = url.pathname.split('/')
      const fileName = pathParts[pathParts.length - 1]
      await supabase.storage.from('menu-images').remove([fileName])
    }

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', deletingItem.value.id)

    if (error) throw error

    closeDeleteModal()
    await fetchData()
  } catch (err) {
    console.error('Delete error:', err)
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-serif text-3xl text-ink-900">Manajemen Menu</h1>
        <p class="text-ink-500 mt-1">Kelola kategori dan item menu</p>
      </div>
      <Button variant="primary" @click="openAddModal">
        <Icons name="PlusIcon" class="w-5 h-5" /> Tambah Menu
      </Button>
    </div>

    <!-- Category Tabs -->
    <div class="card">
      <div class="border-b border-ink-200 overflow-x-auto">
        <nav class="flex" role="tablist" aria-label="Kategori menu">
          <button
            v-for="cat in categories"
            :key="cat.id"
            :class="[
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeCategory === cat.id
                ? 'border-terracotta-600 text-terracotta-600'
                : 'border-transparent text-ink-500 hover:text-ink-700'
            ]"
            @click="activeCategory = cat.id"
            role="tab"
            :aria-selected="activeCategory === cat.id"
          >
            {{ cat.name }}
          </button>
          <button
            :class="[
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeCategory === null
                ? 'border-terracotta-600 text-terracotta-600'
                : 'border-transparent text-ink-500 hover:text-ink-700'
            ]"
            @click="activeCategory = null"
            role="tab"
            :aria-selected="activeCategory === null"
          >
            Semua
          </button>
        </nav>
      </div>

      <!-- Menu Table/List -->
      <div class="overflow-x-auto">
        <table class="w-full" v-if="!loading">
          <thead>
            <tr class="text-left text-sm text-ink-500 border-b border-ink-200">
              <th class="p-4 font-medium">Menu</th>
              <th class="p-4 font-medium hidden md:table-cell">Kategori</th>
              <th class="p-4 font-medium hidden lg:table-cell">Harga</th>
              <th class="p-4 font-medium">Status</th>
              <th class="p-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-ink-200">
            <tr v-for="item in filteredMenu" :key="item.id" class="hover:bg-ink-50">
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <img
                    v-if="item.image_url"
                    :src="item.image_url"
                    :alt="item.name"
                    class="w-12 h-12 object-cover rounded-token-md"
                  />
                  <div v-else class="w-12 h-12 bg-ink-100 rounded-token-md flex items-center justify-center">
                    <Icons name="ImageIcon" class="w-5 h-5 text-ink-400" />
                  </div>
                  <div>
                    <p class="font-medium text-ink-900">{{ item.name }}</p>
                    <p class="text-ink-500 text-xs">{{ item.description?.substring(0, 50) }}...</p>
                  </div>
                </div>
              </td>
              <td class="p-4 hidden md:table-cell">
                <span class="text-ink-600">{{ item.categories?.name || '-' }}</span>
              </td>
              <td class="p-4 hidden lg:table-cell">
                <span class="font-medium text-terracotta-600">Rp {{ formatPrice(item.price) }}</span>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <Badge :variant="item.is_available ? 'available' : 'sold-out'">
                    {{ item.is_available ? 'Tersedia' : 'Habis' }}
                  </Badge>
                  <Badge v-if="item.is_featured" variant="featured">Featured</Badge>
                </div>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" @click="editItem(item)" aria-label="Edit {{ item.name }}">
                    <Icons name="EditIcon" class="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" class="text-terracotta-600 hover:bg-terracotta-50" @click="confirmDelete(item)" aria-label="Hapus {{ item.name }}">
                    <Icons name="TrashIcon" class="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredMenu.length === 0">
              <td colspan="5" class="p-8 text-center text-ink-500">Tidak ada menu</td>
            </tr>
          </tbody>
        </table>

        <div v-if="loading" class="p-6">
          <Skeleton variant="text" v-for="i in 5" :key="i" className="w-3/4" />
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal v-model:modelValue="showModal" :title="editingItem ? 'Edit Menu' : 'Tambah Menu'" @close="closeModal" size="lg">
      <form @submit.prevent="saveItem" class="space-y-4">
        <div v-if="errors.form" class="p-3 bg-terracotta-50 border border-terracotta-200 rounded-token-md text-terracotta-700 text-sm" role="alert">
          {{ errors.form }}
        </div>

        <Input v-model="form.name" label="Nama Menu" required :error="errors.name" placeholder="Contoh: Nasi Sarden" />
        <Input v-model="form.description" label="Deskripsi" type="textarea" :rows="3" placeholder="Deskripsi singkat menu" />
        
        <div class="grid sm:grid-cols-2 gap-4">
          <Select v-model="form.category_id" label="Kategori" :options="categories" optionValue="id" optionLabel="name" required :error="errors.category_id" placeholder="Pilih kategori" />
          <Input v-model="form.price" label="Harga (Rp)" type="number" required :error="errors.price" placeholder="45000" />
        </div>

        <!-- Image Uploader -->
        <div>
          <label class="label">Gambar Menu</label>
          <ImageUploader v-model="form.image_url" bucket="menu-images" max-size-mb="5" />
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <Select v-model="form.sort_order" label="Urutan" :options="sortOptions" optionValue="value" optionLabel="label" />
          <div class="flex items-center gap-4 pt-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form.is_available" class="w-4 h-4 rounded-token-sm border-ink-300 text-terracotta-600 focus:ring-terracotta-500" />
              <span class="text-sm text-ink-700">Tersedia</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="form.is_featured" class="w-4 h-4 rounded-token-sm border-ink-300 text-terracotta-600 focus:ring-terracotta-500" />
              <span class="text-sm text-ink-700">Featured</span>
            </label>
          </div>
        </div>

        <div class="pt-4 border-t border-ink-200 flex justify-end gap-3">
          <Button variant="secondary" type="button" @click="closeModal">Batal</Button>
          <Button variant="primary" type="submit" :loading="saving">{{ saving ? 'Menyimpan...' : (editingItem ? 'Simpan' : 'Tambah') }}</Button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirm Modal -->
    <Modal v-model:modelValue="showDeleteModal" title="Hapus Menu" @close="closeDeleteModal">
      <p class="mb-6">Menu <strong>"{{ deletingItem?.name }}"</strong> akan dihapus. Tindakan ini tidak dapat dibatalkan.</p>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" @click="closeDeleteModal">Batal</Button>
        <Button variant="primary" class="bg-terracotta-600 hover:bg-terracotta-700" @click="deleteItem" :loading="deleting">Hapus</Button>
      </div>
    </Modal>
  </div>
</template>