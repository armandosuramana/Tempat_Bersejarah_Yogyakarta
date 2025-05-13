<template>
  <div class="wrapper">
    <div class="content">
      <!-- Judul -->
      <h2 class="title">Kolam Pemandian - Taman Sari</h2>

      <!-- Gambar utama -->
      <img src="@/assets/Kolam Pemandian Taman Sari.jpg" alt="Kolam Pemandian Taman Sari" class="main-image" />

      <!-- Daftar Kolam -->
      <section class="details">
        <h3>Berikut beberapa kolam pemandian di Taman Sari:</h3>
        <ul class="kolam-list">
          <li v-for="(kolam, index) in kolams" :key="index">
            {{ kolam }}
          </li>
        </ul>
      </section>

      <!-- Tombol Kembali -->
      <div class="button-container">
        <button class="back-button" @click="goBack">Kembali</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'KolamPemandianView',
  data() {
    return {
      kolams: []
    };
  },
  mounted() {
    this.fetchKolams();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // Mengambil daftar kolam pemandian
    fetchKolams() {
      const endpoint = 'http://localhost:3030/TempatBersejarah/query';
      const query = `
        PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT DISTINCT ?kolam
        WHERE {
          ?kolam rdf:type tb:KolamPemandian .
        }
      `;

      axios.get(endpoint, {
        params: { query, format: 'json' },
        headers: { Accept: 'application/sparql-results+json' }
      })
      .then((res) => {
        const results = res.data.results.bindings;

        const uniqueNames = new Set();

        results.forEach(k => {
          const uri = k.kolam.value;
          let localName = uri.includes('#') ? uri.split('#')[1] : uri.split('/').pop();

          // Format nama
          if (localName.includes('_')) {
            localName = localName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          } else {
            localName = localName.replace(/([a-z])([A-Z])/g, '$1 $2');
          }

          uniqueNames.add(localName.trim());
        });

        this.kolams = Array.from(uniqueNames);
      })
      .catch((err) => {
        console.error('Gagal mengambil daftar kolam:', err);
        this.kolams = [];
      });
    }
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f9f9f9;
  min-height: 100vh;
  padding: 30px 15px;
}

.content {
  width: 100%;
  max-width: 1000px;
}
.title {
  font-size: 2rem;
  text-align: center; 
  margin-bottom: 20px;
}

.main-image {
  display: block;
  width: 60%;
  height: auto;
  margin: 20px auto;
}

.details {
  margin-top: 30px;
}

.kolam-list {
  margin-top: 10px;
  padding-left: 20px;
}

.kolam-list li {
  margin-bottom: 8px;
  font-size: 1.1rem;
}

/* Tombol Kembali */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.back-button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .content {
    padding: 20px;
  }

  .main-image {
    width: 100%;
  }
}
</style>
