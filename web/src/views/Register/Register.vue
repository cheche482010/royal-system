<template>
    <div class="register-container">
      <div class="register-content">
        <!-- Lado izquierdo - Formulario -->
        <div class="register-form-container">
          <div class="register-header">
            <h1 class="register-title">Bienvenido a Royal Shop</h1>
            <p class="register-subtitle">Complete sus datos para registrarse</p>
          </div>
  
          <div class="register-steps">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              :class="['step-indicator', { 'active': currentStep === index, 'completed': currentStep > index }]"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-name">{{ step.name }}</div>
            </div>
          </div>
  
          <form @submit.prevent="handleSubmit" class="register-form">
            <!-- Paso 1: Datos Personales -->
            <div v-if="currentStep === 0" class="form-step">
              <div class="form-group">
                <label for="nombre">Nombre Completo</label>
                <input 
                  type="text" 
                  id="nombre" 
                  v-model="formData.nombre" 
                  placeholder="Ingrese su nombre completo" 
                  required 
                />
              </div>
  
              <div class="form-group">
                <label for="documento">Documento (RIF/Cédula)</label>
                <input 
                  type="text" 
                  id="documento" 
                  v-model="formData.documento" 
                  placeholder="Ingrese su RIF o Cédula" 
                  required 
                />
              </div>
  
              <div class="form-group">
                <label for="user_password">Contraseña</label>
                <div class="password-input">
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    id="user_password" 
                    v-model="password" 
                    placeholder="Crea una contraseña" 
                    required 
                  />
                  <button type="button" class="toggle-password" @click="togglePassword">
                    <EyeIcon v-if="!showPassword" />
                    <EyeOffIcon v-else />
                  </button>
                </div>
                <div class="password-strength" v-if="password">
                  <div class="strength-bar">
                    <div 
                      class="strength-progress" 
                      :style="{ width: `${passwordStrength * 25}%` }" 
                      :class="strengthClass"
                    ></div>
                  </div>
                  <span class="strength-text" :class="strengthClass">{{ strengthText }}</span>
                </div>
              </div>
            </div>
  
            <!-- Paso 2: Contacto y Dirección -->
            <div v-if="currentStep === 1" class="form-step">
              <div class="form-group">
                <label for="telefono">Teléfono</label>
                <input 
                  type="tel" 
                  id="telefono" 
                  v-model="formData.telefono" 
                  placeholder="Número de teléfono" 
                  required 
                />
              </div>
  
              <div class="form-group">
                <label for="correo">Correo Electrónico</label>
                <input 
                  type="email" 
                  id="correo" 
                  v-model="formData.correo" 
                  placeholder="Correo electrónico" 
                  required 
                />
              </div>
              
              <div class="form-group">
                <label for="direccion">Dirección</label>
                <textarea 
                  id="direccion" 
                  v-model="formData.direccion" 
                  placeholder="Dirección completa" 
                  required
                  rows="3"
                  class="form-textarea"
                ></textarea>
              </div>
            </div>
  
            <!-- Paso 3: Documentos -->
            <div v-if="currentStep === 2" class="form-step">
              <div class="form-group">
                <label for="documento_img">Documento RIF/Cédula (Imagen)</label>
                <div class="file-upload">
                  <input 
                    type="file" 
                    id="documento_img" 
                    @change="handleFileUpload('documento_img', $event)" 
                    class="file-input"
                    accept="image/*" 
                  />
                  <div class="upload-button">
                    <UploadIcon class="upload-icon" />
                    <span>{{ documentoImgSelected ? 'Archivo seleccionado' : 'Subir imagen del documento' }}</span>
                  </div>
                </div>
                <div v-if="documentoImgSelected" class="file-preview">
                  <div class="file-info">
                    <FileIcon class="file-icon" />
                    <span class="file-name">{{ documentoImgName }}</span>
                  </div>
                  <button type="button" class="remove-file" @click="removeFile('documento_img')">
                    <XIcon class="remove-icon" />
                  </button>
                </div>
                <div v-if="documentoImgPreview" class="image-preview">
                  <img :src="documentoImgPreview" alt="Vista previa del documento" />
                </div>
              </div>
  
              <div class="form-group">
                <label for="registro_mercantil_img">Registro Mercantil (Imagen)</label>
                <div class="file-upload">
                  <input 
                    type="file" 
                    id="registro_mercantil_img" 
                    @change="handleFileUpload('registro_mercantil_img', $event)" 
                    class="file-input"
                    accept="image/*" 
                  />
                  <div class="upload-button">
                    <UploadIcon class="upload-icon" />
                    <span>{{ registroMercantilImgSelected ? 'Archivo seleccionado' : 'Subir imagen del Registro Mercantil' }}</span>
                  </div>
                </div>
                <div v-if="registroMercantilImgSelected" class="file-preview">
                  <div class="file-info">
                    <FileIcon class="file-icon" />
                    <span class="file-name">{{ registroMercantilImgName }}</span>
                  </div>
                  <button type="button" class="remove-file" @click="removeFile('registro_mercantil_img')">
                    <XIcon class="remove-icon" />
                  </button>
                </div>
                <div v-if="registroMercantilImgPreview" class="image-preview">
                  <img :src="registroMercantilImgPreview" alt="Vista previa del Registro Mercantil" />
                </div>
              </div>
  
              <div class="form-group checkbox">
                <input type="checkbox" id="terms" v-model="acceptTerms" required />
                <label for="terms">
                  Acepto los <a href="/terms" target="_blank">Términos y Condiciones</a> y la 
                  <a href="/privacy" target="_blank">Política de Privacidad</a>
                </label>
              </div>
            </div>
  
            <div class="form-feedback" v-if="errorMessage">
              <div class="error-message">{{ errorMessage }}</div>
            </div>
  
            <div class="form-feedback" v-if="successMessage">
              <div class="success-message">{{ successMessage }}</div>
            </div>
  
            <div class="form-navigation">
              <button 
                type="button" 
                class="back-button" 
                v-if="currentStep > 0" 
                @click="prevStep"
              >
                Anterior
              </button>
              
              <button 
                v-if="currentStep < steps.length - 1" 
                type="button" 
                class="next-button" 
                @click="nextStep"
              >
                Siguiente
              </button>
              
              <button 
                v-if="currentStep === steps.length - 1" 
                type="submit" 
                class="register-button" 
                :disabled="isLoading || !acceptTerms"
              >
                <LoaderIcon v-if="isLoading" class="spinner" />
                <span v-else>Completar Registro</span>
              </button>
            </div>
          </form>
  
          <div class="login-link">
            ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
          </div>
        </div>
  
        <!-- Lado derecho - Logo e imagen -->
        <div class="register-logo-container">
          <div class="logo-circle">
            <div class="logo-content">
                <img :src="logo.image" :alt="logo.name" class="logo-img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script src="./Register.js"></script>
  <style scoped src="./Register.scss" lang="scss"></style>