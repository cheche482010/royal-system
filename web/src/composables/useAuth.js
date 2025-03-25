import { ref, computed, readonly, inject, provide } from 'vue'

// Clave para provide/inject
const AUTH_KEY = 'auth'

// Crear el estado global de autenticación
export function createAuth() {
  // Estado
  const user = ref(null)
  const sessionToken = ref(null)
  const userToken = ref(null)
  const isActive = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!sessionToken.value)
  const userRole = computed(() => user.value?.role || null)
  const userName = computed(() => user.value?.nombre || '')
  const userId = computed(() => user.value?.id || null)

  // Acciones
  function setUser(userData) {
    user.value = {
      id: userData.id,
      documento: userData.documento,
      nombre: userData.nombre,
      role: userData.role
    }
    userToken.value = userData.user_token
    
    if (userData.session) {
      sessionToken.value = userData.session.session_token
      isActive.value = userData.session.is_active
    }

    // Guardar en localStorage para persistencia
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('user_token', userToken.value)
    
    if (userData.session) {
      localStorage.setItem('session_token', sessionToken.value)
      localStorage.setItem('session_active', isActive.value)
    }
  }

  function clearUser() {
    user.value = null
    sessionToken.value = null
    userToken.value = null
    isActive.value = false

    // Limpiar localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('user_token')
    localStorage.removeItem('session_token')
    localStorage.removeItem('session_active')
  }

  // Inicializar estado desde localStorage (para persistencia)
  function initializeFromStorage() {
    const storedUser = localStorage.getItem('user')
    const storedUserToken = localStorage.getItem('user_token')
    const storedSessionToken = localStorage.getItem('session_token')
    const storedSessionActive = localStorage.getItem('session_active')

    if (storedUser && storedSessionToken) {
      user.value = JSON.parse(storedUser)
      userToken.value = storedUserToken
      sessionToken.value = storedSessionToken
      isActive.value = storedSessionActive === 'true'
    }
  }

  // Inicializar al crear el composable
  initializeFromStorage()

  // Objeto de autenticación
  const auth = {
    // Estado (readonly para evitar modificaciones directas)
    user: readonly(user),
    sessionToken: readonly(sessionToken),
    userToken: readonly(userToken),
    isActive: readonly(isActive),
    
    // Getters
    isAuthenticated,
    userRole,
    userName,
    userId,
    
    // Acciones
    setUser,
    clearUser,
    initializeFromStorage
  }

  // Proporcionar el objeto de autenticación a la aplicación
  provide(AUTH_KEY, auth)

  return auth
}

// Hook para usar el estado de autenticación en componentes
export function useAuth() {
  const auth = inject(AUTH_KEY)
  
  if (!auth) {
    throw new Error('useAuth() debe ser usado dentro de un componente que tenga acceso al proveedor de autenticación')
  }
  
  return auth
}