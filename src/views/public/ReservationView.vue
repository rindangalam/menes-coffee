<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Badge from '@/components/ui/Badge.vue'
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
  title: 'Reservasi Meja - Menes Coffee & Eatery Padang',
  description: 'Reservasi meja di Menes Coffee & Eatery Padang. Cocok untuk rombongan, acara buka bersama, atau nongkrong santai. Bayar di tempat, konfirmasi via WhatsApp.',
})

const form = ref({
  name: '',
  phone: '',
  email: '',
  reservation_date: '',
  reservation_time: '',
  guest_count: '',
  notes: '',
})

const errors = ref({})
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

const today = new Date().toISOString().split('T')[0]

const guestOptions = Array.from({ length: 20 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1} Orang`,
}))

const timeOptions = [
  { value: '08:00', label: '08:00' },
  { value: '09:00', label: '09:00' },
  { value: '10:00', label: '10:00' },
  { value: '11:00', label: '11:00' },
  { value: '12:00', label: '12:00' },
  { value: '13:00', label: '13:00' },
  { value: '14:00', label: '14:00' },
  { value: '15:00', label: '15:00' },
  { value: '16:00', label: '16:00' },
  { value: '17:00', label: '17:00' },
  { value: '18:00', label: '18:00' },
  { value: '19:00', label: '19:00' },
  { value: '20:00', label: '20:00' },
  { value: '21:00', label: '21:00' },
  { value: '22:00', label: '22:00' },
  { value: '23:00', label: '23:00' },
  { value: '00:00', label: '00:00' },
  { value: '01:00', label: '01:00' },
  { value: '02:00', label: '02:00' },
  { value: '03:00', label: '03:00' },
]

const validateForm = () => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Nama lengkap wajib diisi'
  }

  if (!form.value.phone.trim()) {
    errors.value.phone = 'Nomor telepon wajib diisi'
  } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(form.value.phone)) {
    errors.value.phone = 'Nomor telepon tidak valid'
  }

  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Format email tidak valid'
  }

  if (!form.value.reservation_date) {
    errors.value.reservation_date = 'Tanggal wajib dipilih'
  } else if (form.value.reservation_date < today) {
    errors.value.reservation_date = 'Tanggal tidak boleh di masa lalu'
  }

  if (!form.value.reservation_time) {
    errors.value.reservation_time = 'Jam wajib dipilih'
  }

  if (!form.value.guest_count || parseInt(form.value.guest_count) < 1) {
    errors.value.guest_count = 'Jumlah tamu minimal 1'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  submitError.value = ''

  try {
    const { error } = await supabase
      .from('reservations')
      .insert({
        name: form.value.name.trim(),
        phone: form.value.phone.trim(),
        email: form.value.email.trim() || null,
        reservation_date: form.value.reservation_date,
        reservation_time: form.value.reservation_time,
        guest_count: parseInt(form.value.guest_count),
        notes: form.value.notes.trim() || null,
        status: 'pending',
      })

    if (error) throw error

    submitted.value = true
  } catch (err) {
    console.error('Reservation error:', err)
    submitError.value = 'Gagal mengirim reservasi. Silakan coba lagi.'
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    phone: '',
    email: '',
    reservation_date: '',
    reservation_time: '',
    guest_count: '',
    notes: '',
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
          <div class="eyebrow mb-6 animate-slide-up" style="--reveal-delay: 0ms;">Reservasi</div>
          <h1 class="font-serif text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] text-ink-900 mb-6 animate-slide-up" style="--reveal-delay: 120ms;">
            Amankan
            <em class="text-brand-600" style="font-family: var(--font-serif); font-style: italic;">meja</em>
            favoritmu
          </h1>
          <p class="text-lg text-ink-500 max-w-xl mx-auto animate-slide-up" style="--reveal-delay: 240ms;">
            Cocok untuk rombongan, acara buka bersama, atau sekadar nongkrong santai. Bayar di tempat, konfirmasi via WhatsApp.
          </p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container-main">
        <div class="max-w-2xl mx-auto">
          <div class="card p-8 will-animate">
            <div class="text-center mb-8">
              <h2 class="font-serif text-2xl text-ink-900">Form Reservasi</h2>
              <p class="text-ink-500 text-sm mt-2">Isi detail di bawah — tim kami akan mengonfirmasi secepatnya.</p>
            </div>
            
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
                  v-model="form.phone"
                  label="Nomor WhatsApp/Telepon"
                  placeholder="08xx-xxxx-xxxx"
                  type="tel"
                  required
                  :error="errors.phone"
                  autocomplete="tel"
                />
              </div>

              <div class="grid sm:grid-cols-2 gap-5">
                <Input
                  v-model="form.email"
                  label="Email (opsional)"
                  placeholder="email@contoh.com"
                  type="email"
                  :error="errors.email"
                  autocomplete="email"
                />
                <Select
                  v-model="form.guest_count"
                  label="Jumlah Tamu"
                  :options="guestOptions"
                  required
                  :error="errors.guest_count"
                />
              </div>

              <div class="grid sm:grid-cols-2 gap-5">
                <Input
                  v-model="form.reservation_date"
                  label="Tanggal"
                  type="date"
                  :min="today"
                  required
                  :error="errors.reservation_date"
                />
                <Select
                  v-model="form.reservation_time"
                  label="Jam"
                  :options="timeOptions"
                  required
                  :error="errors.reservation_time"
                />
              </div>

              <div>
                <label for="notes" class="label">Catatan (opsional)</label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  rows="3"
                  class="input resize-none"
                  placeholder="Contoh: butuh kursi bayi, preferensi area outdoor, dll."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                full-width
                :loading="submitting"
                :disabled="submitting"
              >
                {{ submitting ? 'Mengirim...' : 'Kirim Reservasi' }}
              </Button>
            </form>

            <!-- Success State per DESIGN.md §91-92 -->
            <div v-if="submitted" class="text-center py-8 animate-fade-in">
              <div class="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                <Icons name="CheckIcon" class="w-8 h-8 text-sage-600" />
              </div>
              <h3 class="font-serif text-2xl text-ink-900 mb-2">Reservasi Terkirim!</h3>
              <p class="text-ink-600 mb-2">Terima kasih {{ form.name }}, reservasi kamu telah kami terima.</p>
              <Badge variant="pending" class="text-base px-4 py-2 mb-6 inline-block">Status: Pending Confirmation</Badge>
              <p class="text-ink-500 text-sm mb-6">Tim kami akan mengonfirmasi via WhatsApp/telepon dalam 1x24 jam.</p>
              <Button variant="secondary" @click="resetForm">Buat Reservasi Baru</Button>
            </div>
          </div>

          <div class="mt-8 p-6 bg-ink-950 text-white rounded-token-lg will-animate">
            <h4 class="font-medium mb-4 flex items-center gap-2">
              <Icons name="CalendarIcon" class="w-5 h-5 text-brand-400" />
              Informasi Penting
            </h4>
            <ul class="text-ink-300 text-sm space-y-2.5">
              <li class="flex items-start gap-2">
                <span class="text-brand-400">→</span> Reservasi dikonfirmasi via WhatsApp/telepon oleh tim kami
              </li>
              <li class="flex items-start gap-2">
                <span class="text-brand-400">→</span> Meja dijamin selama 15 menit dari jam reservasi
              </li>
              <li class="flex items-start gap-2">
                <span class="text-brand-400">→</span> Untuk rombongan &gt;10 orang, hubungi kami langsung
              </li>
              <li class="flex items-start gap-2">
                <span class="text-brand-400">→</span> Bisa dibatalkan via balasan konfirmasi WhatsApp
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>