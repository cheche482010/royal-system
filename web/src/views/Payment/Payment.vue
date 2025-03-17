<template>
    <Header />
    <div class="payment-container">
      <div class="payment-header">
        <h1 class="payment-title">Finalizar Compra</h1>
        <p class="payment-subtitle">Completa tu información de pago</p>
      </div>
      
      <div class="payment-content">
        <div class="payment-form">
          <div class="form-section">
            <h2 class="section-title">Información de Pago</h2>
            
            <div class="form-group">
              <label for="bank">Banco</label>
              <select id="bank" v-model="paymentInfo.bank" class="form-control">
                <option value="">Selecciona un banco</option>
                <option value="banco1">Banco Nacional</option>
                <option value="banco2">Banco Provincial</option>
                <option value="banco3">Banco Mercantil</option>
                <option value="banco4">Banco de Venezuela</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="reference">Referencia Bancaria</label>
              <input 
                type="text" 
                id="reference" 
                v-model="paymentInfo.reference" 
                class="form-control"
                placeholder="Número de referencia"
              />
            </div>
            
            <div class="form-group">
              <label for="amount">Monto Pagado</label>
              <input 
                type="text" 
                id="amount" 
                v-model="paymentInfo.amount" 
                class="form-control"
                placeholder="0,00$"
                readonly
              />
            </div>
            
            <div class="form-group">
              <label for="receipt">Comprobante de Pago</label>
              <div class="file-upload">
                <input 
                  type="file" 
                  id="receipt" 
                  @change="handleFileUpload" 
                  class="file-input"
                  accept="image/*"
                />
                <div class="upload-button">
                  <UploadIcon class="upload-icon" />
                  <span>{{ fileSelected ? 'Archivo seleccionado' : 'Subir comprobante' }}</span>
                </div>
              </div>
              <div v-if="fileSelected" class="file-preview">
                <div class="file-info">
                  <FileIcon class="file-icon" />
                  <span class="file-name">{{ fileName }}</span>
                </div>
                <button class="remove-file" @click="removeFile">
                  <XIcon class="remove-icon" />
                </button>
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <h2 class="section-title">Información de Envío</h2>
            
            <div class="form-group">
              <label for="name">Nombre De Receptor</label>
              <input 
                type="text" 
                id="name" 
                v-model="shippingInfo.name" 
                class="form-control"
                placeholder="Tu nombre De Receptor"
              />
            </div>
            
            <div class="form-row">
              <div class="form-group half">
                <label for="state">Estado</label>
                <input 
                  type="text" 
                  id="state" 
                  v-model="shippingInfo.state" 
                  class="form-control"
                  placeholder="Estado"
                />
              </div>

              <div class="form-group half">
                <label for="city">Ciudad</label>
                <input 
                  type="text" 
                  id="city" 
                  v-model="shippingInfo.city" 
                  class="form-control"
                  placeholder="Ciudad"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="address">Dirección</label>
              <textarea 
                id="address" 
                v-model="shippingInfo.address" 
                class="form-control"
                placeholder="Tu dirección de envío"
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="phone">Teléfono</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="shippingInfo.phone" 
                class="form-control"
                placeholder="Tu número de teléfono"
              />
            </div>
          </div>
        </div>
        
        <div class="payment-sidebar">
          <div class="order-summary">
            <h2 class="summary-title">Resumen del pedido</h2>
            
            <div class="order-items">
              <div v-for="item in orderItems" :key="item.id" class="order-item">
                <div class="item-image">
                  <img :src="item.image" :alt="item.name" />
                  <span class="item-quantity">{{ item.quantity }}</span>
                </div>
                <div class="item-info">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-price">{{ formatPrice(item.price * item.quantity) }}</div>
                </div>
              </div>
            </div>
            
            <div class="summary-divider"></div>
            
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
            
            <button 
              class="confirm-button" 
              @click="confirmPayment"
              :disabled="!isFormValid"
            >
              Confirmar pago
            </button>
            
            <div class="secure-checkout">
              <LockIcon class="lock-icon" />
              <span>Pago seguro garantizado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script src="./Payment.js"></script>
  <style scoped src="./Payment.scss" lang="scss"></style>