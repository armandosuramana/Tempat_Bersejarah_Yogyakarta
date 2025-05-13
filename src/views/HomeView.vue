<template>
  <div class="home-container"> <!-- Kontainer utama halaman -->
    <h2 class="title">Daftar Tempat Bersejarah</h2>

    <div class="places"> <!-- Grid untuk semua tempat -->
      <div v-for="place in filteredPlaces" :key="place.name"> <!-- Loop data tempat -->
        <img v-if="place.image" :src="place.image" :alt="place.name" class="main-image" /> <!-- Tampilkan gambar jika tersedia -->
        <h2 class="place-name">{{ place.name }}</h2> <!-- Menampilkan nama tempat -->
        <button class="detail-btn" @click="showDetails(place.name)"> <!-- Tombol ke halaman detail -->
          Lihat Detail
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import fungsi dari Vue dan library lain yang dibutuhkan
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

// State untuk menyimpan data tempat bersejarah
const places = ref([])

// Router untuk navigasi halaman
const router = useRouter()
const route = useRoute() // Mengakses parameter dari URL (misalnya ?search=keraton)

// Ambil data dari Fuseki ketika komponen di-mount
onMounted(async () => {
  const query = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>

    SELECT ?individu ?comment
    WHERE {
      VALUES ?individu {
        tb:KeratonYogyakarta
        tb:TamanSari
        tb:BentengVredeburg
        tb:CandiPrambanan
        tb:CandiBorobudur
      }
      OPTIONAL { ?individu rdfs:comment ?comment }
    }
  `

  try {
    // Kirim permintaan SPARQL ke Fuseki
    const response = await axios.get('http://localhost:3030/TempatBersejarah/query', {
      params: { query },
      headers: {
        Accept: 'application/sparql-results+json'
      }
    })

    const results = response.data.results.bindings

    const uniqueMap = new Map()

    // Proses hasil query menjadi format array yang dapat ditampilkan
    results.forEach(item => {
      const uri = item.individu.value
      if (!uniqueMap.has(uri)) {
        const nameKey = uri.includes('#') ? uri.split('#')[1] : uri.split('/').pop()
        uniqueMap.set(uri, {
          name: formatName(nameKey), // Format nama agar lebih manusiawi
          description: item.comment?.value || '', // Ambil deskripsi jika ada
          image: getImage(nameKey) // Ambil URL gambar berdasarkan nama
        })
      }
    })

    // Simpan hasil akhir ke state
    places.value = Array.from(uniqueMap.values())
  } catch (error) {
    console.error('Gagal ambil data dari Fuseki:', error)
  }
})

// Ambil query pencarian dari URL (?search=...)
const searchQuery = computed(() => route.query.search || '')

// Filter tempat berdasarkan input pencarian
const filteredPlaces = computed(() => {
  if (!searchQuery.value) return places.value
  return places.value.filter(place =>
    place.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    place.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Fungsi bantu untuk memformat nama URI menjadi lebih manusiawi
function formatName(name) {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()
}

// Fungsi untuk mengambil gambar berdasarkan nama tempat
function getImage(nameKey) {
  try {
    switch (nameKey.toLowerCase()) {
      case 'keratonyogyakarta':
        return new URL('@/assets/Keraton Yogyakarta.jpg', import.meta.url).href
      case 'tamansari':
        return new URL('@/assets/Taman Sari.jpg', import.meta.url).href
      case 'bentengvredeburg':
        return new URL('@/assets/Benteng Vredeburg.jpg', import.meta.url).href
      case 'candiprambanan':
        return new URL('@/assets/Candi Prambanan.jpg', import.meta.url).href
      case 'candiborobudur':
        return new URL('@/assets/Candi Borobudur.jpg', import.meta.url).href
      default:
        return ''
    }
  } catch (e) {
    console.warn('Gambar tidak ditemukan untuk:', nameKey)
    return ''
  }
}

// Fungsi untuk berpindah ke halaman detail berdasarkan nama tempat
function showDetails(placeName) {
  switch (placeName.toLowerCase()) {
    case 'keraton yogyakarta':
      router.push({ name: 'DetailKeraton' })
      break
    case 'candi prambanan':
      router.push({ name: 'DetailCandiPrambanan' })
      break
    case 'benteng vredeburg':
      router.push({ name: 'DetailBentengVredeburg' })
      break
    case 'taman sari':
      router.push({ name: 'DetailTamanSari' })
      break
    case 'candi borobudur':
      router.push({ name: 'DetailCandiBorobudur' })
      break
    default:
      alert('Halaman detail belum tersedia untuk: ' + placeName)
  }
}
</script>

<style scoped>
/* Gaya utama halaman daftar */
.home-container {
  text-align: center;
  padding: 30px 20px 50px;
  background-color: #ffffff;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #333;
}

.places {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.places > div {
  padding: 10px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.main-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
}

.place-name {
  font-size: 20px;
  font-weight: 600;
  margin: 10px 0 5px;
}

.detail-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.detail-btn:hover {
  background-color: #218838;
}

/* Responsif untuk ukuran layar kecil */
@media (max-width: 900px) {
  .places {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .places {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
