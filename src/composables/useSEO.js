import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const defaultMeta = {
  title: 'Menes Coffee & Eatery - Padang',
  description: 'Tempat ngopi, makan, dan nongkrong sampai larut. Area indoor & outdoor luas, photobox, pet-friendly di jantung Padang.',
  image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80',
  url: 'https://menespadang.com',
  type: 'website',
}

const siteName = 'Menes Coffee & Eatery'

export function useSEO(options = {}) {
  const route = useRoute()
  const router = useRouter()

  const meta = ref({
    title: options.title || defaultMeta.title,
    description: options.description || defaultMeta.description,
    image: options.image || defaultMeta.image,
    url: options.url || `${defaultMeta.url}${route.path}`,
    type: options.type || defaultMeta.type,
    ...options,
  })

  const updateMeta = (newMeta) => {
    meta.value = { ...meta.value, ...newMeta }
  }

  const setPageMeta = async (pageData) => {
    if (pageData) {
      meta.value = {
        title: pageData.meta_title || `${pageData.title} | ${siteName}`,
        description: pageData.meta_description || pageData.description || defaultMeta.description,
        image: pageData.og_image || pageData.image || defaultMeta.image,
        url: `${defaultMeta.url}${route.path}`,
        type: pageData.type || 'website',
      }
    }
  }

  const injectMetaTags = () => {
    // Remove existing dynamic meta tags
    document.querySelectorAll('meta[data-vue-seo]').forEach(el => el.remove())
    document.querySelectorAll('link[data-vue-seo]').forEach(el => el.remove())

    const head = document.head

    const tags = [
      { name: 'title', content: meta.value.title },
      { name: 'description', content: meta.value.description },
      { property: 'og:title', content: meta.value.title },
      { property: 'og:description', content: meta.value.description },
      { property: 'og:image', content: meta.value.image },
      { property: 'og:url', content: meta.value.url },
      { property: 'og:type', content: meta.value.type },
      { property: 'og:site_name', content: siteName },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: meta.value.title },
      { name: 'twitter:description', content: meta.value.description },
      { name: 'twitter:image', content: meta.value.image },
    ]

    tags.forEach(tag => {
      const metaEl = document.createElement('meta')
      Object.entries(tag).forEach(([key, value]) => {
        metaEl.setAttribute(key, value)
      })
      metaEl.setAttribute('data-vue-seo', 'true')
      head.appendChild(metaEl)
    })

    // Canonical URL
    const canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    canonical.setAttribute('href', meta.value.url)
    canonical.setAttribute('data-vue-seo', 'true')
    head.appendChild(canonical)

    // Update document title
    document.title = meta.value.title
  }

  onMounted(() => {
    injectMetaTags()
  })

  watch(() => route.path, () => {
    meta.value.url = `${defaultMeta.url}${route.path}`
    injectMetaTags()
  })

  return {
    meta,
    updateMeta,
    setPageMeta,
    injectMetaTags,
  }
}