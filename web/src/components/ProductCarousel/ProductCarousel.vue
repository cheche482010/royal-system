<template>
  <div class="product-carousel">
    <h2 v-if="title" class="carousel-title">{{ title }}</h2>
    
    <div class="carousel-container">
      <button 
        v-if="products.length > 4" 
        class="carousel-arrow carousel-arrow-left" 
        @click="scrollLeft"
        :disabled="scrollPosition <= 0"
      >
        <ChevronLeftIcon class="arrow-icon" />
      </button>
      
      <div class="carousel-track" ref="carouselTrack">
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="product-card"
        >
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="product-brand">{{ product.brand }}</div>
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">${{ typeof product.price === 'number' ? product.price.toFixed(2) : product.price }}</div>
          
          <div class="product-actions">
            <button class="view-details-button" @click="viewProductDetails(product)">
              <EyeIcon class="button-icon" />
              Ver detalles
            </button>
            <button class="add-to-cart-button" @click="addToCart(product)">
              <ShoppingCartIcon class="button-icon" />
              Añadir
            </button>
          </div>
        </div>
      </div>
      
      <button 
        v-if="products.length > 4" 
        class="carousel-arrow carousel-arrow-right" 
        @click="scrollRight"
        :disabled="scrollPosition >= maxScrollPosition"
      >
        <ChevronRightIcon class="arrow-icon" />
      </button>
    </div>
  </div>
</template>

<script src="./ProductCarousel.js"></script>
<style scoped src="./ProductCarousel.scss" lang="scss"></style>