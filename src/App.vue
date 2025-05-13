<template>
  <div class="container">
    <AppHeader />
    <main class="content">
      <router-view></router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script>
import { computed } from "vue";// Import untuk membuat properti reaktif berbasis perhitungan
import { useStore } from "vuex"; // Import Vuex
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  setup() {
    const store = useStore(); // Gunakan store Vuex
    const message = computed(() => store.state.message); // Akses state dari Vuex

    // Fungsi untuk mengubah pesan
    const updateMessage = () => {
      store.commit("setMessage", "Pesan baru dari Vuex!"); // Gunakan mutation untuk mengubah state
    };

    return {
      message,
      updateMessage,
    };
  },
};
</script>

<style scoped>
/* Style for App */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  flex-grow: 1;
}
</style>
