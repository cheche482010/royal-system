<template>
    <div class="register-container">
        <div class="register-card">
            <div class="register-header">
                <h1 class="register-title">Crear cuenta</h1>
                <p class="register-subtitle">Regístrate para disfrutar de todas las ventajas</p>
            </div>

            <form @submit.prevent="handleRegister" class="register-form">
                <div class="form-group">
                    <label for="firstName">Nombre</label>
                    <input type="text" id="firstName" v-model="firstName" placeholder="Nombre" required />
                </div>

                <div class="form-group">
                    <label for="address">Direccion</label>
                    <input type="text" id="address" v-model="firstName" placeholder="Direccion" required />
                </div>

                <div class="form-group">
                    <label for="email">Correo</label>
                    <input type="email" id="email" v-model="email" placeholder="Correo" required />
                </div>

                <div class="form-group">
                    <label for="phone">Telefono</label>
                    <input type="phone" id="phone" v-model="phone" placeholder="Telefono" required />
                </div>

                <div class="form-group">
                    <label for="registroM">Registro Mercantil</label>
                    <div class="file-upload">
                        <input type="file" id="registroM" @change="handleFileUpload" class="file-input"
                            accept="image/*" />
                        <div class="upload-button">
                            <UploadIcon class="upload-icon" />
                            <span>{{ fileSelected ? 'Archivo seleccionado' : 'Subir Registro Mercantil' }}</span>
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

            <div class="login-link">
                ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
            </div>
        </div>
    </div>
</template>

<script src="./Register.js"></script>
<style scoped src="./Register.scss" lang="scss"></style>