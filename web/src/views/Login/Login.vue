<template>
  <div class="login-container">
    <div class="login-content">
      <!-- Lado izquierdo - Formulario -->
      <div class="login-form-container">
        <div class="login-header">
          <h1 class="login-title">Bienvenido a Royal Shop</h1>
          <p class="login-subtitle">Accede a tu cuenta para gestionar tus pedidos</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="documento">Documento (RIF/Cédula)</label>
            <input type="text" id="documento" v-model="documento" placeholder="Introduce tu RIF o Cédula" required />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="password-input">
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                placeholder="Introduce tu contraseña" required />
              <button type="button" class="toggle-password" @click="togglePassword">
                <EyeIcon v-if="!showPassword" />
                <EyeOffIcon v-else />
              </button>
            </div>
          </div>

          <div class="form-options">
            <div class="remember-me">
              <input type="checkbox" id="remember" v-model="rememberMe" />
              <label for="remember">Recordarme</label>
            </div>
            <router-link to="/forgot-password" class="forgot-password">¿Olvidaste tu contraseña?</router-link>
          </div>

          <div class="form-feedback" v-if="errorMessage">
            <div class="error-message">{{ errorMessage }}</div>
          </div>

          <button type="submit" class="login-button" :disabled="isLoading">
            <LoaderIcon v-if="isLoading" class="spinner" />
            <span v-else>Iniciar sesión</span>
          </button>
        </form>

        <div class="register-link">
          ¿No tienes cuenta? <router-link to="/register">Regístrate</router-link>
        </div>
      </div>

      <!-- Lado derecho - Logo e imagen -->
      <div class="login-logo-container">
        <div class="logo-circle">
          <div class="logo-content">
            <img :src="logo.image" :alt="logo.name" class="logo-img" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./Login.js"></script>
<style scoped src="./Login.scss" lang="scss"></style>