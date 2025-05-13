const cors_proxy = require('cors-anywhere');

// Konfigurasi server proxy
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8080;

// Buat server proxy
const server = cors_proxy.createServer({
  originWhitelist: [], // Izinkan semua origin
  requireHeader: [], // Tidak memerlukan header khusus
  removeHeaders: [
    'cookie',
    'cookie2',
    'x-request-start',
    'x-request-id',
    'via',
    'connect-time',
    'total-route-time'
  ], // Hapus header sensitif
  redirectSameOrigin: true,
  httpProxyOptions: {
    xfwd: false,
    secure: true,
    changeOrigin: true
  }
});

// Jalankan server
server.listen(port, host, () => {
  console.log(`CORS Anywhere proxy server berjalan di http://${host}:${port}`);
});

// Tangani error server
server.on('error', (err) => {
  console.error('Error pada server proxy:', err);
});

// Tangani sinyal terminasi
process.on('SIGINT', () => {
  console.log('\nMenutup server proxy...');
  server.close(() => {
    process.exit(0);
  });
});