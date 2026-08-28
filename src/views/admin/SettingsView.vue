<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Icons from '@/components/ui/Icons.vue'

const settings = ref({
  business_name: 'Menes Coffee & Eatery',
  address: 'Jl. Kartini No. 24, Padang Pasir, Kec. Padang Barat, Kota Padang, Sumatera Barat',
  phone: '',
  email: '',
  instagram: 'https://instagram.com/menescoffee',
  tiktok: 'https://tiktok.com/@menescoffee',
  google_maps: 'https://www.google.com/maps/place/Menes+Coffee+%26+Eatery+-+Padang/@-0.9406298,100.3597797,18z',
  opening_hours: {
    monday: { open: '08:00', close: '04:00', closed: false },
    tuesday: { open: '08:00', close: '04:00', closed: false },
    wednesday: { open: '08:00', close: '04:00', closed: false },
    thursday: { open: '08:00', close: '04:00', closed: false },
    friday: { open: '08:00', close: '04:00', closed: false },
    saturday: { open: '08:00', close: '04:00', closed: false },
    sunday: { open: '08:00', close: '04:00', closed: false },
  }
})

const days = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
  { key: 'sunday', label: 'Minggu' },
]

const errors = ref({})
const saving = ref(false)
const saved = ref(false)

const fetchSettings = async () => {
  try {
    const { data } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['business_name', 'address', 'phone', 'email', 'instagram', 'tiktok', 'google_maps', 'opening_hours'])

    if (data) {
      data.forEach(item => {
        if (item.key === 'opening_hours') {
          settings.value.opening_hours = { ...settings.value.opening_hours, ...item.value }
        } else {
          settings.value[item.key] = item.value
        }
      })
    }
  } catch (err) {
    console.error('Failed to load settings:', err)
  }
}

const saveSettings = async () => {
  errors.value = {}
  saving.value = true
  saved.value = false

  try {
    const updates = [
      { key: 'business_name', value: settings.value.business_name },
      { key: 'address', value: settings.value.address },
      { key: 'phone', value: settings.value.phone },
      { key: 'email', value: settings.value.email },
      { key: 'instagram', value: settings.value.instagram },
      { key: 'tiktok', value: settings.value.tiktok },
      { key: 'google_maps', value: settings.value.google_maps },
      { key: 'opening_hours', value: settings.value.opening_hours },
    ]

    for (const update of updates) {
      const { error } = await supabase
        .from('settings')
        .upsert(update, { onConflict: 'key' })

      if (error) throw error
    }

    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
  } catch (err) {
    console.error('Save settings error:', err)
    errors.value.form = 'Gagal menyimpan pengaturan'
  } finally {
    saving.value = false
  }
}

onMounted(fetchSettings)
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <div>
      <h1 class="font-serif text-3xl text-ink-900">Pengaturan Umum</h1>
      <p class="text-ink-500 mt-1">Kelola informasi bisnis, jam buka, dan media sosial</p>
    </div>

    <form @submit.prevent="saveSettings" class="space-y-8">
      <!-- Business Info -->
      <section class="card p-6">
        <h2 class="font-serif text-xl text-ink-900 mb-6 flex items-center gap-2">
          <Icons name="SettingsIcon" class="w-6 h-6 text-terracotta-600" />
          Informasi Bisnis
        </h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <Input v-model="settings.business_name" label="Nama Bisnis" required :error="errors.business_name" />
          <Input v-model="settings.phone" label="Telepon/WhatsApp" type="tel" placeholder="08xx-xxxx-xxxx" />
          <Input v-model="settings.email" label="Email" type="email" placeholder="info@menespadang.com" />
          <Input v-model="settings.address" label="Alamat Lengkap" :rows="3" type="textarea" />
        </div>
      </section>

      <!-- Opening Hours -->
      <section class="card p-6">
        <h2 class="font-serif text-xl text-ink-900 mb-6 flex items-center gap-2">
          <Icons name="CalendarIcon" class="w-6 h-6 text-terracotta-600" />
          Jam Buka
        </h2>
        <p class="text-ink-500 text-sm mb-4">Atur jam buka setiap hari. Centang "Tutup" untuk hari libur.</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="day in days" :key="day.key" class="space-y-2 p-4 bg-ink-50 rounded-token-md">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                v-model="day.closed"
                class="w-4 h-4 rounded-token-sm border-ink-300 text-terracotta-600 focus:ring-terracotta-500"
              />
              <span class="font-medium text-ink-900 capitalize">{{ day.label }}</span>
            </label>
            <div v-show="!day.closed" class="grid grid-cols-2 gap-2 pl-6">
              <Input v-model="day.open" label="Buka" type="time" />
              <Input v-model="day.close" label="Tutup" type="time" />
            </div>
          </div>
        </div>
      </section>

      <!-- Social Media -->
      <section class="card p-6">
        <h2 class="font-serif text-xl text-ink-900 mb-6 flex items-center gap-2">
          <Icons name="PhotoIcon" class="w-6 h-6 text-terracotta-600" />
          Media Sosial
        </h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <Input v-model="settings.instagram" label="Instagram URL" placeholder="https://instagram.com/menescoffee" />
          <Input v-model="settings.tiktok" label="TikTok URL" placeholder="https://tiktok.com/@menescoffee" />
          <Input v-model="settings.google_maps" label="Google Maps URL" placeholder="https://maps.google.com/..." />
        </div>
      </section>

      <div class="flex justify-end">
        <Button variant="primary" size="lg" type="submit" :loading="saving">
          <Icons name="SaveIcon" class="w-5 h-5" /> {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </Button>
      </div>
    </form>

    <div v-if="saved" class="p-4 bg-sage-50 border border-sage-200 rounded-token-lg text-sage-800 animate-fade-in">
      Pengaturan berhasil disimpan!
    </div>
    <div v-if="errors.form" class="p-4 bg-terracotta-50 border border-terracotta-200 rounded-token-lg text-terracotta-700 animate-fade-in">
      {{ errors.form }}
    </div>
  </div>
</template>