<template>
    <div class="wrapper">
      <div class="content">
        <!-- Judul -->
        <h2 class="title">Arca & Relief – Candi Prambanan</h2>
  
        <!-- Gambar Arca -->
        <img src="@/assets/Arca Candi Prambanan.jpg" alt="Arca Candi Prambanan" class="main-image" />
  
        <!-- Daftar Arca -->
        <section class="details" v-if="arcas.length">
          <p class="intro"><strong>Berikut beberapa Arca yang terdapat pada Candi Prambanan:</strong></p>
          <ul class="list">
            <li v-for="(arca, index) in arcas" :key="'arca-' + index">
              {{ arca }}
            </li>
          </ul>
        </section>
  
        <!-- Gambar Relief -->
        <img v-if="reliefs.length" src="@/assets/Relief Candi Prambanan.jpg" alt="Relief Candi Prambanan" class="main-image" />
  
        <!-- Daftar Relief -->
        <section class="details" v-if="reliefs.length">
          <p class="intro"><strong>Berikut beberapa Relief yang terdapat pada Candi Prambanan:</strong></p>
          <ul class="list">
            <li v-for="(relief, index) in reliefs" :key="'relief-' + index">
              {{ relief }}
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
    name: 'AraReliefPrambanan',
    data() {
      return {
        arcas: [],
        reliefs: []
      };
    },
    mounted() {
      this.fetchItems();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      fetchItems() {
        const endpoint = 'http://localhost:3030/TempatBersejarah/query';
        const query = `
          PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
          SELECT DISTINCT ?objek ?label
          WHERE {
            tb:candi_prambanan tb:memilikiHiasanCandi ?objek .
            OPTIONAL { ?objek rdfs:label ?label }
          }
        `;
  
        axios.get(endpoint, {
          params: { query, format: 'json' },
          headers: { Accept: 'application/sparql-results+json' }
        })
        .then((res) => {
          const results = res.data.results.bindings;
          const arcaSet = new Set();
          const reliefSet = new Set();
  
          results.forEach(item => {
            let label = item.label?.value;
            if (!label) {
              const uri = item.objek.value;
              label = uri.includes('#') ? uri.split('#')[1] : uri.split('/').pop();
              label = label.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
            }
  
            label = label.trim();
            if (label.toLowerCase().startsWith('arca')) {
              arcaSet.add(label);
            } else if (label.toLowerCase().startsWith('relief')) {
              reliefSet.add(label);
            }
          });
  
          this.arcas = Array.from(arcaSet);
          this.reliefs = Array.from(reliefSet);
        })
        .catch((err) => {
          console.error('Gagal mengambil data hiasan candi:', err);
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
    width: 50%;
    height: auto;
    margin: 20px auto;
  }
  
  .title {
    font-size: 1.8rem;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .details {
    margin-top: 30px;
  }
  
  .intro {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 10px;
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
  