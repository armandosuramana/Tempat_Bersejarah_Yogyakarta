<template>
  <div class="wrapper">
    <div class="content">
      <h1 class="title">Candi Trimurti - Candi Prambanan</h1>

      <img src="@/assets/Candi Utama.jpg" alt="Candi Prambanan" class="main-image" />

      <section class="details">
        <h2>Tiga Candi Utama Trimurti</h2>
        
        <div v-for="(candi, index) in filteredCandis" :key="index" class="candi-item">
          <h3 class="candi-name">{{ candi.nama }}</h3>
          <p class="candi-stats">Tinggi bangunan: <strong>{{ formatHeight(candi.tinggi) }}</strong></p>
          <p class="candi-desc">{{ formatDescription(candi.komentar) }}</p>
          <hr class="divider" v-if="index < filteredCandis.length - 1">
        </div>
      </section>

      <div class="button-container">
        <button class="back-button" @click="goBack">Kembali</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CandiUtamaPrambanan',
  data() {
    return {
      candis: []
    };
  },
  computed: {
    filteredCandis() {
      const unique = {};
      this.candis.forEach(candi => {
        if (!unique[candi.nama] || 
            (!unique[candi.nama].komentar && candi.komentar) ||
            (unique[candi.nama].komentar === 'Tidak ada deskripsi.' && candi.komentar)) {
          unique[candi.nama] = candi;
        }
      });
      return Object.values(unique);
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    formatDescription(desc) {
      if (!desc || desc === '') return 'Deskripsi candi ini belum tersedia.';
      return desc.endsWith('.') ? desc : desc + '.';
    },
    formatHeight(height) {
      if (!height || height === 'tidak diketahui') return 'tidak diketahui';
      
      // Remove any existing 'meter' unit and extra spaces
      const cleanedHeight = height.toString()
        .replace(/\s*meter\s*/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
        
      // Check if the value already ends with a number
      if (/^\d+$/.test(cleanedHeight)) {
        return `${cleanedHeight} meter`;
      }
      return cleanedHeight;
    },
    fetchCandis() {
      const endpoint = 'http://localhost:3030/TempatBersejarah/query';
      const query = `
        PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT DISTINCT ?candi ?tinggi ?komentar
        WHERE {
          ?candi rdf:type tb:CandiTrimurti .
          OPTIONAL { ?candi tb:memilikiTinggi ?tinggi . }
          OPTIONAL { ?candi rdfs:comment ?komentar . }
        }
      `;

      axios.get(endpoint, {
        params: { query, format: 'json' },
        headers: { Accept: 'application/sparql-results+json' }
      })
      .then((res) => {
        const results = res.data.results.bindings;
        this.candis = results.map(item => {
          const uri = item.candi.value;
          let nama = uri.includes('#') ? uri.split('#')[1] : uri.split('/').pop();

          if (nama.includes('_')) {
            nama = nama.split('_')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
          } else {
            nama = nama.replace(/([a-z])([A-Z])/g, '$1 $2');
          }

          return {
            nama: nama.trim(),
            tinggi: item.tinggi?.value || 'tidak diketahui',
            komentar: item.komentar?.value || ''
          };
        });
      })
      .catch(err => {
        console.error('Gagal mengambil data:', err);
        this.candis = [];
      });
    }
  },
  mounted() {
    this.fetchCandis();
  }
};
</script>

<style scoped>
.wrapper {
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 1.5rem;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 5px;
}

.subtitle {
  text-align: center;
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 30px;
}

.main-image {
  display: block;
  width: 100%;
  max-width: 600px;
  margin: 0 auto 25px;
  border-radius: 4px;
}

.details {
  margin: 30px 0;
}

h2 {
  font-size: 1.5rem;
  color: #2c3e50;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.candi-item {
  margin-bottom: 25px;
}

.candi-name {
  font-size: 1.1rem;
  color: black;
  margin-bottom: 5px;
}

.candi-stats {
  font-size: 1rem;
  color: #34495e;
  margin-bottom: 10px;
}

.candi-desc {
  font-size: 1rem;
  color: #555;
  text-align: justify;
}

.divider {
  border: 0;
  height: 1px;
  background: #eee;
  margin: 25px 0;
}

.button-container {
  margin-top: 40px;
  text-align: center;
}

.back-button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #2980b9;
}

@media (max-width: 600px) {
  .title {
    font-size: 1.7rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}
</style>