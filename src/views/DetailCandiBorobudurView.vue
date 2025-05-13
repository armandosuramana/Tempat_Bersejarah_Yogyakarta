<template>
  <div class="wrapper">
    <div class="content">
      <h2 class="title">Candi Borobudur</h2>
      <img src="@/assets/Candi Borobudur.jpg" alt="Candi Borobudur" class="main-image" />

      <section class="details">
        <h3>Deskripsi Singkat:</h3>
        <p v-if="deskripsiDbpedia" class="justify-text spaced-text"><em>{{ deskripsiDbpedia }}</em></p> <!-- DBpedia description goes first -->
        <p class="justify-text spaced-text">{{ deskripsi || 'Deskripsi tidak tersedia.' }}</p> <!-- Fuseki description goes second -->
        <p><strong>Dibangun Oleh:</strong> {{ dibangunOleh || 'Data tidak tersedia' }}</p>
        <p><strong>Dikelola Oleh:</strong> {{ dikelolaOleh || 'Data tidak tersedia' }}</p>
        <p><strong>Lokasi:</strong> {{ lokasi || 'Data tidak tersedia' }}</p>
        <p><strong>Koordinat:</strong> {{ koordinat || 'Data tidak tersedia' }}</p>
        <p><strong>Luas:</strong> {{ luas || 'Data tidak tersedia' }}</p>
      </section>

      <section v-if="groupedData['Nilai Sejarah']" class="info-section">
        <h3>Nilai Sejarah</h3>
        <ul>
          <li v-for="(item, idx) in groupedData['Nilai Sejarah']" :key="'nilai-' + idx">
            <strong>{{ item.nama }}</strong><br />
            <span v-if="item.komentar">{{ item.komentar }}</span>
          </li>
        </ul>
      </section>

      <section v-if="groupedData['Peristiwa Sejarah']" class="info-section">
        <h3>Peristiwa Sejarah</h3>
        <ul>
          <li v-for="(item, idx) in groupedData['Peristiwa Sejarah']" :key="'peristiwa-' + idx">
            <strong>{{ item.nama }}</strong><br />
            <span v-if="item.komentar">{{ item.komentar }}</span>
          </li>
        </ul>
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

      <section v-if="groupedData['Struktur Arsitektural']" class="info-section">
        <h3>Struktur Arsitektural</h3>
        <ul>
          <li v-for="(item, idx) in groupedData['Struktur Arsitektural']" :key="idx">
            {{ item.nama }}<br />
            <span v-if="item.komentar">{{ item.komentar }}</span>
          </li>
        </ul>
      </section>

      <section v-if="groupedData['Komponen Bangunan']" class="info-section">
        <h3>Komponen Bangunan</h3>
        <ul>
          <li v-for="(item, idx) in groupedData['Komponen Bangunan']" :key="idx">
            {{ item.nama }}<br />
            <span v-if="item.komentar">{{ item.komentar }}</span>
          </li>
        </ul>
      </section>

      <section v-if="groupedData['Komponen Luar Bangunan']" class="info-section">
        <h3>Komponen Luar Bangunan</h3>
        <ul>
          <li v-for="(item, idx) in groupedData['Komponen Luar Bangunan']" :key="idx">
            {{ item.nama }}<br />
            <span v-if="item.komentar">{{ item.komentar }}</span>
          </li>
        </ul>
      </section>

      <section class="info-section">
  <h3>Terdapat Arca dan Relief pada Candi Borobudur:</h3>
  <ul>
    <li><router-link to="/arca-relief-borobudur" class="custom-link">Arca & Relief</router-link></li>
  </ul>
</section>

<section class="info-section">
  <h3>Berikut Stupa yang terdapat di Candi Borobudur:</h3>
  <ul>
    <li><router-link to="/stupa-borobudur" class="custom-link">Stupa Candi Borobudur</router-link></li>
  </ul> 
</section>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'DetailCandiBorobudur',
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
      return raw
        .split('_')
        .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
        .join(' ');
    },
    fetchDbpediaDescription() {
      const dbpediaEndpoint = 'https://dbpedia.org/sparql';
      const query = `
        SELECT ?abstract WHERE {
          <http://dbpedia.org/resource/Borobudur> <http://dbpedia.org/ontology/abstract> ?abstract .
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
        }
      })
      .catch(err => {
        console.error('Gagal mengambil data dari DBpedia SPARQL endpoint:', err);
      });
    }
  },
  mounted() {
    this.fetchDbpediaDescription(); // Mengambil data dari DBpedia menggunakan SPARQL endpoint

    const endpoint = 'http://localhost:3030/TempatBersejarah/query';
    const query = `
      PREFIX tb: <http://ukdw.ac.id/ontologi/tempatbersejarah#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?tipe ?x ?label ?komentar ?alamat ?dikelola ?koordinat ?luas ?pendiri
      WHERE {
        OPTIONAL {
          tb:candi_borobudur rdfs:comment ?komentar ;
                            tb:berlokasiDi ?lokasi ;
                            tb:dikelolaOleh ?dikelola ;
                            tb:koordinatGeografis ?koordinat ;
                            tb:memilikiLuas ?luas ;
                            tb:memilikiPendiri ?pendiri . 
          ?lokasi tb:memilikiAlamat ?alamat .
        }

        {
          tb:candi_borobudur tb:memilikiNilaiSejarah ?x . 
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Nilai Sejarah" AS ?tipe)
        }
        UNION {
          tb:candi_borobudur tb:memilikiPeristiwaSejarah ?x . 
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Peristiwa Sejarah" AS ?tipe)
        }
        UNION {
          tb:candi_borobudur tb:memilikiStrukturArsitektural ?x . 
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Struktur Arsitektural" AS ?tipe)
        }
        UNION {
          tb:candi_borobudur tb:memilikiKomponenBangunan ?x . 
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Komponen Bangunan" AS ?tipe)
        }
        UNION {
          tb:candi_borobudur tb:memilikiKomponenLuarBangunan ?x . 
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Komponen Luar Bangunan" AS ?tipe)
        }
        UNION {
          tb:candi_borobudur tb:memilikiGayaArsitektur ?x . 
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Gaya Arsitektur" AS ?tipe)
        }
        UNION {
          tb:candi_borobudur tb:memilikiFungsiAsli ?x . 
          OPTIONAL { ?x rdfs:comment ?label }
          BIND("Fungsi Asli" AS ?tipe)
        }
        UNION {
          tb:candi_borobudur tb:memilikiFungsiSekarang ?x . 
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
        if (item.pendiri) this.dibangunOleh = this.formatNama(item.pendiri.value);

        const tipe = item.tipe?.value;
        const uri = item.x?.value;
        const nama = uri ? this.formatNama(uri) : '(Tanpa nama)';
        const komentar = item.label?.value;

        if (tipe) {
          if (!grouped[tipe]) grouped[tipe] = [];
          grouped[tipe].push({ nama, komentar: komentar || null });
        }
      });

      this.groupedData = grouped;
    })
    .catch((err) => {
      console.error('Gagal mengambil data dari Fuseki:', err);
    });
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

.custom-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: bold;
}

.custom-link:hover {
  text-decoration: underline;
  color: #1a5276;
}
</style>