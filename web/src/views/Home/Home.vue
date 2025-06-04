<template>
  <Header />
  <div class="home">
    <div class="banner-slider">
      <div class="banner-slide" :class="{ active: activeSlide === index }" v-for="(slide, index) in banners" :key="index">
        <div class="banner-content">
          <div class="banner-info">
            <div class="banner-brand">{{ slide.brand }}</div>
            <h2 class="banner-title">{{ slide.title }}</h2>
            <div class="banner-features">
              <div class="feature" v-for="(feature, i) in slide.features" :key="i">
                <component :is="feature.icon" class="feature-icon" />
                <span>{{ feature.text }}</span>
              </div>
            </div>
            <div class="banner-discount">{{ slide.discount }}</div>
            <div class="banner-subtitle">{{ slide.subtitle }}</div>
            <a :href="slide.link" class="banner-cta">{{ slide.cta }}</a>
          </div>
          <div class="banner-image">
            <img :src="slide.image" :alt="slide.title" />
          </div>
        </div>
      </div>
      
      <div class="banner-indicators">
        <button 
          v-for="(_, index) in banners" 
          :key="index" 
          class="indicator" 
          :class="{ active: activeSlide === index }"
          @click="setActiveSlide(index)"
        ></button>
      </div>
    </div>
  
    <section class="product-section">
      <div class="section-header">
        <h2 class="section-title">{{ featuredSection.title }}</h2>
        <a :href="featuredSection.link" class="section-link">
          Ver más
          <ArrowRightIcon class="arrow-icon" />
        </a>
      </div>
      
      <!-- Productos destacados usando el componente ProductCarousel -->
      <ProductCarousel 
        v-if="featuredProducts.length > 0"
        :products="featuredProducts"
      /> 
      <div v-else class="empty-products-container">
        <div class="empty-products-content">
          <div class="empty-products-icon">
            <ShoppingCartIcon size="64" />
          </div>
          <h3 class="empty-products-title">¡Productos agotados temporalmente!</h3>
          <p class="empty-products-message">
            Estamos reabasteciendo nuestro inventario con nuevos productos.
            ¡Vuelve pronto para descubrir nuestras novedades!
          </p>
          <div class="empty-products-actions">
             <button class="notify-button" @click="notifyWhenAvailable">
              Notificarme cuando haya nuevos productos
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Footer />
</template>

<script src="./Home.js"></script>
<style scoped src="./Home.scss"></style>