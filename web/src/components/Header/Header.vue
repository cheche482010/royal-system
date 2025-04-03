<template>
    <header class="header">
        <div class="header__container">
            <div class="header__logo">
                <router-link to="/">
                    <img :src="logo.image" :alt="logo.name" class="logo-img" />
                </router-link>
            </div>

            <div class="header__search">
                <input type="text" placeholder="¿Qué es lo que buscas?" class="search-input" />
                <button class="search-button">
                    <SearchIcon class="search-icon" />
                </button>
            </div>

            <div class="header__actions">
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
                                    <span class="notification-date">{{ formatDate(notification.date) }}</span>
                                </div>
                            </div>

                            <div v-if="notifications.length === 0" class="no-notifications">
                                No tienes notificaciones
                            </div>
                        </div>

                        <div class="notification-footer">
                            <router-link to="/notifications" @click="showNotifications = false">
                                Ver todas las notificaciones
                            </router-link>
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
                        <div class="user-menu-item" @click="navigateTo('/user')">
                            <UserIcon size="16" />
                            <span>Mi Perfil</span>
                        </div>
                        <div class="user-menu-item" @click="navigateTo('/orders')">
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