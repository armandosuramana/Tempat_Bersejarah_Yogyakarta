<template>
  <header class="header">
    <div class="container">
      <h1>Tempat Bersejarah di Yogyakarta</h1>
      <nav>
        <button @click="goHome">Home</button>
        <button @click="goToVisualisasi">Visualisasi</button>
        <button @click="goToAbout">About Us</button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'Home' })
}

const goToVisualisasi = () => {
  router.push({ name: 'Visualisasi' })
}

const goToAbout = () => {
  router.push({ name: 'About' })
}
// Pastikan route 'About' sudah didefinisikan di router/index.js
</script>

<style scoped>
.header {
  background-color: #007bff;
  color: white;
  padding: 15px 0;
  display: flex;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

nav {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-right: 30px;
}

button {
  background-color: white;
  color: #007bff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #0056b3;
  color: white;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    text-align: center;
  }

  nav {
    margin-top: 10px;
    flex-direction: column;
    gap: 10px;
    margin-right: 0;
  }
}
</style>
