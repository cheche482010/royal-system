<template>
  <Header :disable-nav="true" />
  <div>
    <!-- Overlay para zoom de imagen -->
    <div v-if="showZoom" class="zoom-overlay" @click="closeZoom">
      <div class="zoom-container">
        <img :src="currentImage" :alt="productItems[0].name" class="zoomed-image" />
        <button class="close-zoom" @click="toggleZoom">×</button>
      </div>
    </div>

    <div class="product-container">
      <div class="product-gallery">
        <div class="main-image">
          <img :src="currentImage" :alt="productItems[0].name" />
          <button class="zoom-button" @click="toggleZoom">
            <Search class="zoom-icon" />
          </button>
        </div>
        <div class="thumbnails">
          <div 
            v-for="(image, index) in productItems[0].images" 
            :key="index" 
            class="thumbnail" 
            :class="{ active: selectedImageIndex === index }"
            @click="selectImage(index)"
          >
            <img :src="image" :alt="'Thumbnail ' + productItems[0].name" />
          </div>
        </div>
      </div>
      <div class="product-info">
        <h1 class="breadcrumb-item current">{{ productItems[0].name }}</h1>

        <div class="product-price">
          ${{ totalPrice }}
        </div>

        <div class="breadcrumbs">
          <router-link to="/" class="breadcrumb-item">Inicio</router-link>
          <span class="separator">›</span>
          <router-link to="/perros" class="breadcrumb-item">PERROS</router-link>
          <span class="separator">›</span>
          <router-link to="/perros/alimento" class="breadcrumb-item">ALIMENTO PARA PERROS</router-link>
          <span class="separator">›</span>
          <router-link to="/perros/alimento/medicados" class="breadcrumb-item">Alimentos Medicados para
            Perros</router-link>
          <span class="separator">›</span>
          <span class="breadcrumb-item current">{{ productItems[0].name }}</span>
        </div>

        <div class="product-meta">
          <div class="meta-item">
            <span class="meta-label">SKU</span>
            <span class="meta-value">8595602528196</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Categoría</span>
            <router-link to="/perros/alimento/medicados" class="meta-value link">Alimentos Medicados para
              Perros</router-link>
          </div>
          <div class="meta-item">
            <span class="meta-label">Marca:</span>
            <router-link to="/marcas/brit" class="meta-value link">{{ productItems[0].brand }}</router-link>
          </div>
        </div>

        <div class="stock-info">
          <div class="stock-icon">
            <CheckCircle class="check-icon" />
          </div>
          <span class="stock-text">{{ productItems[0].inventory }} disponibles</span>
        </div>

        <div class="add-to-cart">
          <div class="quantity-selector">
            <button class="quantity-button" @click="decreaseQuantity">-</button>
            <input type="number" v-model="quantity" min="1" class="quantity-input" />
            <button class="quantity-button" @click="increaseQuantity">+</button>
          </div>
          <button class="cart-button" @click="addToCart">
            Añadir al carrito
          </button>
        </div>

        <div class="product-description">
          <p>Complete balanced food for dogs with damaged kidney functions. Promotes kidney functions in cases of
            chronic kidney failure.</p>
        </div>

        <div class="product-section">
          <h2 class="section-title">COMPOSITION:</h2>
          <p class="composition-text">
            Yellow peas (44%), polo fat (12%), buckwheat, eggs (10%), apple pulp, hydrolyzed salmon protein (7%),
            salmon
            oil (2%), hydrolyzed chicken liver ( 2%), minerals, eggshells (source of calcium), potassium citrate
            (0.8%),
            silium shell and seeds (0.5%), dried seaweed (0.5%, Ascophyllum nodosum), chitosan (0.08%), yeast extract
            (source of oligosaccharides, 0.025%), beta glucans (0.22%), fruit-oligosaccharides (0.02%), Yucca mojave
            (0.02%), sea buckthorn ( 0.015%).
          </p>
        </div>
      </div>
    </div>
    <div class="related-products" v-if="productItems.length > 0">
      <h2 class="related-title">También te puede interesar</h2>

      <div class="related-grid">
        <div v-for="product in relatedProductsdetails" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="product-brand">{{ product.brand }}</div>
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">${{ product.price.toFixed(2) }}</div>
          <button class="add-to-cart" @click="viewProductOptions(product)">
            <ShoppingCartIcon class="cart-icon" />
            Ver opciones
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./ProductDetails.js"></script>
<style scoped src="./ProductDetails.scss" lang="scss"></style>