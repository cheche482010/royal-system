<template>
  <Header />
  <div class="payment-container">
    <div class="payment-header">
      <div class="payment-tabs">
        <span :class="{ active: activeTab === 'cuenta' }" @click="activeTab = 'cuenta'">Cuenta Bancaria</span>
        <span :class="{ active: activeTab === 'pago-movil' }" @click="activeTab = 'pago-movil'">Pago Movil</span>
      </div>
    </div>

    <div class="payment-tabs-content">
      <div v-if="activeTab === 'cuenta'" class="tab-content">
        <div class="bank-content">
          <div class="bank-info">
            <span class="bank-label">Nombre:</span>
            <span class="bank-value">{{ bankData.cuenta.nombre }}</span>
          </div>
          <div class="bank-info">
            <span class="bank-label">Banco:</span>
            <span class="bank-value">{{ bankData.cuenta.banco }}</span>
          </div>
          <div class="bank-info">
            <span class="bank-label">Cuenta:</span>
            <span class="bank-value">{{ bankData.cuenta.cuenta }}</span>
          </div>
          <div class="bank-info">
            <span class="bank-label">Tipo de Cuenta:</span>
            <span class="bank-value">{{ bankData.cuenta.tipoCuenta }}</span>
          </div>
          <div class="bank-info">
            <span class="bank-label">Rif:</span>
            <span class="bank-value">{{ bankData.cuenta.rif }}</span>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'pago-movil'" class="tab-content">
        <div class="bank-content">
          <div class="bank-info">
            <span class="bank-label">Banco:</span>
            <span class="bank-value">{{ bankData.pagoMovil.banco }}</span>
          </div>
          <div class="bank-info">
            <span class="bank-label">Rif:</span>
            <span class="bank-value">{{ bankData.pagoMovil.rif }}</span>
          </div>
          <div class="bank-info">
            <span class="bank-label">Telefono:</span>
            <span class="bank-value">{{ bankData.pagoMovil.telefono }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="payment-content" v-if="!loading">
      <div class="payment-form">
        <div class="form-section">
          <h2 class="section-title">Información de Pago</h2>

          <!-- Método de pago -->
          <div class="form-group">
            <label for="metodo_pago" class="form-field-required">Método de Pago</label>
            <select id="metodo_pago" v-model="paymentInfo.metodo_pago" class="form-control"
              @change="paymentInfo.bank = ''">
              <option value="">Selecciona un método de pago</option>
              <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                {{ method.nombre }}
              </option>
            </select>
          </div>

          <!-- Banco (solo visible si es transferencia) -->
          <div class="form-group" v-if="paymentInfo.metodo_pago == '1'">
            <label for="bank" class="form-field-required">Banco</label>
            <select id="bank" v-model="paymentInfo.bank" class="form-control">
              <option value="">Selecciona un banco</option>
              <option v-for="bank in banks" :key="bank.id" :value="bank.id">
                {{ bank.nombre_banco }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="reference" class="form-field-required">Referencia</label>
            <input type="text" id="reference" v-model="paymentInfo.reference" class="form-control"
              :placeholder="paymentInfo.metodo_pago === '1' ? 'Número de referencia bancaria' : 'Número de referencia'" />
          </div>

          <div class="form-group">
            <label for="amount" class="form-field-required">Monto Pagado</label>
            <input type="text" id="amount" :value="totalBs" class="form-control" placeholder="0,00 BS" readonly />
          </div>

          <div class="form-group">
            <label for="receipt" class="form-field-required">Comprobante de Pago</label>
            <div class="file-upload">
              <input type="file" id="receipt" @change="handleFileUpload" class="file-input" accept="image/*" />
              <div class="upload-button" :class="{ 'has-file': fileSelected }">
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
            <label for="name" class="form-field-required">Nombre De Receptor</label>
            <input type="text" id="name" v-model="shippingInfo.name" class="form-control"
              placeholder="Tu nombre De Receptor" />
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label for="state" class="form-field-required">Estado</label>
              <input type="text" id="state" v-model="shippingInfo.state" class="form-control" placeholder="Estado" />
            </div>

            <div class="form-group half">
              <label for="city" class="form-field-required">Ciudad</label>
              <input type="text" id="city" v-model="shippingInfo.city" class="form-control" placeholder="Ciudad" />
            </div>
          </div>

          <div class="form-group">
            <label for="address" class="form-field-required">Dirección</label>
            <textarea id="address" v-model="shippingInfo.address" class="form-control"
              placeholder="Tu dirección de envío" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label for="phone" class="form-field-required">Teléfono</label>
            <input type="tel" id="phone" v-model="shippingInfo.phone" class="form-control"
              placeholder="Tu número de teléfono" />
          </div>
        </div>
      </div>

      <div class="payment-sidebar">
        <div class="order-summary">
          <h2 class="summary-title">Resumen del pedido</h2>

          <div class="order-items">
            <div v-for="item in orderItems" :key="item.id" class="order-item">
              <div class="item-image">
                <img :src="`${API_BASE_URL}${item.image}`" :alt="item.name" />
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
            <span>Descuento ({{ coupon }})</span>
            <span>-{{ discount }}</span>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-row total">
            <span>Total</span>
            <span>{{ total }}</span>
          </div>
          <div class="summary-row total-bs">
            <span>Total BS</span>
            <span>{{ totalBs }}</span>
          </div>

          <button class="confirm-button" @click="confirmPayment" :disabled="!isFormValid">
            Confirmar pago
          </button>

          <div class="secure-checkout">
            <LockIcon class="lock-icon" />
            <span>Pago seguro garantizado</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading-container">
      Cargando información...
    </div>
  </div>
  <Footer />
</template>

<script src="./Payment.js"></script>
<style scoped src="./Payment.scss" lang="scss"></style>