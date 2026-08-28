<script setup>
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import Icons from '@/components/ui/Icons.vue'

const props = defineProps({
  modelValue: String,
  bucket: { type: String, default: 'gallery-videos' },
  maxSizeMB: { type: Number, default: 50 },
})

const emit = defineEmits(['update:modelValue', 'remove'])

const preview = ref(props.modelValue || '')
const uploading = ref(false)
const error = ref('')
const fileInput = ref(null)

watch(() => props.modelValue, (v) => {
  preview.value = v || ''
})

const validateFile = (file) => {
  const allowed = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
  if (!allowed.includes(file.type)) {
    error.value = 'Format video tidak didukung. Gunakan MP4, WebM, atau OGG.'
    return false
  }
  if (file.size > props.maxSizeMB * 1024 * 1024) {
    error.value = `Ukuran video maksimal ${props.maxSizeMB}MB.`
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

const uploadFile = async (file) => {
  uploading.value = true
  error.value = ''

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
    const { data, error: uploadError } = await supabase.storage
      .from(props.bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from(props.bucket)
      .getPublicUrl(data.path)

    preview.value = publicUrl
    emit('update:modelValue', publicUrl)
  } catch (err) {
    console.error('Video upload error:', err)
    error.value = 'Gagal mengupload video. Pastikan bucket "gallery-videos" sudah dibuat, lalu coba lagi.'
  } finally {
    uploading.value = false
  }
}

const removeVideo = () => {
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
    <div
      :class="[
        'border-2 border-dashed rounded-token-lg p-8 text-center transition-colors',
        uploading ? 'opacity-50 pointer-events-none' : '',
        error ? 'border-brand-300 bg-brand-50/40' : 'border-ink-300 hover:border-brand-400',
        preview ? 'border-transparent bg-transparent p-0' : '',
      ]"
      @drop.prevent="handleFileSelect"
      @dragover.prevent
      role="button"
      tabindex="0"
      @click="!preview && !uploading && triggerFileInput()"
      @keydown.enter="!preview && !uploading && triggerFileInput()"
      @keydown.space.prevent="!preview && !uploading && triggerFileInput()"
      aria-label="Upload video"
    >
      <input
        ref="fileInput"
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        @change="handleFileSelect"
        class="hidden"
        aria-hidden="true"
      />

      <div v-if="preview" class="relative aspect-video rounded-token-lg overflow-hidden bg-ink-950">
        <video :src="preview" controls class="w-full h-full object-contain" preload="metadata" />
        <button
          type="button"
          @click.stop="removeVideo"
          class="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-token-full flex items-center justify-center shadow-token-sm transition-colors z-10"
          aria-label="Hapus video"
        >
          <Icons name="XIcon" class="w-4 h-4 text-brand-600" />
        </button>
      </div>

      <div v-else class="space-y-3">
        <Icons name="PlayIcon" class="w-12 h-12 mx-auto text-ink-400" />
        <p class="text-ink-600">{{ uploading ? 'Mengupload...' : 'Klik atau drag & drop video untuk upload' }}</p>
        <p class="text-ink-400 text-sm">MP4, WebM, OGG · Maks {{ maxSizeMB }}MB</p>
        <button
          type="button"
          @click.stop="triggerFileInput"
          :disabled="uploading"
          class="btn-secondary mt-2"
        >
          Pilih Video
        </button>
      </div>
    </div>

    <p v-if="error" class="error-text text-center" role="alert">{{ error }}</p>
  </div>
</template>
