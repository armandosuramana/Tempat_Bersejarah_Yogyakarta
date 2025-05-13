<template> 
    <div class="wrapper">
      <div class="content">
        <!-- Judul -->
        <h2 class="title">Benteng Keliling - Benteng Vredeburg</h2>
  
        <!-- Gambar utama -->
        <img src="@/assets/Benteng Keliling.jpg" alt="Benteng Keliling" class="main-image" />
  
        <!-- Deskripsi -->
        <section class="details">
          <h3>Deskripsi Singkat:</h3>
          <p class="justify-text spaced-text">{{ deskripsi || 'Deskripsi tidak tersedia.' }}</p>
        </section>
  
        <!-- Tombol Kembali (DI BAWAH) -->
        <div class="button-container">
          <button class="back-button" @click="goBack">Kembali</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'BentengKelilingVredeburgView',
    data() {
      return {
        deskripsi: ''
      };
    },
    mounted() {
      const endpoint = 'http://localhost:3030/TempatBersejarah/query';
      const query = `
        PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  
        SELECT ?komentar
        WHERE {
          tb:benteng_keliling rdfs:comment ?komentar .
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
        console.error('Gagal mengambil data:', err);
        this.deskripsi = 'Deskripsi gagal dimuat.';
      });
    },
    methods: {
      goBack() {
        this.$router.go(-1);
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
  
  /* Container untuk tombol biar di tengah */
  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
  
  /* Styling tombol */
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
  