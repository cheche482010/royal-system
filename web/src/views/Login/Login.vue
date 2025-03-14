<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">Iniciar sesión</h1>
        <p class="login-subtitle">Accede a tu cuenta para gestionar tus pedidos</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="Introduce tu email" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="password" 
              placeholder="Introduce tu contraseña" 
              required
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="togglePassword"
            >
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
          <a href="/forgot-password" class="forgot-password">¿Olvidaste tu contraseña?</a>
        </div>
        
        <button type="submit" class="login-button" :disabled="isLoading">
          <LoaderIcon v-if="isLoading" class="spinner" />
          <span v-else>Iniciar sesión</span>
        </button>
      </form>
      
      <div class="login-divider">
        <span>o</span>
      </div>
      
      <div class="social-login">
        <button class="social-button google">
          <img src="https://cdn-icons-png.flaticon.com/512/2504/2504739.png?height=20&width=20" alt="Google" />
          Continuar con Google
        </button>
      </div>
      
      <div class="register-link">
        ¿No tienes cuenta? <router-link to="/register">Regístrate</router-link>
      </div>
    </div>
  </div>
</template>

<script src="./Login.js"></script>
<style scoped src="./Login.scss" lang="scss"></style>