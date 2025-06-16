<template>
  <div class="product-carousel">
    <h2 v-if="title" class="carousel-title">{{ title }}</h2>

    <div class="carousel-container">
      <button v-if="products.length > 4" class="carousel-arrow carousel-arrow-left" @click="scrollLeft"
        :disabled="scrollPosition <= 0">
        <ChevronLeftIcon class="arrow-icon" />
      </button>

      <div class="carousel-track" ref="carouselTrack">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="`${API_BASE_URL}${product.image}`" :alt="product.name" />
            <div class="product-badges">
              <!-- Badge de estado de stock -->
              <span class="badge stock-badge" :class="{
                'out-of-stock': product.isOutOfStock || product.stockStatus === 'Reservado',
                'in-stock': !product.isOutOfStock && product.stockStatus !== 'Reservado'
              }">
                {{ (product.isOutOfStock || product.stockStatus === 'Reservado') ? 'Agotado' : 'Disponible' }}
              </span>
              <!-- Badges existentes si los hay -->
              <span v-for="badge in product.badges" :key="badge.type" class="badge" :class="badge.type"
                v-if="product.badges && product.badges.length > 0">
                {{ badge.text }}
              </span>
            </div>
          </div>
          <div class="product-brand">{{ product.brand }}</div>
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">
            <div class="price-usd">{{ formatPrice(product.price) }} $</div>
            <div class="price-bs">{{ formatPriceBs(product.price) }}</div>
          </div>

          <div class="product-actions">
            <button class="view-details-button" @click="viewProductDetails(product)">
              <EyeIcon class="button-icon" />
              Ver detalles
            </button>
            <button class="add-to-cart-button"
              :class="{ 'disabled': product.isOutOfStock || product.stockStatus === 'Reservado' }"
              :disabled="product.isOutOfStock || product.stockStatus === 'Reservado'" @click="addToCart(product)">
              <ShoppingCartIcon class="button-icon" />
              {{ (product.isOutOfStock || product.stockStatus === 'Reservado') ? 'Agotado' : 'Añadir' }}
            </button>
          </div>
        </div>
      </div>

      <button v-if="products.length > 4" class="carousel-arrow carousel-arrow-right" @click="scrollRight"
        :disabled="scrollPosition >= maxScrollPosition">
        <ChevronRightIcon class="arrow-icon" />
      </button>
    </div>
  </div>
</template>

<script src="./ProductCarousel.js"></script>
<style scoped src="./ProductCarousel.scss" lang="scss"></style>