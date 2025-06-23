<template>
  <Header :disable-nav="true" />
  <div class="user-container">
    <div class="user-sidebar">
      <div class="user-profile">
        <div class="avatar">
          <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?height=80&width=80"
            alt="Avatar" />
        </div>
        <div class="user-info">
          <h3 class="user-name">{{ user.name }}</h3>
          <p class="user-email">{{ user.email }}</p>
        </div>
      </div>

      <nav class="user-nav">
        <button v-for="item in navItems" :key="item.id" class="nav-item" :class="{ active: activeSection === item.id }"
          @click="setActiveSection(item.id)">
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

        <!-- Tabs para tipos de pedidos -->
        <div class="orders-tabs">
          <button class="tab-button" :class="{ active: activeOrdersTab === 'active' }"
            @click="setActiveOrdersTab('active')">
            Pedidos
          </button>
          <button class="tab-button" :class="{ active: activeOrdersTab === 'completed' }"
            @click="setActiveOrdersTab('completed')">
            Pedidos Finalizados
          </button>
          <button class="tab-button" :class="{ active: activeOrdersTab === 'cancelled' }"
            @click="setActiveOrdersTab('cancelled')">
            Pedidos Cancelados
          </button>
        </div>

        <!-- Controles de búsqueda y filtrado -->
        <div class="orders-controls">
          <div class="search-section">
            <div class="search-input-group">
              <input type="text" v-model="searchQuery"
                placeholder="Buscar por número, producto, estado, fecha (dd/mm/yyyy) o total..." class="search-input" />
              <button v-if="searchQuery" @click="clearFilters" class="clear-button">
                Limpiar
              </button>
            </div>
          </div>

          <div class="filter-section">
            <div class="sort-controls">
              <select v-model="sortBy" class="sort-select">
                <option value="date">Ordenar por fecha</option>
                <option value="total">Ordenar por total</option>
                <option value="status">Ordenar por estado</option>
              </select>
              <button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" class="sort-order-button"
                :title="sortOrder === 'asc' ? 'Orden ascendente' : 'Orden descendente'">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </button>
            </div>

            <div class="items-per-page">
              <label>Mostrar:</label>
              <select v-model="itemsPerPage" class="items-select">
                <option :value="5">5 por página</option>
                <option :value="10">10 por página</option>
                <option :value="20">20 por página</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Pedidos Activos -->
        <div v-if="activeOrdersTab === 'active'">
          <div v-if="paginatedActiveOrders.length > 0" class="orders-list">
            <div v-for="order in paginatedActiveOrders" :key="order.id" class="order-card">
              <!-- El contenido del order-card permanece igual -->
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
                    <div class="product-total">Total: {{ product.total }}</div>
                    <div class="product-total-pagado">Total pagado: {{ product.totalPagado }}</div>
                  </div>
                </div>
              </div>

              <div class="order-footer">
                <div class="order-total">
                  <span>Total:</span>
                  <span class="total-amount">{{ order.total }}</span>
                  <div class="total-amount-bs">
                    <span>Monto pagado:</span>
                    <span class="total-amount">{{ order.totalBs }}</span>
                  </div>
                </div>
                <div class="button-container">
                  <button v-if="order.Pagos && order.Pagos[0] && order.Pagos[0].comprobante_img"
                    class="comprobante-button" @click="openComprobantePopup(order)" style="margin-right: 10px;">
                    <EyeIcon class="icon" /> Comprobante
                  </button>
                  <button v-if="isAdmin" class="change-status-button" style="margin-right: 10px;"
                    @click="openChangeStatusModal(order)">
                    <CheckCircle2Icon class="icon" /> Cambiar estado
                  </button>
                  <button class="details-button" @click="openPDFPopup(order.id)">
                    <FileTextIcon class="icon" />Detalles
                  </button>
                </div>
              </div>
            </div>

            <!-- Controles de paginación -->
            <div v-if="totalPages > 1" class="pagination">
              <div class="pagination-controls">
                <button @click="prevPage" :disabled="currentPage === 1" class="pagination-nav-button">
                  ‹
                </button>

                <div class="pagination-numbers">
                  <button v-for="(page, index) in paginationNumbers" :key="index"
                    @click="page !== '...' ? goToPage(page) : null" :class="{
                      'pagination-number': page !== '...',
                      'pagination-dots': page === '...',
                      'active': page === currentPage
                    }" :disabled="page === '...'">
                    {{ page }}
                  </button>
                </div>

                <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-nav-button">
                  ›
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="searchQuery && filteredActiveOrders.length === 0" class="empty-state">
            <PackageIcon class="empty-icon" />
            <h3>No se encontraron pedidos</h3>
            <p>No hay pedidos que coincidan con tu búsqueda</p>
            <button @click="clearFilters" class="shop-button">Limpiar filtros</button>
          </div>

          <div v-else class="empty-state">
            <PackageIcon class="empty-icon" />
            <h3>No tienes pedidos activos</h3>
            <p>Explora nuestra tienda y realiza tu primer pedido</p>
            <router-link to="/Products" class="shop-button">Ir a la tienda</router-link>
          </div>
        </div>

        <!-- Pedidos Finalizados -->
        <div v-if="activeOrdersTab === 'completed'">
          <div v-if="paginatedCompletedOrders.length > 0" class="orders-list">
            <div v-for="order in paginatedCompletedOrders" :key="order.id" class="order-card">
              <!-- El contenido del order-card permanece igual -->
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
                    <div class="product-total">Total: {{ product.total }}</div>
                    <div class="product-total-pagado">Total pagado: {{ product.totalPagado }}</div>
                  </div>
                </div>
              </div>

              <div class="order-footer">
                <div class="order-total">
                  <span>Total:</span>
                  <span class="total-amount">{{ order.total }}</span>
                  <div class="total-amount-bs">
                    <span>Monto pagado:</span>
                    <span>{{ order.totalBs }}</span>
                  </div>
                </div>
                <div class="button-container">
                  <button v-if="order.Pagos && order.Pagos[0] && order.Pagos[0].comprobante_img"
                    class="comprobante-button" @click="openComprobantePopup(order)" style="margin-right: 10px;">
                    <EyeIcon class="icon" /> Comprobante
                  </button>
                  <button class="details-button" @click="openPDFPopup(order.id)">Ver detalles</button>
                </div>
              </div>
            </div>

            <!-- Controles de paginación -->
            <div v-if="totalPages > 1" class="pagination">
              <div class="pagination-controls">
                <button @click="prevPage" :disabled="currentPage === 1" class="pagination-nav-button">
                  ‹ Anterior
                </button>

                <div class="pagination-numbers">
                  <button v-for="(page, index) in paginationNumbers" :key="index"
                    @click="page !== '...' ? goToPage(page) : null" :class="{
                      'pagination-number': page !== '...',
                      'pagination-dots': page === '...',
                      'active': page === currentPage
                    }" :disabled="page === '...'">
                    {{ page }}
                  </button>
                </div>

                <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-nav-button">
                  Siguiente ›
                </button>
              </div>

              <div class="pagination-info">
                Mostrando {{ ((currentPage - 1) * itemsPerPage) + 1 }} -
                {{ Math.min(currentPage * itemsPerPage, activeOrdersTab === 'active' ? filteredActiveOrders.length :
                  filteredCompletedOrders.length) }}
                de {{ activeOrdersTab === 'active' ? filteredActiveOrders.length : filteredCompletedOrders.length }}
                pedidos
              </div>
            </div>
          </div>

          <div v-else-if="searchQuery && filteredCompletedOrders.length === 0" class="empty-state">
            <PackageIcon class="empty-icon" />
            <h3>No se encontraron pedidos</h3>
            <p>No hay pedidos finalizados que coincidan con tu búsqueda</p>
            <button @click="clearFilters" class="shop-button">Limpiar filtros</button>
          </div>

          <div v-else class="empty-state">
            <PackageIcon class="empty-icon" />
            <h3>No tienes pedidos finalizados</h3>
            <p>Tus pedidos completados aparecerán aquí</p>
          </div>
        </div>

        <!-- Pedidos Cancelados -->
        <div v-if="activeOrdersTab === 'cancelled'">
          <div v-if="cancelledOrders.length > 0" class="orders-list">
            <div v-for="order in cancelledOrders" :key="order.id" class="order-card">
              <!-- ...igual que los otros order-card... -->
              <div class="order-header">
                <div class="order-info">
                  <div class="order-number">Pedido #{{ order.number }}</div>
                  <div class="order-date">{{ order.date }}</div>
                </div>
                <div class="order-status cancelled">Cancelada</div>
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
                    <div class="product-total">Total: {{ product.total }}</div>
                    <div class="product-total-pagado">Total pagado: {{ product.totalPagado }}</div>
                  </div>
                </div>
              </div>
              <div v-if="getCancelReason(order.id)" class="cancel-reason">
                <strong>Motivo de cancelación:</strong>
                {{ getCancelReason(order.id) }}
              </div>
              <div class="order-footer">
                <div class="order-total">
                  <span>Total:</span>
                  <span class="total-amount">{{ order.total }}</span>
                  <div class="total-amount-bs">
                    <span>Monto pagado:</span>
                    <span class="total-amount">{{ order.totalBs }}</span>
                  </div>
                </div>
                <div class="button-container">
                  <button v-if="order.Pagos && order.Pagos[0] && order.Pagos[0].comprobante_img"
                    class="comprobante-button" @click="openComprobantePopup(order)" style="margin-right: 10px;">
                    <EyeIcon class="icon" /> Comprobante
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <PackageIcon class="empty-icon" />
            <h3>No tienes pedidos cancelados</h3>
            <p>Tus pedidos cancelados aparecerán aquí</p>
          </div>
        </div>
      </div>

      <!-- Sección de Notificaciones -->
      <div v-if="activeSection === 'notifications'" class="content-section">
        <h2 class="section-title">Mis Notificaciones</h2>

        <div v-if="isLoadingNotifications" class="loading-state">
          <LoaderIcon class="spinner" />
          <p>Cargando notificaciones...</p>
        </div>

        <div v-else-if="notifications && notifications.length > 0" class="notifications-list">
          <div v-for="notification in notifications" :key="notification.id" class="notification-card"
            :class="{ 'unread': !notification.leida }">
            <div class="notification-header">
              <h3 class="notification-title">{{ notification.titulo }}</h3>
              <span class="notification-date">{{ formatDate(notification.created_at) }}</span>
            </div>
            <div class="notification-body">
              <p>{{ notification.mensaje }}</p>
              <div v-if="notification.Orden" class="notification-order-info">
                <span class="order-label">Orden #{{ notification.Orden.id.toString().padStart(6, "0") }}</span>
                <span class="order-status" :class="notification.Orden.status.toLowerCase()">
                  {{ notification.Orden.status }}
                </span>
                <span class="order-amount">${{ notification.Orden.monto_total }}</span>
              </div>
            </div>
            <div class="notification-actions">
              <button v-if="!notification.leida" @click="markAsRead(notification.id)" class="read-button">
                Marcar como leída
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <BellIcon class="empty-icon" />
          <h3>No tienes notificaciones</h3>
          <p>Las notificaciones sobre tus pedidos y ofertas aparecerán aquí</p>
        </div>
      </div>

      <!-- Sección de Perfil -->
      <div v-if="activeSection === 'profile'" class="content-section">
        <h2 class="section-title">Mi Perfil</h2>

        <form @submit.prevent="updateProfile" class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label for="profileName">Nombre</label>
              <input type="text" id="profileName" v-model="profileForm.name" placeholder="Tu nombre" />
            </div>
          </div>

          <div class="form-group">
            <label for="profileEmail">Email</label>
            <input type="email" id="profileEmail" v-model="profileForm.email" placeholder="Tu email" disabled />
          </div>

          <div class="form-group">
            <label for="profilePhone">Teléfono</label>
            <input type="tel" id="profilePhone" v-model="profileForm.phone" placeholder="Tu teléfono" />
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
              <input type="password" id="currentPassword" v-model="passwordForm.current"
                placeholder="Tu contraseña actual" />
            </div>

            <div class="form-group">
              <label for="newPassword">Nueva contraseña</label>
              <input type="password" id="newPassword" v-model="passwordForm.new" placeholder="Tu nueva contraseña" />
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirmar contraseña</label>
              <input type="password" id="confirmPassword" v-model="passwordForm.confirm"
                placeholder="Confirma tu nueva contraseña" />
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
  <Footer />

  <!-- PDF Popup -->
  <div v-if="showPDFPopup" class="pdf-popup-overlay" @click="showPDFPopup = false">
    <div class="pdf-popup-content" @click.stop>
      <button class="close-button" @click="showPDFPopup = false">&times;</button>
      <PDF class="related-products" :ordenId="selectedOrderId" :order="selectedOrder" />
    </div>
  </div>

  <!-- Popup para comprobante -->
  <div v-if="showComprobantePopup" class="pdf-popup-overlay" @click="showComprobantePopup = false">
    <div class="pdf-popup-content" @click.stop>
      <button class="close-button" @click="showComprobantePopup = false">&times;</button>
      <img :src="comprobanteImgUrl" alt="Comprobante de pago"
        style="max-width:100%;max-height:70vh;display:block;margin:auto;" />
    </div>
  </div>

  <!-- Modal para cambiar estado de orden (solo admin) -->
  <div v-if="showChangeStatusModal" class="change-status-overlay" @click="showChangeStatusModal = false">
    <div class="change-status-modal" @click.stop>
      <button class="close-button" @click="showChangeStatusModal = false">&times;</button>
      <h3 class="modal-title">Cambiar estado de la orden</h3>
      <form @submit.prevent="changeOrderStatus">
        <div class="form-group">
          <label>Nuevo estado:</label>
          <select v-model="newStatus" class="modal-select">
            <option value="Completa">Completa</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        <div class="form-group" v-if="newStatus === 'Cancelada'">
          <label>Motivo de cancelación:</label>
          <textarea v-model="motivoCancelacion" rows="2" class="modal-textarea"
            placeholder="Motivo de la cancelación"></textarea>
        </div>
        <div class="form-group">
          <label>Contraseña de administrador:</label>
          <input type="password" v-model="adminPassword" class="modal-input" placeholder="Tu contraseña" />
        </div>
        <button class="modal-save-button" :disabled="isChangingStatus">
          <LoaderIcon v-if="isChangingStatus" class="spinner" />
          <span v-else>Confirmar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script src="./User.js"></script>
<style scoped src="./User.scss" lang="scss"></style>
