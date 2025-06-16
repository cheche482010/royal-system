<template>
    <header class="header">
        <div class="header__container">
            <div class="header__logo">
                <router-link to="/">
                    <img :src="ASSETS.image" :alt="ASSETS.name" class="logo-img" />
                </router-link>
            </div>

            <div class="header__search">
                <input type="text" v-model="searchQuery" @input="searchProducts" @focus="showSearchResults = true"
                    placeholder="¿Qué es lo que buscas?" class="search-input" />
                <button class="search-button" @click="navigateToSearchPage">
                    <SearchIcon class="search-icon" />
                </button>

                <div v-if="showSearchResults && searchResults.length > 0" class="search-results">
                    <div class="search-results-container">
                        <div v-for="product in searchResults.slice(0, 5)" :key="product.id" class="search-result-item"
                            @click="navigateTo(`/productdetails?id=${product.id}`)">
                            <img :src="`${API_BASE_URL}${product.producto_img || '/placeholder-product.png'}`"
                                :alt="product.nombre" class="result-image" />
                            <div class="result-details">
                                <h4>{{ product.nombre }}</h4>
                                <p class="price">{{ formatPrice(product.precio_unidad) }}</p>
                            </div>
                        </div>
                    </div>
                    <button v-if="searchResults.length > 5" class="view-all-btn" @click="navigateToSearchPage">
                        Ver todos los resultados ({{ searchResults.length }})
                    </button>
                </div>
            </div>

            <div class="header__actions">
                <!-- Dolar -->
                <div class="action-item dollar-rate-container" v-if="dollarRate"
                    @click.stop="isAuthenticated && !showDollarMenu && (showDollarMenu = true)">
                    <span class="dollar-rate">
                        $ BCV: {{ dollarRate }}
                    </span>

                    <!-- Dollar rate menu for admin/customer -->
                    <div v-if="isAuthenticated && showDollarMenu" class="dollar-menu" @click.stop>
                        <div v-if="!showDollarInput" class="dollar-menu-item" @click="startAddingNewRate">
                            <span>Agregar nueva tasa</span>
                        </div>

                        <div v-else class="dollar-input-container">
                            <input v-model="dollarInputValue" type="number" step="0.01" min="0"
                                placeholder="Ingrese nueva tasa" class="dollar-input" @click.stop
                                @keyup.enter="addNewDollarRate">
                            <button class="dollar-save-btn" @click.stop="addNewDollarRate">
                                Guardar
                            </button>
                        </div>

                        <div class="dollar-source">
                            Fuente: {{ dollarSource }} - {{ dollarLastUpdated?.toLocaleDateString() }}
                        </div>
                    </div>
                </div>
                <!-- Notificaciones -->
                <div v-if="isAuthenticated" class="action-item notification-container">
                    <button class="notification-icon" @click.stop="showNotifications = !showNotifications">
                        <BellIcon />
                        <span v-if="unreadNotifications > 0" class="notification-badge">{{ unreadNotifications }}</span>
                    </button>

                    <!-- Menú desplegable de notificaciones -->
                    <div v-if="showNotifications" class="notification-menu">
                        <div class="notification-header">
                            <h3>Notificaciones</h3>
                            <button v-if="unreadNotifications > 0" @click="markAllAsRead" class="mark-all-read">
                                Marcar todas como leídas
                            </button>
                        </div>

                        <div class="notification-list">
                            <div v-for="notification in notifications" :key="notification.id" class="notification-item"
                                :class="{ 'unread': !notification.read }" @click="markAsRead(notification.id)">
                                <div class="notification-content">
                                    <h4>{{ notification.title }}</h4>
                                    <p>{{ notification.message }}</p>
                                    <div v-if="notification.orden" class="notification-order-info">
                                        <span class="order-status" :class="notification.orden.status.toLowerCase()">
                                            {{ notification.orden.status }}
                                        </span>
                                        <span class="order-amount">{{ formatPrice(notification.orden.monto_total) }}</span>
                                    </div>
                                    <span class="notification-date">{{ formatDate(notification.date) }}</span>
                                </div>
                            </div>

                            <div v-if="notifications.length === 0" class="no-notifications">
                                No tienes notificaciones
                            </div>
                        </div>

                        <div class="notification-footer">
                            <a href="#" @click.prevent="navigateTo('/user/notifications'); showNotifications = false">
                                Ver todas las notificaciones
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Carrito -->
                <router-link v-if="isAuthenticated" to="/cart" class="action-item cart">
                    <ShoppingCartIcon />
                    <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
                </router-link>

                <!-- Usuario autenticado -->
                <div v-if="isAuthenticated" class="action-item user-container">
                    <button class="user-info" @click.stop="showUserMenu = !showUserMenu">
                        <UserIcon />
                        <span class="user-name">{{ userName }}</span>
                        <ChevronDown />
                    </button>

                    <!-- Menú desplegable de usuario -->
                    <div v-if="showUserMenu" class="user-menu">
                        <div class="user-menu-item" @click="navigateTo('/user/profile')">
                            <UserIcon size="16" />
                            <span>Mi Perfil</span>
                        </div>
                        <div class="user-menu-item" @click="navigateTo('/user/orders')">
                            <PackageIcon size="16" />
                            <span>Mis Pedidos</span>
                        </div>
                        <div class="user-menu-divider"></div>
                        <div class="user-menu-item logout" @click="logout">
                            <LogOutIcon size="16" />
                            <span>Cerrar Sesión</span>
                        </div>
                    </div>
                </div>

                <!-- Usuario no autenticado -->
                <div v-else class="auth-buttons">
                    <router-link to="/login" class="btn btn-login">
                        <span>Ingresar</span>
                    </router-link>
                    <router-link to="/register" class="btn btn-register">
                        <span>Registrarse</span>
                    </router-link>
                </div>
            </div>
        </div>

        <nav class="header__nav" v-if="!disableNav">
            <ul class="nav-list">
                <li v-for="category in categories" :key="category.id" class="nav-item">
                    <router-link :to="`/category/${category.id}`" class="nav-link">
                        {{ category.name }}
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/Products" class="nav-link">
                        Productos
                    </router-link>
                </li>
                <li class="nav-item brands">
                    <router-link to="/brands" class="nav-link">
                        <TagIcon class="brand-icon" />
                        Marcas
                    </router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style scoped src="./Header.scss" lang="scss"></style>
<script src="./Header.js"></script>