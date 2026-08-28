<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { useSEO } from '@/composables/useSEO'

const { meta: seoMeta } = useSEO({
  title: 'Tentang Kami - Menes Coffee & Eatery Padang',
  description: 'Cerita di balik Menes Coffee & Eatery: ruang nyaman untuk mahasiswa, keluarga, dan teman-teman. Area indoor & outdoor luas, photobox, pet-friendly, buka hingga 04.00.',
})
</script>

<template>
  <div class="min-h-screen">
    <section class="section bg-white border-b border-ink-100">
      <div class="container-main">
        <h1 class="font-serif text-4xl md:text-5xl text-ink-900 mb-2">Tentang Kami</h1>
        <p class="text-ink-500">Cerita di balik Menes Coffee & Eatery</p>
      </div>
    </section>

    <section class="section bg-paper-50">
      <div class="container-main">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="relative aspect-[4/3] rounded-token-xl overflow-hidden shadow-token-lg">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80"
              alt="Interior Menes Coffee & Eatery"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 class="font-serif text-3xl md:text-4xl text-ink-900 mb-6">Ruang untuk Semua Momen</h2>
            <p class="text-ink-600 leading-relaxed mb-6">
              Menes Coffee & Eatery lahir dari keinginan menciptakan tempat yang benar-benar nyaman untuk semua orang.
              Dari mahasiswa yang butuh tempat ngerjain tugas, anak muda yang mau nongkrong bareng temen-temen,
              keluarga yang mau makan malam bareng, hingga yang butuh tempat meeting santai atau acara spesial seperti buka bersama.
            </p>
            <p class="text-ink-600 leading-relaxed mb-8">
              Buka dari pagi hingga dini hari (08.00–04.00), kami hadir dengan menu yang beragam — kopi signature,
              makanan berat khas Padang, pizza, pasta, hingga dessert — semua dengan harga yang terjangkau.
            </p>
            <div class="flex flex-wrap gap-3">
              <span class="badge-available">Indoor & Outdoor Luas</span>
              <span class="badge-available">Late Night Sampai 04:00</span>
              <span class="badge-available">Photobox Aesthetic</span>
              <span class="badge-available">Pet Friendly</span>
              <span class="badge-available">Family Friendly</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>