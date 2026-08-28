<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'
import ImageUploader from '@/components/admin/ImageUploader.vue'
import Icons from '@/components/ui/Icons.vue'

const gallery = ref([])
const loading = ref(true)

const showModal = ref(false)
const editingItem = ref(null)
const form = ref({
  image_url: '',
  caption: '',
  category: '',
  sort_order: 0,
})
const errors = ref({})
const saving = ref(false)

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
    image_url: '',
    caption: '',
    category: '',
    sort_order: gallery.value.length,
  }
  errors.value = {}
  showModal.value = true
}

const editItem = (item) => {
  editingItem.value = item
  form.value = {
    image_url: item.image_url || '',
    caption: item.caption || '',
    category: item.category || '',
    sort_order: item.sort_order || 0,
  }
  errors.value = {}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
  form.value = {
    image_url: '',
    caption: '',
    category: '',
    sort_order: 0,
  }
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}
  if (!form.value.image_url) {
    errors.value.image_url = 'Gambar wajib diupload'
  }
  return Object.keys(errors.value).length === 0
}

const saveItem = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    const payload = {
      image_url: form.value.image_url,
      caption: form.value.caption.trim() || null,
      category: form.value.category.trim() || null,
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
    // Delete image from storage
    if (deletingItem.value.image_url) {
      const url = new URL(deletingItem.value.image_url)
      const pathParts = url.pathname.split('/')
      const fileName = pathParts[pathParts.length - 1]
      await supabase.storage.from('gallery-images').remove([fileName])
    }

    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', deletingItem.value.id)

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
        <p class="text-ink-500 mt-1">Kelola foto galeri - drag urutan atau edit nomor urut</p>
      </div>
      <Button variant="primary" @click="openAddModal">
        <Icons name="PlusIcon" class="w-5 h-5" /> Tambah Foto
      </Button>
    </div>

    <div class="card">
      <div v-if="loading" class="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton variant="image" v-for="i in 8" :key="i" />
      </div>
      <div v-else class="p-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="item in gallery"
            :key="item.id"
            class="relative group"
          >
            <div class="aspect-[4/3] rounded-token-lg overflow-hidden relative">
              <img
                :src="item.image_url"
                :alt="item.caption || 'Galeri'"
                class="w-full h-full object-cover"
              />
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
              <span v-if="item.category" class="badge bg-ink-100 text-ink-700 text-xs">{{ item.category }}</span>
            </div>
          </div>
          <div v-if="gallery.length === 0" class="col-span-full text-center py-12">
            <Icons name="PhotoIcon" class="w-12 h-12 mx-auto text-ink-300 mb-3" />
            <p class="text-ink-500">Belum ada foto galeri</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal v-model:modelValue="showModal" :title="editingItem ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'" @close="closeModal" size="lg">
      <form @submit.prevent="saveItem" class="space-y-4">
        <div v-if="errors.form" class="p-3 bg-brand-50 border border-brand-200 rounded-token-md text-brand-700 text-sm" role="alert">
          {{ errors.form }}
        </div>

        <div>
          <label class="label">Gambar</label>
          <ImageUploader v-model="form.image_url" bucket="gallery-images" max-size-mb="5" />
        </div>

        <Input v-model="form.caption" label="Caption (opsional)" placeholder="Contoh: Area outdoor Menes" />
        <Input v-model="form.category" label="Kategori (opsional)" placeholder="Contoh: interior, makanan, suasana" />
        <Input v-model="form.sort_order" label="Urutan" type="number" placeholder="0" />

        <div class="pt-4 border-t border-ink-200 flex justify-end gap-3">
          <Button variant="secondary" type="button" @click="closeModal">Batal</Button>
          <Button variant="primary" type="submit" :loading="saving" :disabled="!form.image_url">{{ saving ? 'Menyimpan...' : (editingItem ? 'Simpan' : 'Tambah') }}</Button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirm Modal -->
    <Modal v-model:modelValue="showDeleteModal" title="Hapus Foto" @close="closeDeleteModal">
      <p class="mb-6">Foto ini akan dihapus. Tindakan ini tidak dapat dibatalkan.</p>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" @click="closeDeleteModal">Batal</Button>
        <Button variant="primary" class="bg-brand-600 hover:bg-brand-700" @click="deleteItem" :loading="deleting">Hapus</Button>
      </div>
    </Modal>
  </div>
</template>