<template>
  <Header :disable-nav="true" />

  <!-- Overlay para zoom de imagen -->
  <div v-if="showZoom" class="zoom-overlay" @click="closeZoom">
    <div class="zoom-container">
      <img :src="`${API_BASE_URL}${currentImage}`" :alt="productItems?.name" class="zoomed-image" />
      <button class="close-zoom" @click="toggleZoom">×</button>
    </div>
  </div>

  <div v-if="loading" class="loading-state">
    <p>Cargando producto...</p>
  </div>
  <div v-else-if="error" class="error-state">
    <p>{{ error }}</p>
    <button @click="loadProductDetails">Reintentar</button>
  </div>
  <div v-else-if="productItems" class="product-container">

    <div class="product-gallery">
      <div class="main-image">
        <img :src="`${API_BASE_URL}${currentImage}`" :alt="productItems.name" />
        <button class="zoom-button" @click="toggleZoom">
          <Search class="zoom-icon" />
        </button>
      </div>
      <div class="thumbnails">
        <div v-for="(image, index) in productItems.images" :key="index" class="thumbnail"
          :class="{ active: selectedImageIndex === index }" @click="selectImage(index)">
          <img :src="`${API_BASE_URL}${image}`" :alt="'Thumbnail ' + productItems.name" />
        </div>
      </div>
    </div>

    <div class="product-info">
      <div class="breadcrumbs">
        <router-link to="/" class="breadcrumb-item">Inicio</router-link>
        <span class="separator">›</span>
        <router-link :to="`/categoria/${productItems.categoria_id}`" class="breadcrumb-item">
          {{ productItems.categoria }}
        </router-link>
        <span class="separator">›</span>
        <router-link :to="`/marca/${productItems.marca_id}`" class="breadcrumb-item">
          {{ productItems.brand }}
        </router-link>
      </div>

      <h1 class="product-title">{{ productItems.name }}</h1>

      <div class="product-price">
        <div class="price-usd">{{ totalPrice }}</div>
        <div class="price-bs">{{ totalPriceBs }}</div>
      </div>

      <div class="product-meta">
        <div class="meta-item">
          <span class="meta-label">Categoría:</span>
          <router-link :to="`/categoria/${productItems.categoria_id}`" class="meta-value link">
            {{ productItems.categoria }}
          </router-link>
        </div>
        <div class="meta-item">
          <span class="meta-label">Marca:</span>
          <router-link :to="`/marca/${productItems.marca_id}`" class="meta-value link">
            {{ productItems.brand }}
          </router-link>
        </div>
      </div>

      <div class="stock-info">
        <div class="stock-icon">
          <CheckCircle v-if="productItems.inventory > 0 && productItems.stockStatus !== 'Reservado'" class="check-icon" />
          <XCircle v-else class="x-icon" />
        </div>
        <span class="stock-text"
          :class="{ 'out-of-stock': productItems.inventory === 0 || productItems.stockStatus === 'Reservado' }">
          {{ productItems.inventory > 0 && productItems.stockStatus !== 'Reservado'
            ? `${productItems.inventory} disponibles`
            : 'No disponible' }}
        </span>
      </div>

      <div class="add-to-cart">
        <div class="quantity-selector">
          <button class="quantity-button" 
            @click="decreaseQuantity" 
            :disabled="productItems.inventory === 0 || productItems.stockStatus === 'Reservado'">
            -
          </button>

          <input type="number" 
            v-model="quantity" min="1" 
            :max="productItems.inventory" 
            class="quantity-input"
            :disabled="productItems.inventory === 0 || productItems.stockStatus === 'Reservado'" />

          <button 
            class="quantity-button" @click="increaseQuantity"
            :disabled="productItems.inventory === 0 || productItems.stockStatus === 'Reservado' || quantity >= productItems.inventory">
            +
          </button>
        </div>
        
        <button 
          class="cart-button" 
          @click="addToCart" 
          :disabled="productItems.inventory === 0 || productItems.stockStatus === 'Reservado'">
          {{ productItems.inventory > 0 && productItems.stockStatus !== 'Reservado' ? 'Añadir al carrito' : 'No disponible' }}
        </button>
      </div>

      <div class="product-description">
        <p>{{ productItems.description }}</p>
      </div>
    </div>
  </div>
  <ProductCarousel class="related-products" v-if="relatedProductsdetails.length > 0" :products="relatedProductsdetails"
    title="También te puede interesar" />
  <Footer />
</template>

<script src="./ProductDetails.js"></script>
<style scoped src="./ProductDetails.scss"></style>
