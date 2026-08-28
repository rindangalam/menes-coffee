<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { onMounted } from 'vue'

const router = useRouter()
const route = useRoute()

const form = ref({
  email: '',
  password: '',
})

const errors = ref({})
const loading = ref(false)
const errorMessage = ref('')

const validateForm = () => {
  errors.value = {}
  if (!form.value.email) errors.value.email = 'Email wajib diisi'
  if (!form.value.password) errors.value.password = 'Password wajib diisi'
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password,
    })

    if (error) {
      errorMessage.value = 'Email atau password salah'
      return
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('auth_uid', (await supabase.auth.getUser()).data.user?.id)
      .single()

    if (!adminUser) {
      await supabase.auth.signOut()
      errorMessage.value = 'Akun ini tidak memiliki akses admin'
      return
    }

    const redirect = route.query.redirect || '/admin'
    router.push(redirect)
  } catch (err) {
    errorMessage.value = 'Terjadi kesalahan, coba lagi'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    const redirect = route.query.redirect || '/admin'
    router.push(redirect)
  }
})
</script>

<template>
  <div class="min-h-screen bg-ink-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="font-serif text-3xl text-ink-900 mb-2">Menes Coffee & Eatery</h1>
        <p class="text-ink-500">Admin Panel Login</p>
      </div>

      <div class="card p-8">
        <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
          <div v-if="errorMessage" class="p-3 bg-brand-50 border border-brand-200 rounded-token-md text-brand-700 text-sm" role="alert">
            {{ errorMessage }}
          </div>

          <Input
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="admin@menespadang.com"
            required
            :error="errors.email"
            autocomplete="email"
          />

          <Input
            v-model="form.password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            :error="errors.password"
            autocomplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            full-width
            :loading="loading"
          >
            Masuk
          </Button>
        </form>

        <div class="mt-6 text-center text-sm text-ink-500">
          <p>Kembali ke <a href="/" class="text-brand-600 hover:underline">Website Publik</a></p>
        </div>
      </div>
    </div>
  </div>
</template>