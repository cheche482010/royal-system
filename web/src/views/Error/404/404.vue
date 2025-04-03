<template>
  <div class="error-404">
    <div class="error-content">
      <img 
        src="https://static-00.iconduck.com/assets.00/404-page-not-found-illustration-2048x998-yjzeuy4v.png"
        alt="404 Not Found" 
        class="error-image" 
      />
      <h1>¡Ups! Página no encontrada</h1>
      <p class="error-message">
        Parece que te has perdido. No te preocupes, aquí tienes un botón para volver a casa.
      </p>
      <router-link to="/home" class="home-button">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script src="./404.js"></script>
<style scoped src="./404.scss" lang="scss"></style>