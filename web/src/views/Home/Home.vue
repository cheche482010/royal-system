<template>
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
      
      <div class="product-grid">
        <div class="product-card" v-for="product in featuredProducts" :key="product.id">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="product-price">{{ product.price }}</div>
          <div class="product-brand">{{ product.brand }}</div>
          <div class="product-name">{{ product.name }}</div>
          <div class="product-rating">
            <ShoppingCartIcon />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script src="./Home.js"></script>
<style scoped src="./Home.scss" lang="scss"></style>