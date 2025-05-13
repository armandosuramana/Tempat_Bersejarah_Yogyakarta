<template>
  <div class="wrapper">
    <div class="content">
      <!-- Judul -->
      <h2 class="title">Sumur - Taman Sari</h2>

      <!-- Gambar utama -->
      <img src="@/assets/Sumur Taman Sari.jpg" alt="Sumur Taman Sari" class="main-image" />

      <!-- Daftar Sumur -->
      <section class="details">
        <h3>Berikut Sumur yang ada di Taman Sari:</h3>
        <ul class="sumur-list">
          <li v-for="(sumur, index) in sumurs" :key="index">
            <strong>{{ sumur.name }}</strong> - {{ sumur.comment || 'Komentar tidak tersedia' }}
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
  name: 'SumurTamanSariView',
  data() {
    return {
      sumurs: []
    };
  },
  mounted() {
    this.fetchSumurs();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    fetchSumurs() {
      const endpoint = 'http://localhost:3030/TempatBersejarah/query';
      const query = `
        PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT DISTINCT ?sumur ?komentar
        WHERE {
          ?sumur rdf:type tb:Sumur .
          OPTIONAL { ?sumur rdfs:comment ?komentar . }
        }
      `;

      axios.get(endpoint, {
        params: { query, format: 'json' },
        headers: { Accept: 'application/sparql-results+json' }
      })
      .then((res) => {
        const results = res.data.results.bindings;

        const commentSet = new Set();
        const uniqueSumurs = [];

        results.forEach((result) => {
          const localName = result.sumur.value.split('#').pop();
          let rawName = localName.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

          // Pisahkan huruf kecil-kapital jika perlu, lalu kapitalisasi
          const splitName = rawName.replace(/([a-z])([A-Z])/g, '$1 $2');
          const words = splitName
            .split(' ')
            .filter(word => word)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
          const finalName = words.join(' ');

          const comment = result.komentar ? result.komentar.value.trim() : '';

          if (!commentSet.has(comment)) {
            commentSet.add(comment);
            uniqueSumurs.push({
              name: finalName,
              comment: comment || 'Komentar tidak tersedia'
            });
          }
        });

        this.sumurs = uniqueSumurs;
      })
      .catch((err) => {
        console.error('Gagal mengambil daftar sumur:', err);
        this.sumurs = [];
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

.main-image {
  display: block;
  width: 60%;
  height: auto;
  margin: 20px auto;
}

.details {
  margin-top: 30px;
}

.title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
}

.sumur-list {
  margin-top: 10px;
  padding-left: 20px;
}

.sumur-list li {
  margin-bottom: 8px;
  font-size: 1.1rem;
}

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
