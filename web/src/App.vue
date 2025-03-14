<template>
  <div class="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header/Header.vue';

export default {
  name: 'App',
  components: {
    Header
  }
};
</script>