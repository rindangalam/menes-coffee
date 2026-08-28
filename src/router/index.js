import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/public/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/public/HomeView.vue'),
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/public/MenuView.vue'),
      },
      {
        path: 'tentang',
        name: 'About',
        component: () => import('@/views/public/AboutView.vue'),
      },
      {
        path: 'lokasi',
        name: 'Location',
        component: () => import('@/views/public/LocationView.vue'),
      },
      {
        path: 'reservasi',
        name: 'Reservation',
        component: () => import('@/views/public/ReservationView.vue'),
      },
      {
        path: 'kontak',
        name: 'Contact',
        component: () => import('@/views/public/ContactView.vue'),
      },
      {
        path: 'galeri',
        name: 'Gallery',
        component: () => import('@/views/public/GalleryView.vue'),
      },
      {
        path: 'promo',
        name: 'Promo',
        component: () => import('@/views/public/PromoView.vue'),
      },
    ],
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/LoginView.vue'),
    meta: { requiresAuth: false, isAdmin: true },
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, isAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
      },
      {
        path: 'menu',
        name: 'AdminMenu',
        component: () => import('@/views/admin/MenuManagerView.vue'),
      },
      {
        path: 'reservasi',
        name: 'AdminReservations',
        component: () => import('@/views/admin/ReservationManagerView.vue'),
      },
      {
        path: 'pesan',
        name: 'AdminMessages',
        component: () => import('@/views/admin/MessagesView.vue'),
      },
      {
        path: 'galeri',
        name: 'AdminGallery',
        component: () => import('@/views/admin/GalleryManagerView.vue'),
      },
      {
        path: 'testimoni',
        name: 'AdminTestimonials',
        component: () => import('@/views/admin/TestimonialsManagerView.vue'),
      },
      {
        path: 'promo',
        name: 'AdminPromo',
        component: () => import('@/views/admin/PromoManagerView.vue'),
      },
      {
        path: 'pengaturan',
        name: 'AdminSettings',
        component: () => import('@/views/admin/SettingsView.vue'),
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/AdminUsersView.vue'),
        meta: { requiresSuperadmin: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach(async (to, from, next) => {
  const { supabase } = await import('@/lib/supabase')
  const { data: { session } } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.isAdmin && session) {
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('auth_uid', session.user.id)
      .single()

    if (!adminUser) {
      next({ name: 'AdminLogin' })
      return
    }

    if (to.meta.requiresSuperadmin && adminUser.role !== 'superadmin') {
      next({ name: 'AdminDashboard' })
      return
    }
  }

  next()
})

export default router