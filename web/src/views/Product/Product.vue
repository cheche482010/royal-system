<template>
  <Header />
  <div class="products-container">
    <div class="products-header">
      <h1 class="products-title">{{ category.name }}</h1>
      <p class="products-description">{{ category.description }}</p>
    </div>
    
    <div class="products-layout">
      <div class="filters-sidebar">
        <div class="filter-group">
          <h3 class="filter-title">Categorías</h3>
          <div class="filter-options">
            <label v-for="subcategory in subcategories" :key="subcategory.id" class="filter-option">
              <input type="checkbox" v-model="selectedSubcategories" :value="subcategory.id" />
              <span class="option-label">{{ subcategory.name }}</span>
              <span class="option-count">({{ subcategory.count }})</span>
            </label>
          </div>
        </div>
        
        <div class="filter-group">
          <h3 class="filter-title">Marcas</h3>
          <div class="filter-options">
            <label v-for="brand in brands" :key="brand.id" class="filter-option">
              <input type="checkbox" v-model="selectedBrands" :value="brand.id" />
              <span class="option-label">{{ brand.name }}</span>
              <span class="option-count">({{ brand.count }})</span>
            </label>
          </div>
          
          <button v-if="brands.length > 5" class="show-more">
            Ver más
            <ChevronDownIcon class="chevron-icon" />
          </button>
        </div>
        
        <div class="filter-group">
          <h3 class="filter-title">Precio</h3>
          <div class="price-range">
            <div class="price-inputs">
              <input 
                type="number" 
                v-model="priceRange.min" 
                placeholder="Min" 
                class="price-input"
              />
              <span class="price-separator">-</span>
              <input 
                type="number" 
                v-model="priceRange.max" 
                placeholder="Max" 
                class="price-input"
              />
              <button class="price-button" @click="applyPriceFilter">
                <FilterIcon class="filter-icon" />
              </button>
            </div>
          </div>
        </div>
        
        <button class="clear-filters" @click="clearFilters">
          <XIcon class="x-icon" />
          Limpiar filtros
        </button>
      </div>
      
      <div class="products-content">
        <div class="products-toolbar">
          <div class="products-count">
            {{ filteredProducts.length }} productos
          </div>
          
          <div class="products-sort">
            <label for="sort">Ordenar por:</label>
            <select id="sort" v-model="sortOption" class="sort-select">
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Precio: de menor a mayor</option>
              <option value="price-desc">Precio: de mayor a menor</option>
              <option value="newest">Más recientes</option>
            </select>
          </div>
          
          <div class="view-options">
            <button 
              class="view-button" 
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <LayoutGridIcon class="view-icon" />
            </button>
            <button 
              class="view-button" 
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <ListIcon class="view-icon" />
            </button>
          </div>
        </div>
        
        <div 
          class="products-grid" 
          :class="{ 'list-view': viewMode === 'list' }"
          v-if="filteredProducts.length > 0"
        >
          <div 
            v-for="product in paginatedProducts" 
            :key="product.id" 
            class="product-card"
          >
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
              <div class="product-badges" v-if="product.badges && product.badges.length > 0">
                <span 
                  v-for="badge in product.badges" 
                  :key="badge.type" 
                  class="badge"
                  :class="badge.type"
                >
                  {{ badge.text }}
                </span>
              </div>
            </div>
            
            <div class="product-content">
              <div class="product-brand">{{ product.brand }}</div>
              <div class="product-name">{{ product.name }}</div>
        
              <div class="product-price">
                <span v-if="product.originalPrice" class="original-price">{{ formatPrice(product.originalPrice) }}</span>
                <span class="current-price">{{ formatPrice(product.price) }}</span>
              </div>
              
              <div class="product-description" v-if="viewMode === 'list'">
                {{ product.description }}
              </div>
              
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
        </div>
        
        <div class="empty-results" v-else>
          <SearchXIcon class="empty-icon" />
          <h3 class="empty-title">No se encontraron productos</h3>
          <p class="empty-message">Intenta cambiar los filtros o buscar con otros términos</p>
          <button class="clear-filters-button" @click="clearFilters">Limpiar filtros</button>
        </div>
        
        <div class="pagination" v-if="totalPages > 1">
          <button 
            class="pagination-button prev" 
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <ChevronLeftIcon class="pagination-icon" />
            Anterior
          </button>
          
          <div class="pagination-pages">
            <button 
              v-for="page in paginationPages" 
              :key="page" 
              class="page-button" 
              :class="{ active: currentPage === page }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="pagination-button next" 
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Siguiente
            <ChevronRightIcon class="pagination-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./Product.js"></script>
<style scoped src="./Product.scss" lang="scss"></style>