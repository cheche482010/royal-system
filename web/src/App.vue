<template>
  <div class="app">
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { createAuth } from './composables/useAuth'

export default {
  name: 'App',
  setup() {
    const auth = createAuth()
    return { auth }
  }
} 
</script>