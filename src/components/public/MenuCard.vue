<script setup>
import Icons from '@/components/ui/Icons.vue'

defineProps({
  item: {
    type: Object,
    required: true,
  },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'featured', 'compact'].includes(v),
  },
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
</script>

<template>
  <article
    :class="[
      'card group rounded-token-2xl',
      variant === 'compact' ? 'flex flex-row' : '',
    ]"
  >
    <div
      :class="[
        'relative overflow-hidden',
        variant === 'compact' ? 'w-24 h-24 flex-shrink-0 rounded-token-lg m-3' : 'aspect-[4/3] rounded-token-2xl',
      ]"
    >
      <img
        v-if="item.image_url"
        :src="item.image_url"
        :alt="item.name"
        :class="[
          'w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]',
          variant === 'compact' ? '' : 'group-hover:scale-105',
        ]"
        loading="lazy"
      />
      <div v-else :class="['w-full h-full bg-ink-100 flex items-center justify-center', variant === 'compact' ? '' : 'text-ink-400']">
        <Icons v-if="variant !== 'compact'" name="ImageIcon" class="w-12 h-12" />
        <Icons v-else name="ImageIcon" class="w-6 h-6" />
      </div>

      <!-- Sold Out Overlay -->
      <div v-if="!item.is_available" class="absolute inset-0 bg-black/50 flex items-center justify-center">
        <span class="badge bg-brand-100 text-brand-800 text-base px-4 py-2">
          Habis
        </span>
      </div>

      <!-- Featured Badge -->
      <div v-if="item.is_featured" class="absolute top-3 left-3">
        <span class="badge bg-accent-gold/20 text-accent-gold border border-accent-gold/30 px-2.5 py-1 text-xs">
          Featured
        </span>
      </div>

      <!-- Popular Badge -->
      <div v-if="item.is_popular" class="absolute top-3 right-3">
        <span class="badge bg-brand-100 text-brand-800 px-2.5 py-1 text-xs">
          Popular
        </span>
      </div>
    </div>

    <div
      :class="[
        variant === 'compact' ? 'p-4 flex-1 flex flex-col justify-center' : 'p-5',
      ]"
    >
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 :class="['font-semibold text-ink-900 flex-1', variant === 'compact' ? 'text-base' : 'text-lg']">
          {{ item.name }}
        </h3>
        <span :class="['font-bold text-brand-600 whitespace-nowrap', variant === 'compact' ? 'text-base' : 'text-lg']">
          Rp {{ formatPrice(item.price) }}
        </span>
      </div>

      <p v-if="item.description && variant !== 'compact'" class="text-ink-600 text-sm line-clamp-2 mb-3">
        {{ item.description }}
      </p>

      <div class="flex items-center justify-between">
        <span
          :class="[
            'badge',
            item.is_available ? 'badge-available' : 'badge-sold-out',
            variant === 'compact' ? 'text-xs' : '',
          ]"
        >
          {{ item.is_available ? 'Tersedia' : 'Habis' }}
        </span>
        <span v-if="item.category_name" class="text-ink-500 text-xs">
          {{ item.category_name }}
        </span>
      </div>
    </div>
  </article>
</template>
