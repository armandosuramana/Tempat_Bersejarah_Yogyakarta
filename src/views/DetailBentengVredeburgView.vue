<template>
  <div class="wrapper">
    <div class="content">
      <h2 class="title">Benteng Vredeburg</h2>
      <img src="@/assets/Benteng Vredeburg.jpg" alt="Benteng Vredeburg" class="main-image" />

      <section class="details">
        <h3>Deskripsi Singkat:</h3>
        <p v-if="deskripsiDbpedia" class="justify-text spaced-text"><em>{{ deskripsiDbpedia }}</em></p>
        <p v-for="(para, idx) in deskripsiList" :key="idx" class="justify-text spaced-text">
          {{ para }}
        </p>

        <p><strong>Dibangun Oleh:</strong> {{ dibangunOleh || 'Data tidak tersedia' }}</p>
        <p><strong>Dikelola Oleh:</strong> {{ dikelolaOleh || 'Data tidak tersedia' }}</p>
        <p><strong>Lokasi:</strong> {{ lokasi || 'Data tidak tersedia' }}</p>
        <p><strong>Koordinat:</strong> {{ koordinat || 'Data tidak tersedia' }}</p>
        <p><strong>Luas:</strong> {{ luas || 'Data tidak tersedia' }}</p>
        <p v-if="koleksi"><strong>Koleksi:</strong> {{ koleksi }}</p>
      </section>

      <section v-for="(items, kategori) in filteredGroupedData" :key="kategori" class="info-section">
        <h3>{{ kategori }}</h3>
        <ul>
          <li v-for="(item, idx) in items" :key="idx" class="info-item">
            <div class="item-nama">{{ formatName(item.nama) }}</div>
            <div v-if="item.komentar" class="item-komentar">{{ item.komentar }}</div>
          </li>
        </ul>
      </section>

      <section class="info-section">
        <h2>Struktur Bangunan pada Benteng Vredeburg:</h2>
        <ul>
          <li><router-link to="/benteng-keliling-vredeburg">Benteng Keliling</router-link></li>
          <li><router-link to="/gerbang-barat">Gerbang Barat</router-link></li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DetailVredeburg',
  data() {
    return {
      deskripsiList: [],
      deskripsiDbpedia: '',
      groupedData: {}
    };
  },
  computed: {
    filteredGroupedData() {
      const data = { ...this.groupedData };
      delete data['Struktur Arsitektural'];
      return data;
    }
  },
  methods: {
    formatName(nama) {
      return nama.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    },
    async fetchDbpediaData() {
      try {
        const sparqlResponse = await this.fetchFromSparql();
        if (sparqlResponse) {
          this.deskripsiDbpedia = sparqlResponse.abstract;
          this.koleksi = sparqlResponse.collection;
          return;
        }

        const jsonResponse = await this.fetchFromJson();
        if (jsonResponse) {
          this.deskripsiDbpedia = jsonResponse.abstract;
          this.koleksi = jsonResponse.collection;
        }
      } catch (error) {console.error('Gagal fetch DBpedia:', error);}
    },
    async fetchFromSparql() {
      try {
        const query = `
          PREFIX dbo: <http://dbpedia.org/ontology/>
          SELECT ?abstract ?collection WHERE {
            <http://dbpedia.org/resource/Fort_Vredeburg_Museum> 
              dbo:abstract ?abstract .
            FILTER(LANG(?abstract) = "en")
          }
        `;
        const response = await axios.get('https://dbpedia.org/sparql', {
          params: { query, format: 'json' },
          headers: { 'Accept': 'application/sparql-results+json' }
        });
        const bindings = response.data.results.bindings;
        if (bindings && bindings.length > 0) {
          return {
            abstract: bindings[0].abstract.value,
            collection: bindings[0].collection?.value || ''
          };
        }
      } catch {
        return null;
      }
      return null;
    },
    async fetchFromJson() {
      try {
        const response = await axios.get('https://dbpedia.org/data/Fort_Vredeburg_Museum.json');
        const data = response.data;
        const subjectUri = 'http://dbpedia.org/resource/Fort_Vredeburg_Museum';
        const abstract = data[subjectUri]?.['http://dbpedia.org/ontology/abstract'];
        return {
          abstract: abstract?.find(entry => entry.lang === 'en')?.value || ''
        };
      } catch {
        return null;
      }
    }
  },
  mounted() {
    this.fetchDbpediaData();

    const endpoint = 'http://localhost:3030/TempatBersejarah/query';
    const query = `
      PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?tipe ?x ?label ?alamat ?dikelola ?koordinat ?luas ?pendiri ?deskripsi
      WHERE {
        OPTIONAL {
          tb:benteng_vredeburg rdfs:comment ?deskripsi ;
                               tb:berlokasiDi ?lokasi ;
                               tb:dikelolaOleh ?dikelola ;
                               tb:koordinatGeografis ?koordinat ;
                               tb:memilikiLuas ?luas ;
                               tb:memilikiPendiri ?pendiri .
          ?lokasi tb:memilikiAlamat ?alamat .
        }

        {
          tb:benteng_vredeburg tb:memilikiNilaiSejarah ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Nilai Sejarah" AS ?tipe)
        }
        UNION {
          tb:benteng_vredeburg tb:memilikiPeristiwaSejarah ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Peristiwa Sejarah" AS ?tipe)
        }
        UNION {
          tb:benteng_vredeburg tb:memilikiStrukturArsitektural ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Struktur Arsitektural" AS ?tipe)
        }
        UNION {
          tb:benteng_vredeburg tb:memilikiKomponenBangunan ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Komponen Bangunan" AS ?tipe)
        }
        UNION {
          tb:benteng_vredeburg tb:memilikiGayaArsitektur ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Gaya Arsitektur" AS ?tipe)
        }
        UNION {
          tb:benteng_vredeburg tb:memilikiFungsiAsli ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Fungsi Asli" AS ?tipe)
        }
        UNION {
          tb:benteng_vredeburg tb:memilikiFungsiSekarang ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Fungsi Sekarang" AS ?tipe)
        }
      }
    `;

    axios.get(endpoint, {
      params: { query, format: 'json' },
      headers: { Accept: 'application/sparql-results+json' }
    })
    .then((res) => {
      const results = res.data.results.bindings;
      const grouped = {};
      const deskripsiList = [];

      for (const item of results) {
        if (item.deskripsi && item.deskripsi.value.length > 200 && !deskripsiList.includes(item.deskripsi.value)) {
          deskripsiList.push(item.deskripsi.value);
        }

        if (item.alamat) this.lokasi = item.alamat.value;
        if (item.koordinat) this.koordinat = item.koordinat.value;
        if (item.dikelola) this.dikelolaOleh = this.formatName(item.dikelola.value.split('#').pop());
        if (item.luas) this.luas = item.luas.value;
        if (item.pendiri) this.dibangunOleh = this.formatName(item.pendiri.value.split('#').pop());

        const tipe = item.tipe?.value;
        const uri = item.x?.value;
        const nama = uri ? uri.split('#').pop().replace(/_/g, ' ') : '(Tanpa nama)';
        const komentar = item.label?.value;

        if (tipe) {
          if (!grouped[tipe]) grouped[tipe] = [];
          const entry = { nama, komentar: komentar || null };
          if (!grouped[tipe].some(e => e.nama === entry.nama)) {
            grouped[tipe].push(entry);
          }
        }
      }

      this.deskripsiList = deskripsiList;
      this.groupedData = grouped;
    })
    .catch((err) => {
      console.error('Gagal ambil data:', err);
    });
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  background: #f0f4f8;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2e3a59;
}

.content {
  max-width: 900px;
  width: 100%;
  background: #ffffff;
  padding: 30px 40px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.3s ease;
}

.title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
  color: #1a2a6c;
  letter-spacing: 0.04em;
}

.main-image {
  width: 100%;
  max-height: 420px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 30px;
}

.details {
  font-size: 17px;
  line-height: 1.6;
  color: #444d6e;
  margin-bottom: 40px;
}

.justify-text {
  text-align: justify;
}

.spaced-text {
  margin-bottom: 20px;
  font-style: normal;
  color: #555a75;
}

.details p strong {
  color: #1a2a6c;
}

.info-section {
  margin-top: 30px;
}

.info-section h3,
.info-section h2 {
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 15px;
  color: #23395d;
  border-bottom: 2px solid #1a2a6c;
  padding-bottom: 6px;
}

.info-section ul {
  padding-left: 20px;
  list-style-type: disc;
}

.info-item {
  margin-bottom: 20px;
  text-align: justify;
  color: #2e3a59;
}

.item-nama {
  font-weight: normal;
  color: #2e3a59;
}

.item-komentar {
  margin-top: 5px;
  font-size: 15.5px;
  color: #444d6e;
  line-height: 1.6;
}
</style>
