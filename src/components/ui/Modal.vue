<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: String,
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl', 'full'].includes(v),
  },
  closeOnOverlayClick: { type: Boolean, default: true },
  showCloseButton: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'close'])

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
}

const focusableElementsSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
let previousActiveElement = null
let focusableElements = []

const trapFocus = (e) => {
  if (e.key !== 'Tab') return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    }
  } else {
    if (document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    close()
  } else {
    trapFocus(e)
  }
}

const close = () => {
  emit('update:modelValue', false)
  emit('close')
  document.removeEventListener('keydown', handleKeydown)
  if (previousActiveElement) {
    previousActiveElement.focus()
  }
}

const handleOverlayClick = (e) => {
  if (closeOnOverlayClick && e.target === e.currentTarget) {
    close()
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    previousActiveElement = document.activeElement
    document.addEventListener('keydown', handleKeydown)
    nextTick(() => {
      const modal = document.querySelector('[data-modal]')
      if (modal) {
        focusableElements = Array.from(modal.querySelectorAll(focusableElementsSelector))
        const firstFocusable = focusableElements[0]
        if (firstFocusable) firstFocusable.focus()
      }
    })
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
}, { immediate: true })

import { watch, nextTick } from 'vue'
</script>

<template>
  <Transition name="modal-fade" @after-leave="() => emit('close')">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" @click="handleOverlayClick">
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="fixed inset-0 bg-ink-950/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
        <div
          ref="modal"
          data-modal
          :class="['relative w-full bg-white rounded-token-lg shadow-token-xl', sizeClasses[size]]"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? 'modal-title' : undefined"
        >
          <div class="flex items-center justify-between p-4 border-b border-ink-200">
            <h2 v-if="title" id="modal-title" class="text-lg font-semibold text-ink-900">
              {{ title }}
            </h2>
            <button
              v-if="showCloseButton"
              type="button"
              class="btn-ghost p-1.5 rounded-token-md"
              @click="close"
              aria-label="Tutup modal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-4">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>