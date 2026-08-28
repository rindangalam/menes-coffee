<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: String,
  placeholder: String,
  name: String,
  id: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  helperText: String,
  options: {
    type: Array,
    default: () => [],
  },
  optionValue: { type: String, default: 'value' },
  optionLabel: { type: String, default: 'label' },
})

const selectId = props.id || props.name || `select-${Math.random().toString(36).substring(2, 11)}`

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change'])
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="selectId" class="label">
      {{ label }}
      <span v-if="required" class="text-terracotta-500 ml-0.5" aria-hidden="true">*</span>
    </label>
    <select
      :id="selectId"
      :name="name"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined"
      :class="['input', { 'input-error': error }]"
      @input="($event) => emit('update:modelValue', $event.target.value)"
      @blur="($event) => emit('blur', $event)"
      @focus="($event) => emit('focus', $event)"
      @change="($event) => emit('change', $event.target.value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option[optionValue]"
        :value="option[optionValue]"
      >
        {{ option[optionLabel] }}
      </option>
    </select>
    <p v-if="error" :id="`${selectId}-error`" class="error-text" role="alert">{{ error }}</p>
    <p v-else-if="helperText" :id="`${selectId}-helper`" class="helper-text">{{ helperText }}</p>
  </div>
</template>