<template>
  <Header />
  <div class="user-container">
    <div class="user-sidebar">
      <div class="user-profile">
        <div class="avatar">
          <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?height=80&width=80" alt="Avatar" />
        </div>
        <div class="user-info">
          <h3 class="user-name">{{ user.name }}</h3>
          <p class="user-email">{{ user.email }}</p>
        </div>
      </div>
      
      <nav class="user-nav">
        <button 
          v-for="item in navItems" 
          :key="item.id" 
          class="nav-item" 
          :class="{ active: activeSection === item.id }"
          @click="setActiveSection(item.id)"
        >
          <component :is="item.icon" class="nav-icon" />
          <span>{{ item.label }}</span>
        </button>
      </nav>
      
      <button class="logout-button" @click="handleLogout">
        <LogOutIcon class="logout-icon" />
        Cerrar sesión
      </button>
    </div>
    
    <div class="user-content">
      <!-- Sección de Pedidos -->
      <div v-if="activeSection === 'orders'" class="content-section">
        <h2 class="section-title">Mis Pedidos</h2>
        
        <div v-if="orders.length > 0" class="orders-list">
          <div v-for="order in orders" :key="order.id" class="order-card">
            <div class="order-header">
              <div class="order-info">
                <div class="order-number">Pedido #{{ order.number }}</div>
                <div class="order-date">{{ order.date }}</div>
              </div>
              <div class="order-status" :class="order.status">{{ order.statusText }}</div>
            </div>
            
            <div class="order-products">
              <div v-for="product in order.products" :key="product.id" class="product-item">
                <div class="product-image">
                  <img :src="product.image" :alt="product.name" />
                </div>
                <div class="product-details">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-price">{{ product.price }}</div>
                  <div class="product-quantity">Cantidad: {{ product.quantity }}</div>
                </div>
              </div>
            </div>
            
            <div class="order-footer">
              <div class="order-total">
                <span>Total:</span>
                <span class="total-amount">{{ order.total }}</span>
              </div>
              <button class="details-button">Ver detalles</button>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <PackageIcon class="empty-icon" />
          <h3>No tienes pedidos todavía</h3>
          <p>Explora nuestra tienda y realiza tu primer pedido</p>
          <router-link to="/" class="shop-button">Ir a la tienda</router-link>
        </div>
      </div>
      
      <!-- Sección de Direcciones -->
      <div v-if="activeSection === 'addresses'" class="content-section">
        <h2 class="section-title">Mis Direcciones</h2>
        
        <div class="addresses-grid">
          <div v-for="address in addresses" :key="address.id" class="address-card">
            <div class="address-header">
              <h3 class="address-title">{{ address.title }}</h3>
              <div class="address-actions">
                <button class="edit-button">
                  <EditIcon class="edit-icon" />
                </button>
                <button class="delete-button">
                  <TrashIcon class="delete-icon" />
                </button>
              </div>
            </div>
            
            <div class="address-content">
              <p class="address-name">{{ address.name }}</p>
              <p class="address-line">{{ address.street }}</p>
              <p class="address-line">{{ address.postalCode }} {{ address.city }}</p>
              <p class="address-line">{{ address.country }}</p>
              <p class="address-phone">{{ address.phone }}</p>
            </div>
            
            <div v-if="address.default" class="default-badge">Predeterminada</div>
          </div>
          
          <div class="add-address-card">
            <button class="add-button">
              <PlusIcon class="plus-icon" />
              <span>Añadir nueva dirección</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Sección de Mascotas -->
      <div v-if="activeSection === 'pets'" class="content-section">
        <h2 class="section-title">Mis Mascotas</h2>
        
        <div class="pets-grid">
          <div v-for="pet in pets" :key="pet.id" class="pet-card">
            <div class="pet-image">
              <img :src="pet.image" :alt="pet.name" />
            </div>
            <div class="pet-info">
              <h3 class="pet-name">{{ pet.name }}</h3>
              <p class="pet-breed">{{ pet.breed }}</p>
              <p class="pet-age">{{ pet.age }} años</p>
            </div>
            <div class="pet-actions">
              <button class="edit-button">
                <EditIcon class="edit-icon" />
              </button>
              <button class="delete-button">
                <TrashIcon class="delete-icon" />
              </button>
            </div>
          </div>
          
          <div class="add-pet-card">
            <button class="add-button">
              <PlusIcon class="plus-icon" />
              <span>Añadir mascota</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Sección de Perfil -->
      <div v-if="activeSection === 'profile'" class="content-section">
        <h2 class="section-title">Mi Perfil</h2>
        
        <form @submit.prevent="updateProfile" class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label for="profileName">Nombre</label>
              <input 
                type="text" 
                id="profileName" 
                v-model="profileForm.name" 
                placeholder="Tu nombre" 
              />
            </div>
            
            <div class="form-group">
              <label for="profileLastName">Apellidos</label>
              <input 
                type="text" 
                id="profileLastName" 
                v-model="profileForm.lastName" 
                placeholder="Tus apellidos" 
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="profileEmail">Email</label>
            <input 
              type="email" 
              id="profileEmail" 
              v-model="profileForm.email" 
              placeholder="Tu email" 
              disabled
            />
          </div>
          
          <div class="form-group">
            <label for="profilePhone">Teléfono</label>
            <input 
              type="tel" 
              id="profilePhone" 
              v-model="profileForm.phone" 
              placeholder="Tu teléfono" 
            />
          </div>
          
          <div class="form-group checkbox">
            <input type="checkbox" id="profileNewsletter" v-model="profileForm.newsletter" />
            <label for="profileNewsletter">
              Quiero recibir ofertas y novedades por email
            </label>
          </div>
          
          <button type="submit" class="save-button" :disabled="isUpdating">
            <LoaderIcon v-if="isUpdating" class="spinner" />
            <span v-else>Guardar cambios</span>
          </button>
        </form>
        
        <div class="password-section">
          <h3 class="subsection-title">Cambiar contraseña</h3>
          
          <form @submit.prevent="updatePassword" class="password-form">
            <div class="form-group">
              <label for="currentPassword">Contraseña actual</label>
              <input 
                type="password" 
                id="currentPassword" 
                v-model="passwordForm.current" 
                placeholder="Tu contraseña actual" 
              />
            </div>
            
            <div class="form-group">
              <label for="newPassword">Nueva contraseña</label>
              <input 
                type="password" 
                id="newPassword" 
                v-model="passwordForm.new" 
                placeholder="Tu nueva contraseña" 
              />
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Confirmar contraseña</label>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="passwordForm.confirm" 
                placeholder="Confirma tu nueva contraseña" 
              />
            </div>
            
            <button type="submit" class="save-button" :disabled="isUpdatingPassword">
              <LoaderIcon v-if="isUpdatingPassword" class="spinner" />
              <span v-else>Actualizar contraseña</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

</script>

<script src="./User.js"></script>
<style scoped src="./User.scss" lang="scss"></style>