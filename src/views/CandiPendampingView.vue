<template>
    <div class="wrapper">
      <div class="content">
        <!-- Judul -->
        <h2 class="title">Candi Pendamping - Candi Prambanan</h2>
  
        <!-- Gambar utama -->
        <img src="@/assets/Candi Pendamping.jpg" alt="Candi Pendamping" class="main-image" />
  
        <!-- Deskripsi -->
        <section class="details">
          <h3>Deskripsi Singkat:</h3>
          <p class="justify-text spaced-text">{{ deskripsi || 'Deskripsi tidak tersedia.' }}</p>
        </section>
  
        <!-- Daftar Candi Pendamping -->
        <section class="details">
          <h3>Berikut beberapa Candi Pendamping di Candi Prambanan:</h3>
          <ul class="list">
            <li v-for="(candi, index) in candis" :key="index">
              {{ candi }}
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
    name: 'CandiPendampingPrambanan',
    data() {
      return {
        deskripsi: '',
        candis: []
      };
    },
    mounted() {
      this.fetchDeskripsi();
      this.fetchCandis();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      fetchDeskripsi() {
        const endpoint = 'http://localhost:3030/TempatBersejarah/query';
        const query = `
          PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
          SELECT ?komentar
          WHERE {
            tb:CandiPendamping rdfs:comment ?komentar .
          }
          LIMIT 1
        `;
  
        axios.get(endpoint, {
          params: { query, format: 'json' },
          headers: { Accept: 'application/sparql-results+json' }
        })
        .then(res => {
          const results = res.data.results.bindings;
          if (results.length > 0) {
            this.deskripsi = results[0].komentar.value;
          }
        })
        .catch(err => {
          console.error('Gagal mengambil deskripsi:', err);
          this.deskripsi = 'Deskripsi gagal dimuat.';
        });
      },
      fetchCandis() {
        const endpoint = 'http://localhost:3030/TempatBersejarah/query';
        const query = `
          PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  
          SELECT DISTINCT ?candi
          WHERE {
            ?candi rdf:type tb:CandiPendamping .
          }
        `;
  
        axios.get(endpoint, {
          params: { query, format: 'json' },
          headers: { Accept: 'application/sparql-results+json' }
        })
        .then(res => {
          const results = res.data.results.bindings;
  
          const names = results.map(c => {
            let uri = c.candi.value;
            let localName = uri.includes('#') ? uri.split('#')[1] : uri.split('/').pop();
  
            if (localName.includes('_')) {
              return localName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            }
            return localName.replace(/([a-z])([A-Z])/g, '$1 $2');
          });
  
          this.candis = Array.from(new Set(names));
        })
        .catch(err => {
          console.error('Gagal mengambil candi pendamping:', err);
          this.candis = [];
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
    width: 55%;
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
  
  .list {
    margin-top: 10px;
    padding-left: 20px;
  }
  
  .list li {
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
  