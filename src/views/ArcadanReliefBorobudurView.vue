<template>
    <div class="wrapper">
      <div class="content">
        <!-- Judul -->
        <h2 class="title">Arca & Relief – Candi Borobudur</h2>
  
        <!-- Gambar Arca -->
        <img src="@/assets/Arca Candi Borobudur.jpg" alt="Arca Candi Borobudur" class="main-image" />
  
        <!-- Daftar Arca -->
        <section class="details" v-if="arcas.length">
          <p class="intro"><strong>Arca yang terdapat pada Candi Borobudur:</strong></p>
          <div v-for="(list, className) in arcasByClass" :key="className">
            <h3>{{ className }}</h3>
            <ul class="list">
              <li v-for="(item, idx) in list" :key="idx">
                <strong>{{ item.label }}</strong><br />
                <span v-if="item.comment" class="comment">{{ item.comment }}</span>
              </li>
            </ul>
          </div>
        </section>
        <br>
        <!-- Gambar Relief -->
        <img v-if="reliefs.length" src="@/assets/Relief Candi Borobudur.jpg" alt="Relief Candi Borobudur" class="main-image" />
  
        <!-- Daftar Relief -->
        <section class="details" v-if="reliefs.length">
          <p class="intro"><strong>Relief yang terdapat pada Candi Borobudur:</strong></p>
          <div v-for="(list, className) in reliefsByClass" :key="className">
            <h3>{{ className }}</h3>
            <ul class="list">
              <li v-for="(item, idx) in list" :key="idx">
                <strong>{{ item.label }}</strong><br />
                <span v-if="item.comment" class="comment">{{ item.comment }}</span>
              </li>
            </ul>
          </div>
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
    name: 'ArcaReliefBorobudur',
    data() {
      return {
        arcas: [],
        reliefs: [],
        arcasByClass: {},
        reliefsByClass: {}
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
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  
          SELECT DISTINCT ?objek ?label ?tipe ?comment
          WHERE {
            tb:candi_borobudur tb:memilikiHiasanCandi ?objek .
            ?objek rdf:type ?tipe .
            OPTIONAL { ?objek rdfs:label ?label . }
            OPTIONAL { ?objek rdfs:comment ?comment . }
          }
        `;
  
        axios.get(endpoint, {
          params: { query, format: 'json' },
          headers: { Accept: 'application/sparql-results+json' }
        })
        .then((res) => {
          const results = res.data.results.bindings;
          const arcaClasses = {
            'http://ukdw.ac.id/ontologi/tempatbersejarah#ArcaHindu': 'Arca Hindu',
            'http://ukdw.ac.id/ontologi/tempatbersejarah#ArcaPelindung': 'Arca Pelindung'
          };
          const reliefClasses = {
            'http://ukdw.ac.id/ontologi/tempatbersejarah#ReliefDekoratif': 'Relief Dekoratif',
            'http://ukdw.ac.id/ontologi/tempatbersejarah#ReliefNaratif': 'Relief Naratif'
          };
  
          const arcaMap = {};
          const reliefMap = {};
  
          results.forEach(item => {
            const label = item.label?.value || item.objek.value.split('#').pop().replace(/_/g, ' ');
            const comment = item.comment?.value || '';
            const tipe = item.tipe?.value;
  
            const entry = { label, comment };
  
            if (arcaClasses[tipe]) {
              if (!arcaMap[arcaClasses[tipe]]) arcaMap[arcaClasses[tipe]] = [];
              arcaMap[arcaClasses[tipe]].push(entry);
            } else if (reliefClasses[tipe]) {
              if (!reliefMap[reliefClasses[tipe]]) reliefMap[reliefClasses[tipe]] = [];
              reliefMap[reliefClasses[tipe]].push(entry);
            }
          });
  
          this.arcasByClass = arcaMap;
          this.reliefsByClass = reliefMap;
  
          this.arcas = Object.values(arcaMap).flat();
          this.reliefs = Object.values(reliefMap).flat();
        })
        .catch((err) => {
          console.error('Gagal mengambil data:', err);
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
  
  .comment {
    display: block;
    text-align: justify;
    color: #555;
    font-style: normal;
    margin-top: 4px;
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
  