<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Icons from '@/components/ui/Icons.vue'
import { useSEO } from '@/composables/useSEO'

let observer = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
  document.querySelectorAll('.will-animate').forEach(el => observer.observe(el))
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const { meta: seoMeta } = useSEO({
  title: 'Kontak Kami - Menes Coffee & Eatery Padang',
  description: 'Hubungi Menes Coffee & Eatery untuk pertanyaan, saran, atau kerja sama. Alamat: Jl. Kartini No. 24, Padang. Instagram: @menescoffee',
})

const form = ref({
  name: '',
  email: '',
  message: '',
})

const errors = ref({})
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

const validateForm = () => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Nama lengkap wajib diisi'
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'Email wajib diisi'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Format email tidak valid'
  }

  if (!form.value.message.trim()) {
    errors.value.message = 'Pesan wajib diisi'
  } else if (form.value.message.trim().length < 10) {
    errors.value.message = 'Pesan minimal 10 karakter'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  submitError.value = ''

  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        message: form.value.message.trim(),
        is_read: false,
      })

    if (error) throw error

    submitted.value = true
  } catch (err) {
    console.error('Contact error:', err)
    submitError.value = 'Gagal mengirim pesan. Silakan coba lagi.'
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    message: '',
  }
  errors.value = {}
  submitted.value = false
  submitError.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-paper-50">
    <section class="bg-white border-b border-ink-100 overflow-hidden">
      <div class="container-main py-token-4xl">
        <div class="max-w-3xl mx-auto text-center">
          <div class="eyebrow mb-6 animate-slide-up" style="--reveal-delay: 0ms;">Kontak</div>
          <h1 class="font-serif text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] text-ink-900 mb-6 animate-slide-up" style="--reveal-delay: 120ms;">
            Mari
            <em class="text-brand-600" style="font-family: var(--font-serif); font-style: italic;">terhubung</em>
          </h1>
          <p class="text-lg text-ink-500 max-w-xl mx-auto animate-slide-up" style="--reveal-delay: 240ms;">
            Punya pertanyaan, saran, atau mau kerja sama? Kirim pesan ke kami.
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-main">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Contact Form -->
          <div class="lg:col-span-2">
            <div class="card p-8 will-animate">
              <h2 class="font-serif text-2xl text-ink-900 mb-6">Kirim Pesan</h2>
              
              <form @submit.prevent="handleSubmit" class="space-y-5" novalidate v-if="!submitted">
                <div v-if="submitError" class="p-3 bg-brand-50 border border-brand-200 rounded-token-md text-brand-700 text-sm" role="alert">
                  {{ submitError }}
                </div>

                <div class="grid sm:grid-cols-2 gap-5">
                  <Input
                    v-model="form.name"
                    label="Nama Lengkap"
                    placeholder="Nama kamu"
                    required
                    :error="errors.name"
                    autocomplete="name"
                  />
                  <Input
                    v-model="form.email"
                    label="Email"
                    placeholder="email@contoh.com"
                    type="email"
                    required
                    :error="errors.email"
                    autocomplete="email"
                  />
                </div>

                <div>
                  <label for="message" class="label">Pesan <span class="text-brand-500">*</span></label>
                  <textarea
                    id="message"
                    v-model="form.message"
                    rows="5"
                    class="input resize-none"
                    :class="{ 'input-error': errors.message }"
                    placeholder="Tulis pesanmu di sini..."
                    required
                  />
                  <p v-if="errors.message" class="error-text">{{ errors.message }}</p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  :loading="submitting"
                  :disabled="submitting"
                >
                  {{ submitting ? 'Mengirim...' : 'Kirim Pesan' }}
                </Button>
              </form>

              <div v-if="submitted" class="text-center py-8 animate-fade-in">
                <div class="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                  <Icons name="CheckIcon" class="w-8 h-8 text-sage-600" />
                </div>
                <h3 class="font-serif text-2xl text-ink-900 mb-2">Pesan Terkirim!</h3>
                <p class="text-ink-600 mb-6">Terima kasih sudah menghubungi kami. Tim kami akan membalas secepatnya.</p>
                <Button variant="secondary" @click="resetForm">Kirim Pesan Lain</Button>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div>
            <div class="card p-8 h-full sticky top-24 will-animate">
              <h2 class="font-serif text-2xl text-ink-900 mb-6">Informasi Kontak</h2>
              
              <div class="space-y-6 mb-8">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-brand-100 rounded-token-md flex items-center justify-center flex-shrink-0">
                    <Icons name="CalendarIcon" class="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p class="font-medium text-ink-900">Alamat</p>
                    <address class="text-ink-600 text-sm not-italic mt-1">
                      Jl. Kartini No. 24, Padang Pasir,<br />
                      Kec. Padang Barat, Kota Padang, Sumatera Barat
                    </address>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-sage-100 rounded-token-md flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-ink-900">Jam Buka</p>
                    <p class="text-ink-600 text-sm mt-1">Setiap hari: 08.00 – 04.00</p>
                    <p class="text-brand-600 text-xs mt-1">Late night hangout</p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-ink-100 rounded-token-md flex items-center justify-center flex-shrink-0">
                    <Icons name="PhotoIcon" class="w-5 h-5 text-ink-600" />
                  </div>
                  <div>
                    <p class="font-medium text-ink-900">Instagram</p>
                    <a href="https://instagram.com/menescoffee" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline text-sm mt-1 inline-block">@menescoffee</a>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 bg-ink-100 rounded-token-md flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-ink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-ink-900">TikTok</p>
                    <a href="https://tiktok.com/@menescoffee" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline text-sm mt-1 inline-block">@menescoffee</a>
                  </div>
                </div>
              </div>

              <div class="pt-6 border-t border-ink-200">
                <h3 class="font-medium text-ink-900 mb-3">Media Sosial</h3>
                <div class="flex gap-3">
                  <a href="https://instagram.com/menescoffee" target="_blank" rel="noopener noreferrer" class="btn-ghost p-2" aria-label="Instagram Menes Coffee">
                    <Icons name="PhotoIcon" class="w-5 h-5" />
                  </a>
                  <a href="https://tiktok.com/@menescoffee" target="_blank" rel="noopener noreferrer" class="btn-ghost p-2" aria-label="TikTok Menes Coffee">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href="https://www.google.com/maps/place/Menes+Coffee+%26+Eatery+-+Padang/@-0.9406298,100.3597797,18z" target="_blank" rel="noopener noreferrer" class="btn-ghost p-2" aria-label="Google Maps">
                    <Icons name="CalendarIcon" class="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>