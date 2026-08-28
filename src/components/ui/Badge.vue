<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'available', 'sold-out', 'pending', 'confirmed', 'cancelled', 'featured', 'popular'].includes(v),
  },
  text: String,
})

const variantClasses = {
  default: 'badge bg-ink-100 text-ink-700',
  available: 'badge-available',
  'sold-out': 'badge-sold-out',
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  cancelled: 'badge-cancelled',
  featured: 'badge bg-accent-gold/20 text-accent-gold border border-accent-gold/30',
  popular: 'badge bg-terracotta-100 text-terracotta-800',
}
</script>

<template>
  <span :class="variantClasses[variant]" v-if="text || $slots.default">
    <slot>{{ text }}</slot>
  </span>
</template>