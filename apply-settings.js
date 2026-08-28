import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env: set SUPABASE_URL and SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const settings = [
  { key: 'business_name', value: 'Menes Coffee & Eatery' },
  { key: 'address', value: 'Jl. Kartini, No. 24, Padang Pasir, Kota Padang, Sumatera Barat' },
  { key: 'phone', value: '' },
  { key: 'email', value: '' },
  { key: 'instagram', value: 'https://instagram.com/menescoffee' },
  { key: 'tiktok', value: 'https://tiktok.com/@menescoffee' },
  { key: 'google_maps', value: 'https://www.google.com/maps/place/Menes+Coffee+%26+Eatery+-+Padang/@-0.9406298,100.3597797,18z' },
  { key: 'opening_hours', value: {
    monday: { open: '09:00', close: '03:00', closed: false },
    tuesday: { open: '09:00', close: '03:00', closed: false },
    wednesday: { open: '09:00', close: '03:00', closed: false },
    thursday: { open: '09:00', close: '03:00', closed: false },
    friday: { open: '09:00', close: '03:00', closed: false },
    saturday: { open: '09:00', close: '03:00', closed: false },
    sunday: { open: '09:00', close: '03:00', closed: false },
  }},
]

async function applySettings() {
  for (const setting of settings) {
    const { error } = await supabase
      .from('settings')
      .upsert(setting, { onConflict: 'key' })
    
    if (error) {
      console.error(`Error updating ${setting.key}:`, error)
    } else {
      console.log(`✅ Updated ${setting.key}`)
    }
  }
  console.log('\n✨ All settings applied!')
}

applySettings()