<template>
  <div class="wrapper">
    <div class="content">
      <h2 class="title">Keraton Yogyakarta</h2>
      <img src="@/assets/Keraton Yogyakarta1.jpg" alt="Keraton Yogyakarta" class="main-image" />

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
        <h2>Struktur bangunan dan area penting di Keraton Yogyakarta</h2>
        <ul>
          <li><router-link to="/bale">Bale</router-link></li>
          <li><router-link to="/bangsal">Bangsal</router-link></li>
          <li><router-link to="/plengkung">Plengkung</router-link></li>
          <li><router-link to="/gapura-keraton">Gapura</router-link></li>
          <li><router-link to="/alun-alun-keraton">Alun-alun</router-link></li>
          <li><router-link to="/gedung-keraton">Gedung</router-link></li>
          <li><router-link to="/masjid-keraton">Masjid</router-link></li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DetailKeraton',
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
      const proxyUrl = 'http://localhost:8080/';
      const dbpediaUrl = 'https://dbpedia.org/data/Kraton_Ngayogyakarta_Hadiningrat.json';

      axios
        .get(proxyUrl + dbpediaUrl)
        .then((res) => {
          const data = res.data;
          const subjectUri = 'http://dbpedia.org/resource/Kraton_Ngayogyakarta_Hadiningrat';
          const description =
            data[subjectUri]?.['http://dbpedia.org/ontology/abstract']?.find(
              (entry) => entry['lang'] === 'en'
            )?.value || '';
          this.deskripsiDbpedia = description;
        })
        .catch((err) => {
          console.error('Gagal mengambil deskripsi dari DBpedia:', err);
        });
    }
  },
  //Pengambilan data dari Fuseki
  mounted() {
    this.fetchDbpediaDescription();

    const endpoint = 'http://localhost:3030/TempatBersejarah/query';
    const query = `
      PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?tipe ?x ?label ?komentar ?alamat ?dikelola ?koordinat ?luas ?pendiri
      WHERE {
        OPTIONAL {
          tb:keraton_yogyakarta rdfs:comment ?komentar ;
                               tb:berlokasiDi ?lokasi ;
                               tb:dikelolaOleh ?dikelola ;
                               tb:koordinatGeografis ?koordinat ;
                               tb:memilikiLuas ?luas ;
                               tb:memilikiPendiri ?pendiri .
          ?lokasi tb:memilikiAlamat ?alamat .
        }

        {
          tb:keraton_yogyakarta tb:memilikiNilaiSejarah ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Nilai Sejarah" AS ?tipe)
        }
        UNION {
          tb:keraton_yogyakarta tb:memilikiPeristiwaSejarah ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Peristiwa Sejarah" AS ?tipe)
        }
        UNION {
          tb:keraton_yogyakarta tb:memilikiStrukturArsitektural ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Struktur Arsitektural" AS ?tipe)
        }
        UNION {
          tb:keraton_yogyakarta tb:memilikiKomponenBangunan ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Komponen Bangunan" AS ?tipe)
        }
        UNION {
          tb:keraton_yogyakarta tb:memilikiKomponenLuarBangunan ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Komponen Luar Bangunan" AS ?tipe)
        }
        UNION {
          tb:keraton_yogyakarta tb:memilikiGayaArsitektur ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Gaya Arsitektur" AS ?tipe)
        }
        UNION {
          tb:keraton_yogyakarta tb:memilikiFungsiAsli ?x .
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Fungsi Asli" AS ?tipe)
        }
        UNION {
          tb:keraton_yogyakarta tb:memilikiFungsiSekarang ?x .
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
/* Styling untuk wrapper halaman */
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
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.title {
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}

.main-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 25px;
}

.details {
  margin-bottom: 30px;
  font-size: 16px;
}

.justify-text {
  text-align: justify;
}

.spaced-text {
  margin-bottom: 15px;
}

.info-section {
  margin-top: 25px;
}

.info-section h3,
.info-section h2 {
  font-size: 19px;
  margin-bottom: 10px;
  color: #2c3e50;
}

.info-section ul {
  padding-left: 20px;
  list-style-type: disc;
}
</style>