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
import VideoUploader from '@/components/admin/VideoUploader.vue'
import Icons from '@/components/ui/Icons.vue'

const gallery = ref([])
const loading = ref(true)

const showModal = ref(false)
const editingItem = ref(null)
const form = ref({
  placement: 'gallery',
  media_type: 'photo',
  image_url: '',
  video_url: '',
  embed_url: '',
  caption: '',
  category: '',
  source: '',
  source_url: '',
  sort_order: 0,
})
const errors = ref({})
const saving = ref(false)

const mediaTypeOptions = [
  { value: 'photo', label: 'Foto' },
  { value: 'video', label: 'Video' },
  { value: 'embed', label: 'Embed (Instagram/YouTube)' },
]

const sourceOptions = [
  { value: '', label: 'Tidak ada / internal' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'menu', label: 'Menu' },
  { value: 'maps', label: 'Google Maps' },
  { value: 'internal', label: 'Foto sendiri (internal)' },
]

const sourceLabels = {
  instagram: 'Instagram',
  menu: 'Menu',
  maps: 'Google Maps',
  internal: 'Internal',
}

// Placement: which public section this media appears in.
// Mapped onto the existing `category` column using reserved values.
const placementOptions = [
  { value: 'gallery', label: 'Galeri (grid)' },
  { value: 'hero', label: 'Hero Banner (Home)' },
  { value: 'about', label: 'Slider Tentang' },
  { value: 'experience', label: 'Media Experience (Home)' },
]

const placementLabels = {
  gallery: 'Galeri',
  hero: 'Hero Home',
  about: 'Slider Tentang',
  experience: 'Experience',
}

const RESERVED_PLACEMENTS = ['hero', 'about', 'experience']
const placementFromCategory = (category) =>
  RESERVED_PLACEMENTS.includes(category) ? category : 'gallery'

const placementFilter = ref('all')
const filteredGallery = computed(() => {
  if (placementFilter.value === 'all') return gallery.value
  return gallery.value.filter(item => placementFromCategory(item.category) === placementFilter.value)
})

const mediaPreviewSrc = computed(() => {
  if (form.value.media_type === 'video') return form.value.video_url
  return form.value.image_url
})

const primaryUrl = computed(() =>
  form.value.media_type === 'video' ? form.value.video_url : form.value.image_url
)

const showDeleteModal = ref(false)
const deletingItem = ref(null)
const deleting = ref(false)

const fetchGallery = async () => {
  loading.value = true
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
    loading.value = false
  }
}

onMounted(fetchGallery)

const openAddModal = () => {
  editingItem.value = null
  form.value = {
    placement: 'gallery',
    media_type: 'photo',
    image_url: '',
    video_url: '',
    embed_url: '',
    caption: '',
    category: '',
    source: '',
    source_url: '',
    sort_order: gallery.value.length,
  }
  errors.value = {}
  showModal.value = true
}

const editItem = (item) => {
  editingItem.value = item
  form.value = {
    placement: placementFromCategory(item.category),
    media_type: item.media_type || 'photo',
    image_url: item.image_url || '',
    video_url: item.video_url || '',
    embed_url: item.embed_url || '',
    caption: item.caption || '',
    category: RESERVED_PLACEMENTS.includes(item.category) ? '' : (item.category || ''),
    source: item.source || '',
    source_url: item.source_url || '',
    sort_order: item.sort_order || 0,
  }
  errors.value = {}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
  form.value = {
    placement: 'gallery',
    media_type: 'photo',
    image_url: '',
    video_url: '',
    embed_url: '',
    caption: '',
    category: '',
    source: '',
    source_url: '',
    sort_order: 0,
  }
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}
  if (form.value.media_type === 'embed') {
    if (!form.value.embed_url) {
      errors.value.embed_url = 'URL embed wajib diisi'
    }
  } else if (form.value.media_type === 'video') {
    if (!form.value.video_url) {
      errors.value.video_url = 'Video wajib diupload'
    }
  } else if (!form.value.image_url) {
    errors.value.image_url = 'Gambar wajib diupload'
  }
  return Object.keys(errors.value).length === 0
}

const saveItem = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    const isReservedPlacement = RESERVED_PLACEMENTS.includes(form.value.placement)
    const payload = {
      image_url: form.value.media_type === 'video' ? (form.value.image_url || null) : (form.value.media_type === 'embed' ? null : form.value.image_url),
      media_type: form.value.media_type,
      video_url: form.value.media_type === 'video' ? form.value.video_url : null,
      embed_url: form.value.media_type === 'embed' ? form.value.embed_url : null,
      caption: form.value.caption.trim() || null,
      // Reserved placements map directly onto category; gallery keeps its own category
      category: isReservedPlacement ? form.value.placement : (form.value.category.trim() || null),
      source: form.value.source || null,
      source_url: form.value.source_url.trim() || null,
      sort_order: parseInt(form.value.sort_order) || 0,
    }

    let error
    if (editingItem.value) {
      const { error: updateError } = await supabase
        .from('gallery')
        .update(payload)
        .eq('id', editingItem.value.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('gallery')
        .insert(payload)
      error = insertError
    }

    if (error) throw error

    closeModal()
    await fetchGallery()
  } catch (err) {
    console.error('Save error:', err)
    errors.value.form = 'Gagal menyimpan. Periksa kembali data, lalu coba lagi.'
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
    // Delete media from storage (best effort)
    const removeFromBucket = async (bucket, url) => {
      if (!url) return
      try {
        const u = new URL(url)
        const fileName = u.pathname.split('/').pop()
        if (fileName) {
          await supabase.storage.from(bucket).remove([fileName])
        }
      } catch (e) {
        console.warn(`Failed to remove from ${bucket}:`, e)
      }
    }

    const item = deletingItem.value
    if (item.media_type === 'video') {
      await removeFromBucket('gallery-videos', item.video_url)
    } else {
      await removeFromBucket('gallery-images', item.image_url)
    }

    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', item.id)

    if (error) throw error

    closeDeleteModal()
    await fetchGallery()
  } catch (err) {
    console.error('Delete error:', err)
  } finally {
    deleting.value = false
  }
}

const updateSortOrder = async (item, newOrder) => {
  const { error } = await supabase
    .from('gallery')
    .update({ sort_order: newOrder })
    .eq('id', item.id)

  if (!error) {
    item.sort_order = newOrder
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-serif text-3xl text-ink-900">Manajemen Galeri</h1>
        <p class="text-ink-500 mt-1">Kelola foto, video, dan embed - drag urutan atau edit nomor urut</p>
      </div>
      <Button variant="primary" @click="openAddModal">
        <Icons name="PlusIcon" class="w-5 h-5" /> Tambah Media
      </Button>
    </div>

    <div class="card">
      <div v-if="loading" class="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton variant="image" v-for="i in 8" :key="i" />
      </div>
      <div v-else class="p-4">
        <!-- Placement filter -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="opt in [{ value: 'all', label: 'Semua' }, ...placementOptions]"
            :key="opt.value"
            :class="[
              'px-4 py-2 rounded-token-full text-sm font-medium transition-all',
              placementFilter === opt.value
                ? 'bg-ink-950 text-white'
                : 'bg-ink-100/70 text-ink-700 hover:bg-ink-200'
            ]"
            @click="placementFilter = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="item in filteredGallery"
            :key="item.id"
            class="relative group"
          >
            <div class="aspect-[4/3] rounded-token-lg overflow-hidden relative">
              <img
                v-if="!item.video_url"
                :src="item.image_url || (item.embed_url ? undefined : '')"
                :alt="item.caption || 'Galeri'"
                class="w-full h-full object-cover"
              />
              <video
                v-else
                :src="item.video_url"
                class="w-full h-full object-cover"
                muted
                preload="metadata"
              />
              <div v-if="item.video_url" class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span class="w-12 h-12 bg-white/80 rounded-token-full flex items-center justify-center">
                  <Icons name="PlayIcon" class="w-6 h-6 text-brand-600" />
                </span>
              </div>
              <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="flex gap-2 p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="bg-white/90 hover:bg-white text-ink-900"
                    @click.stop="editItem(item)"
                    aria-label="Edit {{ item.caption || 'foto' }}"
                  >
                    <Icons name="EditIcon" class="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="bg-white/90 hover:bg-white text-brand-600"
                    @click.stop="confirmDelete(item)"
                    aria-label="Hapus {{ item.caption || 'foto' }}"
                  >
                    <Icons name="TrashIcon" class="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <!-- Sort Order Badge -->
              <div class="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-token-sm">
                #{{ item.sort_order }}
              </div>
              <!-- Placement Badge -->
              <div class="absolute top-2 right-2 bg-brand-600 text-white text-xs px-2 py-1 rounded-token-sm">
                {{ placementLabels[placementFromCategory(item.category)] || 'Galeri' }}
              </div>
            </div>
            <div class="mt-2 space-y-2">
              <Input
                v-model="item.sort_order"
                type="number"
                label="Urutan"
                placeholder="0"
                @update:modelValue="($event) => updateSortOrder(item, parseInt($event) || 0)"
              />
              <p v-if="item.caption" class="text-sm text-ink-600 truncate">{{ item.caption }}</p>
              <span v-if="item.category && !RESERVED_PLACEMENTS.includes(item.category)" class="badge bg-ink-100 text-ink-700 text-xs">{{ item.category }}</span>
              <div v-if="item.media_type || item.source" class="flex flex-wrap gap-1 text-xs">
                <span v-if="item.media_type" class="badge bg-brand-100 text-brand-700">{{ { photo: 'Foto', video: 'Video', embed: 'Embed' }[item.media_type] || item.media_type }}</span>
                <span v-if="item.source" class="badge bg-ink-100 text-ink-700">{{ sourceLabels[item.source] || item.source }}</span>
                <a
                  v-if="item.source_url"
                  :href="item.source_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-0.5 text-brand-600 hover:text-brand-700"
                  @click.stop
                >
                  Sumber <Icons name="ArrowUpRightIcon" class="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
          <div v-if="filteredGallery.length === 0" class="col-span-full text-center py-12">
            <Icons name="PhotoIcon" class="w-12 h-12 mx-auto text-ink-300 mb-3" />
            <p class="text-ink-500">{{ gallery.length === 0 ? 'Belum ada media galeri' : 'Tidak ada media pada penempatan ini' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal v-model:modelValue="showModal" :title="editingItem ? 'Edit Media Galeri' : 'Tambah Media Galeri'" @close="closeModal" size="lg">
      <form @submit.prevent="saveItem" class="space-y-4">
        <div v-if="errors.form" class="p-3 bg-brand-50 border border-brand-200 rounded-token-md text-brand-700 text-sm" role="alert">
          {{ errors.form }}
        </div>

        <div>
          <label class="label">Tipe Media</label>
          <Select
            v-model="form.media_type"
            :options="mediaTypeOptions"
            placeholder="Pilih tipe media"
          />
        </div>

        <div>
          <label class="label">Penempatan</label>
          <Select
            v-model="form.placement"
            :options="placementOptions"
            placeholder="Pilih penempatan"
          />
          <p class="helper-text">Tentukan di halaman public mana media ini tampil. Media hero/tentang/experience diurutkan berdasarkan nomor urut.</p>
        </div>

        <div v-if="form.media_type === 'photo'">
          <label class="label">Gambar</label>
          <ImageUploader v-model="form.image_url" bucket="gallery-images" max-size-mb="5" />
          <p v-if="errors.image_url" class="error-text" role="alert">{{ errors.image_url }}</p>
        </div>

        <div v-else-if="form.media_type === 'video'">
          <label class="label">Video (upload MP4)</label>
          <VideoUploader v-model="form.video_url" bucket="gallery-videos" :max-size-mb="50" />
          <p v-if="errors.video_url" class="error-text" role="alert">{{ errors.video_url }}</p>
        </div>

        <div v-else>
          <Input
            v-model="form.embed_url"
            label="URL Embed (Instagram / YouTube)"
            placeholder="https://www.instagram.com/reel/.../embed"
            :error="errors.embed_url"
          />
          <p class="helper-text">Gunakan URL iframe embed (bukan halaman biasa) agar tampil di galeri.</p>
        </div>

        <Input v-model="form.caption" label="Caption (opsional)" placeholder="Contoh: Area outdoor Menes" />
        <Input v-if="form.placement === 'gallery'" v-model="form.category" label="Kategori galeri (opsional)" placeholder="Contoh: interior, makanan, suasana" />
        <p v-else class="helper-text -mt-2">Penempatan ini otomatis dikelompokkan ke "{{ placementLabels[form.placement] }}".</p>

        <div class="pt-4 border-t border-ink-200">
          <label class="label mb-2">Sumber / Atribusi</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              v-model="form.source"
              :options="sourceOptions"
              placeholder="Pilih sumber (opsional)"
              label="Sumber"
            />
            <Input
              v-model="form.source_url"
              label="Link Sumber (opsional)"
              placeholder="https://instagram.com/p/..."
            />
          </div>
          <p class="helper-text">Atribusi sumber opsional, misalnya link posting Instagram asli.</p>
        </div>

        <Input v-model="form.sort_order" label="Urutan" type="number" placeholder="0" />

        <div class="pt-4 border-t border-ink-200 flex justify-end gap-3">
          <Button variant="secondary" type="button" @click="closeModal">Batal</Button>
          <Button variant="primary" type="submit" :loading="saving" :disabled="!primaryUrl">{{ saving ? 'Menyimpan...' : (editingItem ? 'Simpan' : 'Tambah') }}</Button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirm Modal -->
    <Modal v-model:modelValue="showDeleteModal" title="Hapus Media" @close="closeDeleteModal">
      <p class="mb-6">Media ini akan dihapus dari galeri dan penyimpanan. Tindakan ini tidak dapat dibatalkan.</p>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" @click="closeDeleteModal">Batal</Button>
        <Button variant="primary" class="bg-brand-600 hover:bg-brand-700" @click="deleteItem" :loading="deleting">Hapus</Button>
      </div>
    </Modal>
  </div>
</template>