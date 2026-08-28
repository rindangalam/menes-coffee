<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Icons from '@/components/ui/Icons.vue'

const admins = ref([])
const loading = ref(true)
const currentUserId = ref(null)
const currentUserRole = ref('staff')

const showModal = ref(false)
const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'staff',
})
const errors = ref({})
const saving = ref(false)

const showDeleteModal = ref(false)
const deletingAdmin = ref(null)
const deleting = ref(false)

const roleOptions = [
  { value: 'staff', label: 'Staff' },
  { value: 'superadmin', label: 'Superadmin' },
]

const formatDateTime = (dateTimeStr) => {
  return new Date(dateTimeStr).toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const fetchAdmins = async () => {
  loading.value = true
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      currentUserId.value = user.id
      const { data: currentAdmin } = await supabase
        .from('admin_users')
        .select('role')
        .eq('auth_uid', user.id)
        .single()
      currentUserRole.value = currentAdmin?.role || 'staff'
    }

    // Fetch all admins with auth users
    const { data, error } = await supabase
      .from('admin_users')
      .select(`
        *,
        auth_users:auth_uid (email)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    admins.value = data || []
  } catch (err) {
    console.error('Failed to load admins:', err)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  // Only superadmin can add admins
  if (currentUserRole.value !== 'superadmin') {
    alert('Hanya superadmin yang bisa menambah admin')
    return
  }
  form.value = {
    name: '',
    email: '',
    password: '',
    role: 'staff',
  }
  errors.value = {}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    name: '',
    email: '',
    password: '',
    role: 'staff',
  }
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}
  if (!form.value.name.trim()) errors.value.name = 'Nama wajib diisi'
  if (!form.value.email.trim()) errors.value.email = 'Email wajib diisi'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = 'Format email tidak valid'
  if (!form.value.password) errors.value.password = 'Password wajib diisi'
  else if (form.value.password.length < 6) errors.value.password = 'Password minimal 6 karakter'
  if (!form.value.role) errors.value.role = 'Role wajib dipilih'
  return Object.keys(errors.value).length === 0
}

const saveAdmin = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: form.value.email.trim(),
      password: form.value.password,
      email_confirm: true,
    })

    if (authError) throw authError

    // Create admin user record
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        auth_uid: authData.user.id,
        name: form.value.name.trim(),
        role: form.value.role,
      })

    if (adminError) {
      // Cleanup auth user if admin creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw adminError
    }

    closeModal()
    await fetchAdmins()
  } catch (err) {
    console.error('Save admin error:', err)
    errors.value.form = err.message || 'Gagal menambah admin'
  } finally {
    saving.value = false
  }
}

const confirmDelete = (admin) => {
  if (currentUserRole.value !== 'superadmin') {
    alert('Hanya superadmin yang bisa menghapus admin')
    return
  }
  if (admin.id === currentUserId.value) {
    alert('Tidak bisa menghapus akun sendiri')
    return
  }
  deletingAdmin.value = admin
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingAdmin.value = null
}

const deleteAdmin = async () => {
  if (!deletingAdmin.value) return

  deleting.value = true
  try {
    // Delete from admin_users (cascades to auth.users via foreign key)
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', deletingAdmin.value.id)

    if (error) throw error

    closeDeleteModal()
    await fetchAdmins()
  } catch (err) {
    console.error('Delete admin error:', err)
  } finally {
    deleting.value = false
  }
}

onMounted(fetchAdmins)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="font-serif text-3xl text-ink-900">Manajemen Admin</h1>
        <p class="text-ink-500 mt-1">Kelola akun staff dan superadmin (hanya superadmin)</p>
      </div>
      <Button variant="primary" @click="openAddModal">
        <Icons name="UserPlusIcon" class="w-5 h-5" /> Tambah Admin
      </Button>
    </div>

    <div class="card overflow-hidden">
      <div v-if="loading" class="p-6">
        <div class="space-y-3">
          <div class="h-4 bg-ink-200 rounded-token-sm animate-pulse w-1/4" />
          <div class="h-4 bg-ink-200 rounded-token-sm animate-pulse w-1/4" />
          <div class="h-4 bg-ink-200 rounded-token-sm animate-pulse w-1/4" />
        </div>
      </div>
      <table class="w-full" v-else>
        <thead>
          <tr class="text-left text-sm text-ink-500 border-b border-ink-200 bg-ink-50">
            <th class="p-4 font-medium">Nama</th>
            <th class="p-4 font-medium">Email</th>
            <th class="p-4 font-medium">Role</th>
            <th class="p-4 font-medium">Dibuat</th>
            <th class="p-4 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-ink-200">
          <tr v-for="admin in admins" :key="admin.id" class="hover:bg-ink-50">
            <td class="p-4 font-medium text-ink-900">{{ admin.name }}</td>
            <td class="p-4 text-ink-600">{{ admin.auth_users?.email || '-' }}</td>
            <td class="p-4">
              <Badge :variant="admin.role === 'superadmin' ? 'featured' : 'default'">{{ admin.role }}</Badge>
            </td>
            <td class="p-4 text-ink-500 text-sm">{{ formatDateTime(admin.created_at) }}</td>
            <td class="p-4 text-right">
              <Button
                v-if="admin.id !== currentUserId && currentUserRole === 'superadmin'"
                variant="ghost"
                size="sm"
                class="text-terracotta-600 hover:bg-terracotta-50"
                @click="confirmDelete(admin)"
              >
                <Icons name="TrashIcon" class="w-4 h-4" /> Hapus
              </Button>
              <span v-else-if="admin.id === currentUserId" class="text-ink-400 text-sm">Akun Anda</span>
            </td>
          </tr>
          <tr v-if="admins.length === 0">
            <td colspan="5" class="p-8 text-center text-ink-500">Belum ada admin</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Modal -->
    <Modal v-model:modelValue="showModal" title="Tambah Admin" @close="closeModal" size="lg">
      <form @submit.prevent="saveAdmin" class="space-y-4">
        <div v-if="errors.form" class="p-3 bg-terracotta-50 border border-terracotta-200 rounded-token-md text-terracotta-700 text-sm" role="alert">
          {{ errors.form }}
        </div>

        <Input v-model="form.name" label="Nama Lengkap" required :error="errors.name" placeholder="Nama staff" />
        <Input v-model="form.email" label="Email" type="email" required :error="errors.email" placeholder="staff@menespadang.com" />
        <Input v-model="form.password" label="Password" type="password" required :error="errors.password" placeholder="Minimal 6 karakter" autocomplete="new-password" />
        <Select v-model="form.role" label="Role" :options="roleOptions" required :error="errors.role" />
        <div class="pt-4 border-t border-ink-200 flex justify-end gap-3">
          <Button variant="secondary" type="button" @click="closeModal">Batal</Button>
          <Button variant="primary" type="submit" :loading="saving">{{ saving ? 'Menyimpan...' : 'Tambah Admin' }}</Button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirm Modal -->
    <Modal v-model:modelValue="showDeleteModal" title="Hapus Admin" @close="closeDeleteModal">
      <p class="mb-6">Admin <strong>"{{ deletingAdmin?.name }}"</strong> akan dihapus. Tindakan ini tidak dapat dibatalkan.</p>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" @click="closeDeleteModal">Batal</Button>
        <Button variant="primary" class="bg-terracotta-600 hover:bg-terracotta-700" @click="deleteAdmin" :loading="deleting">Hapus</Button>
      </div>
    </Modal>
  </div>
</template>