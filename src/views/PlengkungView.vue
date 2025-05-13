<template>
    <div class="wrapper">
      <div class="content">
        <!-- Judul -->
        <h2 class="title">Plengkung - Keraton Yogyakarta</h2>
  
        <!-- Gambar utama -->
        <img src="@/assets/Plengkung.jpg" alt="Plengkung" class="main-image" />
  
        <!-- Deskripsi -->
        <section class="details">
          <h3>Deskripsi Singkat:</h3>
          <p class="justify-text spaced-text">{{ deskripsi || 'Deskripsi tidak tersedia.' }}</p>
        </section>
  
        <!-- Daftar Plengkung -->
        <section class="details">
          <h3>Berikut beberapa Plengkung yang ada di Keraton Yogyakarta:</h3>
          <ul class="plengkung-list">
            <li v-for="(plengkung, index) in plengkungs" :key="index">
              {{ plengkung }}
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
    name: 'PlengkungKeratonView',
    data() {
      return {
        deskripsi: '',
        plengkungs: []
      };
    },
    mounted() {
      this.fetchDeskripsi();
      this.fetchPlengkungs();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      // Mengambil deskripsi singkat mengenai Plengkung menggunakan rdfs:comment
      fetchDeskripsi() {
        const endpoint = 'http://localhost:3030/TempatBersejarah/query';
        const query = `
          PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
          SELECT ?komentar
          WHERE {
            tb:Plengkung rdfs:comment ?komentar .
          }
          LIMIT 1
        `;
  
        axios.get(endpoint, {
          params: { query, format: 'json' },
          headers: { Accept: 'application/sparql-results+json' }
        })
        .then((res) => {
          const results = res.data.results.bindings;
          if (results.length > 0) {
            this.deskripsi = results[0].komentar.value;
          }
        })
        .catch((err) => {
          console.error('Gagal mengambil deskripsi:', err);
          this.deskripsi = 'Deskripsi gagal dimuat.';
        });
      },
      // Mendapatkan daftar plengkung yang ada di Keraton Yogyakarta, yang merupakan tipe dari Plengkung
      fetchPlengkungs() {
        const endpoint = 'http://localhost:3030/TempatBersejarah/query';
        const query = `
          PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  
          SELECT DISTINCT ?plengkung
          WHERE {
            ?plengkung rdf:type tb:Plengkung .
          }
        `;
  
        axios.get(endpoint, {
          params: { query, format: 'json' },
          headers: { Accept: 'application/sparql-results+json' }
        })
        .then((res) => {
          const results = res.data.results.bindings;
  
          const uniqueNames = new Set();
  
          results.forEach(p => {
            const uri = p.plengkung.value;
            let localName = uri.includes('#') ? uri.split('#')[1] : uri.split('/').pop();
  
            // Format nama
            if (localName.includes('_')) {
              localName = localName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            } else {
              localName = localName.replace(/([a-z])([A-Z])/g, '$1 $2');
            }
  
            uniqueNames.add(localName.trim());
          });
  
          this.plengkungs = Array.from(uniqueNames);
        })
        .catch((err) => {
          console.error('Gagal mengambil daftar plengkung:', err);
          this.plengkungs = [];
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
  
  .justify-text {
    text-align: justify;
  }
  
  .spaced-text {
    letter-spacing: 0.5px;
  }
  
  .title {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .plengkung-list {
    margin-top: 10px;
    padding-left: 20px;
  }
  
  .plengkung-list li {
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
  