<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import ImageUploader from '@/components/admin/ImageUploader.vue'
import Icons from '@/components/ui/Icons.vue'

const posts = ref([])
const loading = ref(true)

const showModal = ref(false)
const editingPost = ref(null)
const form = ref({
  title: '',
  slug: '',
  content: '',
  image_url: '',
  type: 'article',
  valid_from: '',
  valid_until: '',
  status: 'draft',
})
const errors = ref({})
const saving = ref(false)

const showDeleteModal = ref(false)
const deletingPost = ref(null)
const deleting = ref(false)

const typeOptions = [
  { value: 'article', label: 'Artikel' },
  { value: 'promo', label: 'Promo' },
]

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '-'
  return new Date(dateTimeStr).toLocaleString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const fetchPosts = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    posts.value = data || []
  } catch (err) {
    console.error('Failed to load posts:', err)
  } finally {
    loading.value = false
  }
}

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const openAddModal = () => {
  editingPost.value = null
  form.value = {
    title: '',
    slug: '',
    content: '',
    image_url: '',
    type: 'article',
    valid_from: '',
    valid_until: '',
    status: 'draft',
  }
  errors.value = {}
  showModal.value = true
}

const editPost = (post) => {
  editingPost.value = post
  form.value = {
    title: post.title,
    slug: post.slug,
    content: post.content || '',
    image_url: post.image_url || '',
    type: post.type,
    valid_from: post.valid_from ? post.valid_from.slice(0, 16) : '',
    valid_until: post.valid_until ? post.valid_until.slice(0, 16) : '',
    status: post.status,
  }
  errors.value = {}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingPost.value = null
  form.value = {
    title: '',
    slug: '',
    content: '',
    image_url: '',
    type: 'article',
    valid_from: '',
    valid_until: '',
    status: 'draft',
  }
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}
  if (!form.value.title.trim()) errors.value.title = 'Judul wajib diisi'
  if (!form.value.slug.trim()) {
    errors.value.slug = 'Slug wajib diisi'
  } else if (!/^[a-z0-9-]+$/.test(form.value.slug)) {
    errors.value.slug = 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'
  }
  if (form.value.type === 'promo') {
    if (!form.value.valid_from) errors.value.valid_from = 'Tanggal mulai wajib diisi untuk promo'
    if (!form.value.valid_until) errors.value.valid_until = 'Tanggal berakhir wajib diisi untuk promo'
  }
  return Object.keys(errors.value).length === 0
}

const savePost = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    const payload = {
      title: form.value.title.trim(),
      slug: form.value.slug.trim(),
      content: form.value.content.trim() || null,
      image_url: form.value.image_url || null,
      type: form.value.type,
      valid_from: form.value.valid_from ? new Date(form.value.valid_from).toISOString() : null,
      valid_until: form.value.valid_until ? new Date(form.value.valid_until).toISOString() : null,
      status: form.value.status,
      published_at: form.value.status === 'published' && !editingPost.value ? new Date().toISOString() : (editingPost.value?.published_at || null),
    }

    let error
    if (editingPost.value) {
      const { error: updateError } = await supabase
        .from('posts')
        .update(payload)
        .eq('id', editingPost.value.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('posts')
        .insert(payload)
      error = insertError
    }

    if (error) throw error

    closeModal()
    await fetchPosts()
  } catch (err) {
    console.error('Save error:', err)
    errors.value.form = 'Gagal menyimpan. Silakan coba lagi.'
  } finally {
    saving.value = false
  }
}

const confirmDelete = (post) => {
  deletingPost.value = post
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingPost.value = null
}

const deletePost = async () => {
  if (!deletingPost.value) return

  deleting.value = true
  try {
    // Delete image from storage
    if (deletingPost.value.image_url) {
      const url = new URL(deletingPost.value.image_url)
      const pathParts = url.pathname.split('/')
      const fileName = pathParts[pathParts.length - 1]
      // Try to determine bucket from URL or default to menu-images
      await supabase.storage.from('menu-images').remove([fileName])
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', deletingPost.value.id)

    if (error) throw error

    closeDeleteModal()
    await fetchPosts()
  } catch (err) {
    console.error('Delete error:', err)
  } finally {
    deleting.value = false
  }
}

const onTitleChange = () => {
  if (!editingPost.value && form.value.title) {
    form.value.slug = generateSlug(form.value.title)
  }
}

onMounted(fetchPosts)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-serif text-3xl text-ink-900">Promo & Blog</h1>
        <p class="text-ink-500 mt-1">Kelola promo harian dan artikel</p>
      </div>
      <Button variant="primary" @click="openAddModal">
        <Icons name="PlusIcon" class="w-5 h-5" /> Tambah
      </Button>
    </div>

    <div class="card overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="text-left text-sm text-ink-500 border-b border-ink-200 bg-ink-50">
            <th class="p-4 font-medium">Judul</th>
            <th class="p-4 font-medium hidden md:table-cell">Tipe</th>
            <th class="p-4 font-medium hidden lg:table-cell">Periode</th>
            <th class="p-4 font-medium">Status</th>
            <th class="p-4 font-medium">Publish</th>
            <th class="p-4 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ink-200">
          <tr v-for="post in posts" :key="post.id" class="hover:bg-ink-50">
            <td class="p-4 font-medium text-ink-900 max-w-xs truncate">{{ post.title }}</td>
            <td class="p-4 hidden md:table-cell">
              <Badge :variant="post.type === 'promo' ? 'featured' : 'default'">{{ post.type }}</Badge>
            </td>
            <td class="p-4 hidden lg:table-cell text-ink-500 text-sm">
              <template v-if="post.type === 'promo'">
                {{ formatDate(post.valid_from) }} – {{ formatDate(post.valid_until) }}
              </template>
              <template v-else>-</template>
            </td>
            <td class="p-4">
              <Badge :variant="post.status === 'published' ? 'confirmed' : 'pending'">{{ post.status }}</Badge>
            </td>
            <td class="p-4 text-ink-500 text-sm">{{ formatDateTime(post.published_at) }}</td>
            <td class="p-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" @click="editPost(post)">
                  <Icons name="EditIcon" class="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" class="text-terracotta-600 hover:bg-terracotta-50" @click="confirmDelete(post)">
                  <Icons name="TrashIcon" class="w-4 h-4" />
                </Button>
              </div>
            </td>
          </tr>
          <tr v-if="posts.length === 0">
            <td colspan="6" class="p-8 text-center text-ink-500">Belum ada promo/artikel</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <Modal v-model:modelValue="showModal" :title="editingPost ? 'Edit Promo/Artikel' : 'Tambah Promo/Artikel'" @close="closeModal" size="xl">
      <form @submit.prevent="savePost" class="space-y-4">
        <div v-if="errors.form" class="p-3 bg-terracotta-50 border border-terracotta-200 rounded-token-md text-terracotta-700 text-sm" role="alert">
          {{ errors.form }}
        </div>

        <Input v-model="form.title" label="Judul" required :error="errors.title" placeholder="Contoh: Promo Akhir Pekan" @input="onTitleChange" />
        <Input v-model="form.slug" label="Slug (URL)" required :error="errors.slug" placeholder="promo-akhir-pekan" helper-text="Otomatis terisi dari judul, gunakan huruf kecil, angka, dan tanda hubung saja" />
        <Input v-model="form.content" label="Konten" type="textarea" :rows="6" placeholder="Konten lengkap promo/artikel" />

        <Select v-model="form.type" label="Tipe" :options="typeOptions" required :error="errors.type" />

        <template v-if="form.type === 'promo'">
          <div class="grid sm:grid-cols-2 gap-4">
            <Input v-model="form.valid_from" label="Berlaku Mulai" type="datetime-local" required :error="errors.valid_from" />
            <Input v-model="form.valid_until" label="Berlaku Hingga" type="datetime-local" required :error="errors.valid_until" />
          </div>
        </template>

        <Select v-model="form.status" label="Status" :options="statusOptions" required :error="errors.status" />

        <div>
          <label class="label">Gambar Utama (opsional)</label>
          <ImageUploader v-model="form.image_url" bucket="menu-images" max-size-mb="5" />
        </div>

        <div class="pt-4 border-t border-ink-200 flex justify-end gap-3">
          <Button variant="secondary" type="button" @click="closeModal">Batal</Button>
          <Button variant="primary" type="submit" :loading="saving">{{ saving ? 'Menyimpan...' : (editingPost ? 'Simpan' : 'Tambah') }}</Button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirm Modal -->
    <Modal v-model:modelValue="showDeleteModal" title="Hapus Promo/Artikel" @close="closeDeleteModal">
      <p class="mb-6">Promo/Artikel <strong>"{{ deletingPost?.title }}"</strong> akan dihapus. Tindakan ini tidak dapat dibatalkan.</p>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" @click="closeDeleteModal">Batal</Button>
        <Button variant="primary" class="bg-terracotta-600 hover:bg-terracotta-700" @click="deletePost" :loading="deleting">Hapus</Button>
      </div>
    </Modal>
  </div>
</template>