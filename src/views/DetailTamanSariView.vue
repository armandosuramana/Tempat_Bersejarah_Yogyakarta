<template>
  <div class="wrapper">
    <div class="content">
      <h2 class="title">Taman Sari</h2>
      <img src="@/assets/Taman Sari.jpg" alt="Taman Sari" class="main-image" />

      <section class="details">
        <h3>Deskripsi Singkat:</h3>
        <p v-if="deskripsiDbpedia" class="justify-text spaced-text"><em>{{ deskripsiDbpedia }}</em></p> <!-- DBpedia description goes first -->
        <p class="justify-text spaced-text">{{ deskripsi || 'Deskripsi tidak tersedia.' }}</p> <!-- Fuseki description goes second -->

        <p><strong>Dibangun Oleh:</strong> {{ dibangunOleh || 'Data tidak tersedia' }}</p>
        <p><strong>Dikelola Oleh:</strong> {{ dikelolaOleh || 'Data tidak tersedia' }}</p>
        <p><strong>Lokasi:</strong> {{ lokasi || 'Data tidak tersedia' }}</p>
        <p><strong>Koordinat:</strong> {{ koordinat || 'Data tidak tersedia' }}</p>
        <p><strong>Luas:</strong> {{ luas || 'Data tidak tersedia' }}</p>

        <div v-if="groupedData['Nilai Sejarah']" class="info-section">
          <h3>Nilai Sejarah</h3>
          <ul>
            <li v-for="(item, idx) in groupedData['Nilai Sejarah']" :key="'nilai-' + idx">
              <strong>{{ item.nama }}</strong><br />
              <span v-if="item.komentar">{{ item.komentar }}</span>
            </li>
          </ul>
        </div>

        <div v-if="groupedData['Peristiwa Sejarah']" class="info-section">
          <h3>Peristiwa Sejarah</h3>
          <ul>
            <li v-for="(item, idx) in groupedData['Peristiwa Sejarah']" :key="'peristiwa-' + idx">
              <strong>{{ item.nama }}</strong><br />
              <span v-if="item.komentar">{{ item.komentar }}</span>
            </li>
          </ul>
        </div>
      </section>

      <section v-if="groupedData['Gaya Arsitektur']" class="info-section">
        <h3>Gaya Arsitektur</h3>
        <ul>
          <li v-for="(item, idx) in groupedData['Gaya Arsitektur']" :key="idx">
            {{ item.nama }}<br />
            <span v-if="item.komentar">{{ item.komentar }}</span>
          </li>
        </ul>
      </section>

      <section v-if="groupedData['Fungsi Asli']" class="info-section">
        <h3>Fungsi Asli</h3>
        <ul>
          <li v-for="(item, idx) in groupedData['Fungsi Asli']" :key="idx">
            {{ item.nama }}<br />
            <span v-if="item.komentar">{{ item.komentar }}</span>
          </li>
        </ul>
      </section>

      <section v-if="groupedData['Fungsi Sekarang']" class="info-section">
        <h3>Fungsi Sekarang</h3>
        <ul>
          <li v-for="(item, idx) in groupedData['Fungsi Sekarang']" :key="idx">
            {{ item.nama }}<br />
            <span v-if="item.komentar">{{ item.komentar }}</span>
          </li>
        </ul>
      </section>

      <section class="info-section">
        <h2>Struktur bangunan dan area penting di Taman Sari</h2>
        <ul>
          <li><router-link to="/gapura-taman-sari">Gapura</router-link></li>
          <li><router-link to="/pemandian-taman-sari">Kolam Pemandian</router-link></li>
          <li><router-link to="/sumur-taman-sari">Sumur</router-link></li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DetailTamanSari',
  data() {
    return {
      deskripsi: '',
      deskripsiDbpedia: '',
      lokasi: '',
      koordinat: '',
      dikelolaOleh: '',
      dibangunOleh: '',
      luas: '',
      groupedData: {}
    };
  },
  methods: {
    formatNama(uri) {
      const raw = uri.split('#').pop();
      const formatted = raw
        .split('_')
        .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
        .join(' ');
      return formatted;
    },
    fetchDbpediaDescription() {
      const dbpediaEndpoint = 'https://dbpedia.org/sparql';
      const query = `
        SELECT ?abstract WHERE {
          <http://dbpedia.org/resource/Taman_Sari_(Yogyakarta)> <http://dbpedia.org/ontology/abstract> ?abstract .
          FILTER(LANG(?abstract) = "en")
        }
      `;

      axios.get(dbpediaEndpoint, {
        params: {
          query: query,
          format: 'json'
        },
        headers: {
          'Accept': 'application/sparql-results+json'
        }
      })
      .then(res => {
        const bindings = res.data.results.bindings;
        if (bindings && bindings.length > 0) {
          this.deskripsiDbpedia = bindings[0].abstract.value;
        } else {
          console.error('Tidak ada hasil dari DBpedia');
          this.fetchDbpediaDescriptionAlternative();
        }
      })
      .catch(err => {
        console.error('Gagal mengambil data dari DBpedia SPARQL endpoint:', err);
        this.fetchDbpediaDescriptionAlternative();
      });
    },
    
    fetchDbpediaDescriptionAlternative() {
      // Metode alternatif jika SPARQL endpoint tidak berfungsi
      const dbpediaUrl = 'https://dbpedia.org/data/Taman_Sari_(Yogyakarta).json';
      
      axios.get(dbpediaUrl, {
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(res => {
        const data = res.data;
        const subjectUri = 'http://dbpedia.org/resource/Taman_Sari_(Yogyakarta)';
        const description = 
          data[subjectUri]?.['http://dbpedia.org/ontology/abstract']?.find(
            entry => entry['lang'] === 'en'
          )?.value || '';
        
        this.deskripsiDbpedia = description;
      })
      .catch(err => {
        console.error('Gagal mengambil data dari DBpedia JSON API:', err);
      });
    }
  },
  mounted() {
    this.fetchDbpediaDescription(); // Mengambil data dari DBpedia menggunakan SPARQL endpoint

    //Pengambilan data dari fuseki
    const endpoint = 'http://localhost:3030/TempatBersejarah/query';
    const query = `
      PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?tipe ?x ?label ?komentar ?alamat ?dikelola ?koordinat ?luas ?pendiri
      WHERE {
        OPTIONAL {
          tb:taman_sari rdfs:comment ?komentar ;
                       tb:berlokasiDi ?lokasi ;
                       tb:dikelolaOleh ?dikelola ;
                       tb:koordinatGeografis ?koordinat ;
                       tb:memilikiLuas ?luas ;
                       tb:memilikiPendiri ?pendiri .
          ?lokasi tb:memilikiAlamat ?alamat .
        }

        {
          tb:taman_sari tb:memilikiNilaiSejarah ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Nilai Sejarah" AS ?tipe)
        }
        UNION {
          tb:taman_sari tb:memilikiPeristiwaSejarah ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Peristiwa Sejarah" AS ?tipe)
        }
        UNION {
          tb:taman_sari tb:memilikiStrukturArsitektural ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Struktur Arsitektural" AS ?tipe)
        }
        UNION {
          tb:taman_sari tb:memilikiKomponenBangunan ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Komponen Bangunan" AS ?tipe)
        }
        UNION {
          tb:taman_sari tb:memilikiKomponenLuarBangunan ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Komponen Luar Bangunan" AS ?tipe)
        }
        UNION {
          tb:taman_sari tb:memilikiGayaArsitektur ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Gaya Arsitektur" AS ?tipe)
        }
        UNION {
          tb:taman_sari tb:memilikiFungsiAsli ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Fungsi Asli" AS ?tipe)
        }
        UNION {
          tb:taman_sari tb:memilikiFungsiSekarang ?x .
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

      results.forEach((item) => {
        if (item.komentar && !this.deskripsi) this.deskripsi = item.komentar.value;
        if (item.alamat) this.lokasi = item.alamat.value;
        if (item.koordinat) this.koordinat = item.koordinat.value;
        if (item.dikelola) this.dikelolaOleh = item.dikelola.value;
        if (item.luas) this.luas = item.luas.value;
        if (item.pendiri)
          this.dibangunOleh = this.formatNama(item.pendiri.value);

        const tipe = item.tipe?.value;
        const uri = item.x?.value;
        const nama = uri ? this.formatNama(uri) : '(Tanpa nama)';
        const komentar = item.label?.value;

        if (tipe) {
          if (!grouped[tipe]) grouped[tipe] = [];
          const entry = { nama, komentar: komentar || null };
          if (!grouped[tipe].some(e => e.nama === entry.nama)) {
            grouped[tipe].push(entry);
          }
        }
      });

      this.groupedData = grouped;
    })
    .catch((err) => {
      console.error('Gagal ambil data:', err);
    });
  }
};
</script>
<style scoped>
/* Wrapper utama */
.wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #f9fafb;
  min-height: 100vh;
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

/* Konten tengah */
.content {
  max-width: 920px;
  width: 100%;
  background: #fff;
  padding: 35px 45px;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.3s ease;
}

/* Judul Halaman */
.title {
  font-size: 34px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
  color: #1e2d7d;
  letter-spacing: 0.03em;
}

/* Gambar Utama */
.main-image {
  width: 100%;
  max-height: 440px;
  object-fit: cover;
  border-radius: 14px;
  margin-bottom: 30px;
}

/* Deskripsi umum */
.details {
  font-size: 17px;
  line-height: 1.7;
  color: #4b5563;
  margin-bottom: 40px;
}

.justify-text {
  text-align: justify;
}

.spaced-text {
  margin-bottom: 20px;
  color: #5c6678;
}

/* Penekanan strong pada paragraf detail */
.details p strong {
  color: #1e2d7d;
}

/* Info-section: Bagian seperti fungsi, gaya arsitektur, sejarah, dll */
.info-section {
  margin-top: 30px;
}

.info-section h2,
.info-section h3 {
  font-weight: 600;
  font-size: 22px;
  margin-bottom: 18px;
  color: #1f2937;
  border-bottom: 2px solid #1e2d7d;
  padding-bottom: 6px;
}

.info-section ul {
  padding-left: 20px;
  list-style-type: disc;
  color: #374151;
}

.info-section ul li {
  margin-bottom: 12px;
}
</style>
