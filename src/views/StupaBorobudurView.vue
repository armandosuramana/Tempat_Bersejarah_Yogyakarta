<template>
    <div class="wrapper">
      <div class="content">
        <h2 class="title">Stupa - Candi Borobudur</h2>
  
        <img src="@/assets/Stupa.jpg" alt="Stupa" class="main-image" />
  
        <section class="details">
          <h3>Deskripsi Singkat:</h3>
          <p class="justify-text spaced-text">{{ deskripsi || 'Deskripsi tidak tersedia.' }}</p>
        </section>
  
        <section class="details">
          <h3>Berikut beberapa stupa yang ada di Candi Borobudur:</h3>
          <ul class="list">
            <li v-for="(stupa, index) in stupas" :key="index">
              <strong>{{ stupa.nama }}</strong> - Bentuk: {{ stupa.bentuk || 'Tidak diketahui' }}
            </li>
          </ul>
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
    name: 'StupaBorobudurView',
    data() {
      return {
        deskripsi: '',
        stupas: []
      };
    },
    mounted() {
      this.fetchDeskripsi();
      this.fetchStupas();
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
  
          SELECT ?komentar WHERE {
            tb:Stupa rdfs:comment ?komentar .
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
      fetchStupas() {
        const endpoint = 'http://localhost:3030/TempatBersejarah/query';
        const query = `
          PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  
          SELECT DISTINCT ?stupa ?bentuk WHERE {
            ?stupa rdf:type tb:Stupa .
            OPTIONAL { ?stupa tb:memilikiBentuk ?bentuk . }
          }
        `;
  
        axios.get(endpoint, {
          params: { query, format: 'json' },
          headers: { Accept: 'application/sparql-results+json' }
        })
        .then(res => {
          const results = res.data.results.bindings;
          const data = results.map(item => {
            const uri = item.stupa.value;
            let localName = uri.includes('#') ? uri.split('#')[1] : uri.split('/').pop();
  
            // Format nama agar lebih rapi
            if (localName.includes('_')) {
              localName = localName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            }
  
            return {
              nama: localName,
              bentuk: item.bentuk ? item.bentuk.value : ''
            };
          });
  
          this.stupas = data;
        })
        .catch(err => {
          console.error('Gagal mengambil daftar stupa:', err);
          this.stupas = [];
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
  
  .list {
    margin-top: 10px;
    padding-left: 20px;
  }
  
  .list li {
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
  