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
            <img :src="`${API_BASE_URL}${item.image}`" :alt="item.name" />
          </div>

          <div class="item-details">
            <div class="item-brand">{{ item.brand }}</div>
            <div class="item-name">{{ item.name }}</div>
            <div class="item-price">${{ typeof item.price === 'number' ? item.price.toFixed(2) : item.price }}</div>

            <div class="item-actions">
              <div class="quantity-selector">
                <button class="quantity-button" @click="updateQuantity(item.id, item.quantity - 1)"
                  :disabled="item.quantity <= 1">
                  <MinusIcon class="quantity-icon" />
                </button>
                <span class="quantity">{{ item.quantity }}</span>
                <button class="quantity-button" @click="updateQuantity(item.id, item.quantity + 1)">
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

          <div class="coupon-section">
            <div class="coupon-input">
              <input v-model="promoCode" type="text" placeholder="Código promocional" :disabled="appliedPromo">
              <button v-if="!appliedPromo" @click="applyPromoCode" class="apply-coupon-button">
                Aplicar
              </button>
              <button v-else @click="removePromoCode" class="remove-coupon-button">
                Eliminar
              </button>
            </div>
            <div v-if="couponError" class="coupon-error">
              {{ couponError }}
            </div>
            <div v-if="appliedPromo" class="coupon-success">
              Cupón aplicado: {{ appliedPromo.code }} (-{{ appliedPromo.percentage }}%)
            </div>
          </div>

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

          <div class="summary-row bs-total" v-if="dollarRate">
            <span>Total en Bs.</span>
            <span>{{ totalBs }}</span>
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

    <ProductCarousel v-if="featuredProducts.length > 0" title="También te puede interesar"
      :products="featuredProducts" />
  </div>
  <Footer />
</template>

<script src="./Cart.js"></script>
<style scoped src="./Cart.scss"></style>