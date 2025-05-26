<template>
    <div class="about-container">
      <div class="about-card">
        <h2>Tentang Situs Ini</h2>
        <ul>
          <li>
            Situs ini dibuat untuk menyajikan informasi mengenai tempat-tempat bersejarah di Yogyakarta dan atribut-atributnya.
          </li>
          <li>
            Seluruh data yang ditampilkan dalam situs ini bersumber dari beberapa literatur sebagai berikut:
            <ul class="reference-list">
              <li><em>Buku Sejarah Keraton Yogyakarta</em> oleh Sabdacarakatama (Ki.)</li>
              <li><em>TAMANSARI</em> oleh Drs. Djoko Soekiman, dkk.</li>
              <li><em>Museum Benteng Vredeburg Yogyakarta</em> oleh Departemen Kebudayaan dan Pariwisata, 2007</li>
              <li><em>Candi-Candi di Jawa Tengah dan Yogyakarta</em> oleh Artbanu Wishnu Aji, S.Sn, M.T., 2018</li>
            Serta berbagai sumber terbuka dari internet.
            </ul>
          </li>
          <li>
            Gambar-gambar dan ilustrasi yang digunakan berasal dari berbagai sumber terbuka di internet.
          </li>
          <li>
            Saya tidak mengklaim hak kepemilikan atas data maupun gambar yang ada di situs ini. Semua hak cipta sepenuhnya dimiliki oleh pemegang hak aslinya.
          </li>
          <li>
            Situs ini dibuat murni untuk keperluan edukasi dan non-komersial. Jika Anda adalah pemilik sah dari konten yang ditampilkan dan keberatan atas penggunaannya, silakan hubungi saya untuk tindakan lebih lanjut, seperti atribusi atau penghapusan.
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  // Tidak ada script khusus dibutuhkan
  </script>
  
  <style scoped>
  .about-container {
    display: flex;
    justify-content: center;
    padding: 2rem;
    background-color: #f9f9f9;
    min-height: 100vh;
  }
  
  .about-card {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    padding: 2rem;
    max-width: 800px;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
  }
  
  h2 {
    font-size: 32px;
    color: #2c3e50;
    margin-bottom: 1.5rem;
    border-left: 6px solid #3498db;
    padding-left: 12px;
  }
  
  ul {
    list-style: none;
    padding-left: 0;
  }
  
  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 1.2rem;
    line-height: 1.6;
  }
  
  li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #3498db;
    font-size: 1.2rem;
    line-height: 1;
  }
  
  .reference-list {
    margin-top: 0.6rem;
    list-style: none;
    padding-left: 0;
  }
  
  .reference-list li {
    font-style: italic;
    font-size: 0.95rem;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .reference-list li::before {
    content: '–';
    color: #95a5a6;
    position: absolute;
    left: 0;
  }
  </style>
  