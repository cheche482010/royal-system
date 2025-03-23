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
                <div class="header__shipping">
                    <TruckIcon class="shipping-icon" />
                    <span>Envíos</span>
                </div>
                <router-link to="/user" class="action-item">
                    <UserIcon />
                </router-link>
                <router-link to="/cart" class="action-item cart">
                    <ShoppingCartIcon />
                    <span class="cart-count">{{ cartCount }}</span>
                </router-link>
                <router-link to="/login" class="action-item">
                    <LogInIcon />
                </router-link>
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