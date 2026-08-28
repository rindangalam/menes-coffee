<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: String,
  placeholder: String,
  type: { type: String, default: 'text' },
  name: String,
  id: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  helperText: String,
  autocomplete: String,
})

const inputId = props.id || props.name || `input-${Math.random().toString(36).substring(2, 11)}`

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="label">
      {{ label }}
      <span v-if="required" class="text-terracotta-500 ml-0.5" aria-hidden="true">*</span>
    </label>
    <input
      :id="inputId"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined"
      :class="['input', { 'input-error': error }]"
      @input="($event) => emit('update:modelValue', $event.target.value)"
      @blur="($event) => emit('blur', $event)"
      @focus="($event) => emit('focus', $event)"
    />
    <p v-if="error" :id="`${inputId}-error`" class="error-text" role="alert">{{ error }}</p>
    <p v-else-if="helperText" :id="`${inputId}-helper`" class="helper-text">{{ helperText }}</p>
  </div>
</template>