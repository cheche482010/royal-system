<template>
    <Header />
    <div class="cart-container">
      <div class="cart-header">
        <h1 class="cart-title">Mi Carrito</h1>
        <p class="cart-count">{{ cartItems.length }} productos</p>
      </div>
      
      <div class="cart-content" v-if="cartItems.length > 0">
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            
            <div class="item-details">
              <div class="item-brand">{{ item.brand }}</div>
              <div class="item-name">{{ item.name }}</div>
              <div class="item-price">{{ item.price }}</div>
              
              <div class="item-actions">
                <div class="quantity-selector">
                  <button 
                    class="quantity-button" 
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                  >
                    <MinusIcon class="quantity-icon" />
                  </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button 
                    class="quantity-button" 
                    @click="updateQuantity(item.id, item.quantity + 1)"
                  >
                    <PlusIcon class="quantity-icon" />
                  </button>
                </div>
                
                <button class="remove-button" @click="removeItem(item.id)">
                  <TrashIcon class="remove-icon" />
                  Eliminar
                </button>
              </div>
            </div>
            
            <div class="item-total">
              <div class="total-label">Total:</div>
              <div class="total-price">{{ formatPrice(item.price * item.quantity) }}</div>
            </div>
          </div>
        </div>
        
        <div class="cart-sidebar">
          <div class="cart-summary">
            <h2 class="summary-title">Resumen del pedido</h2>
            
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ subtotal }}</span>
            </div>
            
            <div class="summary-row">
              <span>Envío</span>
              <span>{{ shipping }}</span>
            </div>
            
            <div class="summary-row discount" v-if="discount">
              <span>Descuento</span>
              <span>-{{ discount }}</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ total }}</span>
            </div>
            
            <button class="checkout-button" @click="checkout">
              Finalizar compra
            </button>
            
            <div class="secure-checkout">
              <LockIcon class="lock-icon" />
              <span>Pago seguro garantizado</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="empty-cart" v-else>
        <ShoppingCartIcon class="empty-icon" />
        <h2 class="empty-title">Tu carrito está vacío</h2>
        <p class="empty-message">Parece que aún no has añadido productos a tu carrito</p>
        <router-link to="/" class="continue-shopping">Continuar comprando</router-link>
      </div>
      
      <div class="related-products" v-if="cartItems.length > 0">
        <h2 class="related-title">También te puede interesar</h2>
        
        <div class="related-grid">
          <div v-for="product in relatedProducts" :key="product.id" class="product-card">
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="product-brand">{{ product.brand }}</div>
            <div class="product-name">{{ product.name }}</div>
            <div class="product-price">{{ product.price }}</div>
            <button class="add-to-cart" @click="addToCart(product)">
              <ShoppingCartIcon class="cart-icon" />
              Añadir
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

<script src="./Cart.js"></script>
<style scoped src="./Cart.scss" lang="scss"></style>