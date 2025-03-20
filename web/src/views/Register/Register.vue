<template>
    <div class="register-container">
        <div class="register-card">
            <div class="register-header">
                <h1 class="register-title">Registro de Usuario</h1>
                <p class="register-subtitle">Complete sus datos para registrarse</p>
            </div>

            <form @submit.prevent="handleRegister" class="register-form">
                <div class="form-group">
                    <label for="rif_cedula">RIF/Cédula</label>
                    <input type="text" id="rif_cedula" v-model="formData.rif_cedula"
                        placeholder="Ingrese su RIF o Cédula" required />
                </div>

                <div class="form-group">
                    <label for="documento_rif">Documento RIF (Imagen)</label>
                    <div class="file-upload">
                        <input type="file" id="documento_rif" @change="handleFileUpload('documento_rif', $event)"
                            class="file-input" accept="image/*" />
                        <div class="upload-button">
                            <UploadIcon class="upload-icon" />
                            <span>{{ rifFileSelected ? 'Archivo seleccionado' : 'Subir imagen del RIF' }}</span>
                        </div>
                    </div>
                    <div v-if="rifFileSelected" class="file-preview">
                        <div class="file-info">
                            <FileIcon class="file-icon" />
                            <span class="file-name">{{ rifFileName }}</span>
                        </div>
                        <button type="button" class="remove-file" @click="removeFile('documento_rif')">
                            <XIcon class="remove-icon" />
                        </button>
                    </div>
                    <div v-if="rifFilePreview" class="image-preview">
                        <img :src="rifFilePreview" alt="Vista previa del RIF" />
                    </div>
                </div>

                <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <input type="text" id="nombre" v-model="formData.nombre" placeholder="Nombre completo" required />
                </div>

                <div class="form-group">
                    <label for="direccion">Dirección</label>
                    <textarea id="direccion" v-model="formData.direccion" placeholder="Dirección completa" required
                        rows="3" class="form-textarea"></textarea>
                </div>

                <div class="form-group">
                    <label for="registro_mercantil">Registro Mercantil (Imagen)</label>
                    <div class="file-upload">
                        <input type="file" id="registro_mercantil"
                            @change="handleFileUpload('registro_mercantil', $event)" class="file-input"
                            accept="image/*" />
                        <div class="upload-button">
                            <UploadIcon class="upload-icon" />
                            <span>{{ registroFileSelected ? 'Archivo seleccionado' : 'Subir imagen del Registro Mercantil' }}</span>
                        </div>
                    </div>
                    <div v-if="registroFileSelected" class="file-preview">
                        <div class="file-info">
                            <FileIcon class="file-icon" />
                            <span class="file-name">{{ registroFileName }}</span>
                        </div>
                        <button type="button" class="remove-file" @click="removeFile('registro_mercantil')">
                            <XIcon class="remove-icon" />
                        </button>
                    </div>
                    <div v-if="registroFilePreview" class="image-preview">
                        <img :src="registroFilePreview" alt="Vista previa del Registro Mercantil" />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="correo">Correo Electrónico</label>
                        <input type="email" id="correo" v-model="formData.correo" placeholder="Correo electrónico"
                            required />
                    </div>

                    <div class="form-group">
                        <label for="telefono">Teléfono</label>
                        <input type="tel" id="telefono" v-model="formData.telefono" placeholder="Número de teléfono"
                            required />
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
                        Acepto los <a href="/terms" target="_blank">Términos y Condiciones</a> y la
                        <a href="/privacy" target="_blank">Política de Privacidad</a>
                    </label>
                </div>

                <div class="form-feedback" v-if="errorMessage">
                    <div class="error-message">{{ errorMessage }}</div>
                </div>

                <div class="form-feedback" v-if="successMessage">
                    <div class="success-message">{{ successMessage }}</div>
                </div>

                <button type="submit" class="register-button" :disabled="isLoading || !acceptTerms">
                    <LoaderIcon v-if="isLoading" class="spinner" />
                    <span v-else>Registrarse</span>
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