<template>
    <div class="register-container">
        <div class="register-card">
            <div class="register-header">
                <h1 class="register-title">Crear cuenta</h1>
                <p class="register-subtitle">Regístrate para disfrutar de todas las ventajas</p>
            </div>

            <form @submit.prevent="handleRegister" class="register-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">Nombre</label>
                        <input type="text" id="firstName" v-model="firstName" placeholder="Tu nombre" required />
                    </div>

                    <div class="form-group">
                        <label for="lastName">Apellidos</label>
                        <input type="text" id="lastName" v-model="lastName" placeholder="Tus apellidos" required />
                    </div>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" placeholder="Tu email" required />
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <div class="password-input">
                        <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                            placeholder="Crea una contraseña" required />
                        <button type="button" class="toggle-password" @click="togglePassword">
                            <EyeIcon v-if="!showPassword" />
                            <EyeOffIcon v-else />
                        </button>
                    </div>
                    <div class="password-strength" v-if="password">
                        <div class="strength-bar">
                            <div class="strength-progress" :style="{ width: `${passwordStrength * 25}%` }"
                                :class="strengthClass"></div>
                        </div>
                        <span class="strength-text" :class="strengthClass">{{ strengthText }}</span>
                    </div>
                </div>

                <div class="form-group checkbox">
                    <input type="checkbox" id="terms" v-model="acceptTerms" required />
                    <label for="terms">
                        Acepto los <a href="/terms" target="_blank">Términos y Condiciones</a> y la <a href="/privacy"
                            target="_blank">Política de Privacidad</a>
                    </label>
                </div>

                <div class="form-group checkbox">
                    <input type="checkbox" id="newsletter" v-model="subscribeNewsletter" />
                    <label for="newsletter">
                        Quiero recibir ofertas y novedades por email
                    </label>
                </div>

                <button type="submit" class="register-button" :disabled="isLoading || !acceptTerms">
                    <LoaderIcon v-if="isLoading" class="spinner" />
                    <span v-else>Crear cuenta</span>
                </button>
            </form>

            <div class="login-divider">
                <span>o</span>
            </div>

            <div class="social-login">
                <button class="social-button google">
                    <img src="https://cdn-icons-png.flaticon.com/512/2504/2504739.png?height=20&width=20" alt="Google" />
                    Registrarse con Google
                </button>
            </div>

            <div class="login-link">
                ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
            </div>
        </div>
    </div>
</template>

<script src="./Register.js"></script>
<style scoped src="./Register.scss" lang="scss"></style>