<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import Icons from '@/components/ui/Icons.vue'

const props = defineProps({
  modelValue: String,
  bucket: { type: String, default: 'menu-images' },
  maxSizeMB: { type: Number, default: 5 },
  acceptedTypes: { type: Array, default: () => ['image/jpeg', 'image/png', 'image/webp'] },
})

const emit = defineEmits(['update:modelValue', 'remove'])

const preview = ref(null)
const uploading = ref(false)
const dragActive = ref(false)
const error = ref('')

const fileInput = ref(null)

const validateFile = (file) => {
  if (!props.acceptedTypes.includes(file.type)) {
    error.value = 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.'
    return false
  }
  if (file.size > props.maxSizeMB * 1024 * 1024) {
    error.value = `Ukuran file maksimal ${props.maxSizeMB}MB.`
    return false
  }
  error.value = ''
  return true
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && validateFile(file)) {
    uploadFile(file)
  }
  event.target.value = ''
}

const handleDrop = (event) => {
  event.preventDefault()
  dragActive.value = false
  const file = event.dataTransfer.files[0]
  if (file && validateFile(file)) {
    uploadFile(file)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  dragActive.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  dragActive.value = false
}

const uploadFile = async (file) => {
  uploading.value = true
  error.value = ''

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error: uploadError } = await supabase.storage
      .from(props.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from(props.bucket)
      .getPublicUrl(data.path)

    preview.value = publicUrl
    emit('update:modelValue', publicUrl)
  } catch (err) {
    console.error('Upload error:', err)
    error.value = 'Gagal mengupload gambar. Silakan coba lagi.'
  } finally {
    uploading.value = false
  }
}

const removeImage = () => {
  preview.value = null
  emit('update:modelValue', '')
  emit('remove')
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>

<template>
  <div class="space-y-4">
    <!-- Dropzone -->
    <div
      :class="[
        'border-2 border-dashed rounded-token-lg p-8 text-center transition-colors',
        uploading ? 'opacity-50 pointer-events-none' : '',
        dragActive ? 'border-terracotta-500 bg-terracotta-50' : 'border-ink-300 hover:border-terracotta-400',
        preview ? 'border-transparent bg-transparent p-0' : '',
      ]"
      @drop="handleDrop"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @click="!preview && !uploading && triggerFileInput()"
      role="button"
      tabindex="0"
      @keydown.enter="!preview && !uploading && triggerFileInput()"
      @keydown.space.prevent="!preview && !uploading && triggerFileInput()"
      aria-label="Upload gambar"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        @change="handleFileSelect"
        class="hidden"
        aria-hidden="true"
      />

      <!-- Preview -->
      <div v-if="preview" class="relative aspect-[4/3] rounded-token-lg overflow-hidden">
        <img :src="preview" alt="Preview" class="w-full h-full object-cover" />
        <button
          type="button"
          @click.stop="removeImage"
          class="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-token-full flex items-center justify-center shadow-token-sm transition-colors"
          aria-label="Hapus gambar"
        >
          <Icons name="XIcon" class="w-4 h-4 text-terracotta-600" />
        </button>
      </div>

      <!-- Upload Placeholder -->
      <div v-else class="space-y-3">
        <Icons name="UploadIcon" class="w-12 h-12 mx-auto text-ink-400" />
        <p class="text-ink-600">{{ uploading ? 'Mengupload...' : 'Klik atau drag & drop untuk upload' }}</p>
        <p class="text-ink-400 text-sm">JPG, PNG, WebP · Max {{ maxSizeMB }}MB</p>
        <button
          type="button"
          @click.stop="triggerFileInput"
          :disabled="uploading"
          class="btn-secondary mt-2"
        >
          Pilih File
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="error-text text-center" role="alert">{{ error }}</p>

    <!-- Current Image Info -->
    <div v-if="modelValue && !preview" class="p-3 bg-ink-50 rounded-token-md text-sm text-ink-600">
      Gambar saat ini: <a :href="modelValue" target="_blank" rel="noopener noreferrer" class="text-terracotta-600 hover:underline truncate block">{{ modelValue }}</a>
    </div>
  </div>
</template>