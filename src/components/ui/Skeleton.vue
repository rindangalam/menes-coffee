<script setup>
defineProps({
  variant: {
    type: String,
    default: 'text',
    validator: (v) => ['text', 'card', 'image', 'circular', 'rectangular'].includes(v),
  },
  lines: { type: Number, default: 3 },
  className: String,
})

const variantClasses = {
  text: 'space-y-2',
  card: 'space-y-4',
  image: '',
  circular: '',
  rectangular: '',
}

const lineClasses = {
  text: 'h-4 w-full rounded-token-sm',
  card: 'h-4 w-full rounded-token-sm',
}
</script>

<template>
  <div :class="['skeleton', variantClasses[variant], className]">
    <template v-if="variant === 'text' || variant === 'card'">
      <div
        v-for="i in lines"
        :key="i"
        :class="[
          'animate-pulse bg-ink-200 rounded-token-sm',
          lineClasses[variant],
        ]"
        :style="{
          width: variant === 'text' && i === lines ? '60%' : '100%',
        }"
      />
    </template>
    <template v-else-if="variant === 'image'">
      <div class="aspect-[4/3] w-full animate-pulse bg-ink-200 rounded-token-lg" />
    </template>
    <template v-else-if="variant === 'circular'">
      <div class="animate-pulse bg-ink-200 rounded-full" :style="{ width: '48px', height: '48px' }" />
    </template>
    <template v-else-if="variant === 'rectangular'">
      <div class="animate-pulse bg-ink-200 rounded-token-md" :style="{ width: '100%', height: '120px' }" />
    </template>
  </div>
</template>

<style scoped>
.skeleton {
  @apply bg-ink-100;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>