"use client"

import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import Header from "../../components/Header/Header.vue"
import Footer from "../../components/Footer/Footer.vue"
import { apiService } from "../../services/api.service"
import { useCartService } from "../../services/cart.service"
import { config } from "../../config/config"
import { useToast } from "../../services/toast.service"
import { useCouponService } from "../../services/coupon.service"
import { usePaymentService } from "../../services/payment.service"
import { useDolarStore } from "../../stores/dolar"
import { useAuth } from "../../composables/useAuth"

import { UploadIcon, FileIcon, XIcon, LockIcon } from "lucide-vue-next"

export default {
  name: "Payment",
  components: {
    Header,
    Footer,
    UploadIcon,
    FileIcon,
    XIcon,
    LockIcon,
  },
  props: {
    API_BASE_URL: {
      type: String,
      default: config.API_BASE_URL,
    },
  },
  setup(props) {
    const router = useRouter()
    const cartService = useCartService()
    const toast = useToast()
    const couponService = useCouponService()
    const paymentService = usePaymentService()
    const checkoutData = ref(null)
    const dolarStore = useDolarStore()
    const dollarRate = computed(() => dolarStore.dollarRate)
    const auth = useAuth()

    // Funciones de autenticación
    const getToken = () => {
      return auth.userToken.value
    }

    const getUserId = () => {
      return auth.userId.value
    }

    // Datos bancarios
    const bankData = {
      cuenta: {
        nombre: "ROYAL PET C.A",
        banco: "BANESCO",
        cuenta: "0134-0416-05-4161028192",
        tipoCuenta: "Corriente",
        rif: "J403113661",
      },
      pagoMovil: {
        banco: "BANESCO",
        rif: "J403113661",
        telefono: "0414-5044409",
      },
    }

    // Tab activo
    const activeTab = ref("cuenta")

    // Datos del pedido desde el carrito
    const orderItems = ref([])
    const paymentMethods = ref([])
    const banks = ref([])

    const loading = ref(true)

    // Información de pago
    const paymentInfo = ref({
      metodo_pago: "",
      bank: "",
      reference: "",
      amount: "",
      receipt: null,
    })

    // Información de envío
    const shippingInfo = ref({
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    })

    // Estado del archivo
    const fileSelected = ref(false)
    const fileName = ref("")

    // Cargar datos iniciales
    const loadInitialData = async () => {
      try {
        checkoutData.value = JSON.parse(localStorage.getItem("checkoutData"))

        const methodsResponse = await apiService.get("/metodos-pago")
        if (methodsResponse.success && methodsResponse.data) {
          paymentMethods.value = methodsResponse.data
        }

        const banksResponse = await apiService.get("/bancos")
        if (banksResponse.success && banksResponse.data) {
          banks.value = banksResponse.data
        }

        if (checkoutData.value) {
          orderItems.value = checkoutData.value.items
          if (checkoutData.value.coupon) {
            discount.value = checkoutData.value.discount
          }
        } else {
          const cartItems = await cartService.getCartItems()

          orderItems.value = cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            brand: item.brand,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          }))
        }
      } catch (error) {
        console.error("Error loading initial data:", error)
      } finally {
        loading.value = false
      }
    }

    // Cálculos del pedido
    const subtotal = computed(() => {
      const total = orderItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return formatPrice(total)
    })

    const shipping = computed(() => {
      const subtotalValue = orderItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return subtotalValue >= 59 ? "Gratis" : formatPrice(4.99)
    })

    const discount = computed(() => {
      return checkoutData.value?.discount || null
    })

    const coupon = computed(() => {
      return checkoutData.value?.coupon?.code || null
    })

    const total = computed(() => {
      let totalValue = checkoutData.value?.total || 0

      if (totalValue < 59) {
        totalValue += 4.99
      }

      paymentInfo.value.amount = formatPriceBs(totalValue)
      return formatPrice(totalValue)
    })

    const totalBs = computed(() => {
      let totalValue = checkoutData.value?.total || 0
      return formatPriceBs(totalValue)
    })

    // Validación del formulario
    const isFormValid = computed(() => {
      return (
        paymentInfo.value.metodo_pago &&
        (paymentInfo.value.metodo_pago === "1" ? paymentInfo.value.bank : true) &&
        paymentInfo.value.reference &&
        fileSelected.value &&
        shippingInfo.value.name &&
        shippingInfo.value.address &&
        shippingInfo.value.city &&
        shippingInfo.value.state &&
        shippingInfo.value.phone
      )
    })

    // Funciones
    const formatPrice = (price) => {
      if (typeof price === "string") return price
      return `${price.toFixed(2).replace(".", ",")}$`
    }

    const formatPriceBs = (price) => {
      const rate = dollarRate.value?._value || dollarRate.value
      const numericPrice = typeof price === "string" ? Number.parseFloat(price.replace(",", ".")) : Number(price)

      if (!rate || isNaN(numericPrice)) return "--.-- BS"

      return (
        (numericPrice * Number(rate).toFixed(2))
          .toFixed(2)
          .replace(".", ",")
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " BS"
      )
    }

    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        paymentInfo.value.receipt = file
        fileName.value = file.name
        fileSelected.value = true
      }
    }

    const removeFile = () => {
      paymentInfo.value.receipt = null
      fileName.value = ""
      fileSelected.value = false
      // Resetear el input file
      const fileInput = document.getElementById("receipt")
      if (fileInput) fileInput.value = ""
    }

    const confirmPayment = async () => {
      try {
        // Mostrar indicador de carga
        loading.value = true

        // Verificar autenticación
        if (!getToken() || !getUserId()) {
          toast.error("Debes iniciar sesión para realizar el pago", {
            title: "Error de autenticación",
            description: "Por favor inicia sesión para continuar",
          })
          router.push("/login")
          return
        }

        // Verificar que se ha seleccionado un archivo de comprobante
        if (!paymentInfo.value.receipt) {
          toast.error("Debes adjuntar un comprobante de pago", {
            title: "Error en el formulario",
            description: "Por favor adjunta una imagen del comprobante de pago",
          })
          loading.value = false
          return
        }

        // Verificar información de envío
        if (
          !shippingInfo.value.name ||
          !shippingInfo.value.address ||
          !shippingInfo.value.city ||
          !shippingInfo.value.state ||
          !shippingInfo.value.phone
        ) {
          toast.error("Debes completar todos los campos de envío", {
            title: "Error en el formulario",
            description: "Por favor completa todos los campos de información de envío",
          })
          loading.value = false
          return
        }

        // Obtener datos del checkout
        const checkoutData = JSON.parse(localStorage.getItem("checkoutData"))
        if (!checkoutData) {
          toast.error("No se encontraron datos del pedido", {
            title: "Error",
            description: "Por favor regresa al carrito e intenta nuevamente",
          })
          router.push("/cart")
          return
        }

        // Crear la orden primero
        try {
        
          const orderItemsPayload = orderItems.value.map(item => {
            // Determinar tipo_precio según el campo usado en el producto
            let tipo_precio = "unidad"
            if (item.price === item.priceStore) tipo_precio = "tienda"
            if (item.price === item.priceDistributor) tipo_precio = "distribuidor"

            // Calcular el total en bs: precio * cantidad * tasa
            const price = Number.parseFloat(item.price)
            const quantity = Number(item.quantity)
            const rate = Number(dollarRate.value?._value || dollarRate.value).toFixed(2)

            const precio_bs = (!isNaN(price) && !isNaN(quantity) && !isNaN(rate))
              ? (price * quantity * rate).toFixed(2)
              : "0.00"

            return {
              producto_id: item.productId,
              cantidad: item.quantity,
              tipo_precio,
              precio_bs,
            }
          })

          // Calcular monto_total y monto_total_bs correctamente
          const rate = Number(dollarRate.value?._value || dollarRate.value).toFixed(2)

          const monto_total = orderItems.value.reduce((sum, item) => {
            const price = Number(item.price)
            const quantity = Number(item.quantity)
            return sum + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity)
          }, 0)

          const monto_total_bs = (monto_total * rate).toFixed(2)

          const orderResponse = await apiService.post("/ordenes", getToken(), {
            usuario_id: getUserId(), 
            items: orderItemsPayload,
          })

          if (!orderResponse.success) {
            throw new Error(orderResponse.message || "Error al crear la orden")
          }

          const orderId = orderResponse.data.id

          // Si hay cupón aplicado, registrarlo
          if (checkoutData?.coupon) {
            try {
              const couponResponse = await couponService.applyCoupon(checkoutData.coupon.code, orderId)

              if (!couponResponse.success) {
                console.error("Error al aplicar cupón:", couponResponse.message)
              }
            } catch (couponError) {
              console.error("Error al aplicar cupón:", couponError)
            }
          }

          // Crear FormData para enviar el archivo
          const formData = new FormData()
          formData.append("orden_id", orderId)
          formData.append("metodo_pago_id", paymentInfo.value.metodo_pago)
          formData.append("numero_referencia", paymentInfo.value.reference)
          formData.append(
            "monto",
            Number.parseFloat(paymentInfo.value.amount.replace(",", "").replace("BS", "").trim()),
          )
          formData.append("comprobante_img", paymentInfo.value.receipt)

          // Añadir información de envío como campos individuales
          formData.append("nombre_receptor", shippingInfo.value.name)
          formData.append("direccion", shippingInfo.value.address)
          formData.append("ciudad", shippingInfo.value.city)
          formData.append("estado", shippingInfo.value.state)
          formData.append("telefono", shippingInfo.value.phone)

          // Al crear el pago, enviar monto_total y monto_total_bs ya calculados
          formData.append("monto_total", monto_total_bs)
          formData.append("monto_total_bs", monto_total_bs)

          // Procesar el pago con FormData para manejar el archivo
          try {
            const paymentData = await paymentService.processPayment(formData, getToken())

            if (!paymentData.success) {
              throw new Error(paymentData.message || "Error al procesar el pago")
            }

            // Limpiar el carrito
            await cartService.clearCart()
            localStorage.removeItem("checkoutData")

            // Mostrar mensaje de éxito
            toast.success("Pago procesado correctamente", {
              title: "¡Éxito!",
              description: "Tu pedido ha sido registrado",
            })

            await new Promise(resolve => setTimeout(resolve, 2000))
            // Redirigir a confirmación
            router.push("/user/orders")
          } catch (paymentError) {
            console.error("Error al procesar el pago:", paymentError)
            toast.error(
              paymentError.message || "Error al procesar el pago. Verifica que el servidor API esté funcionando.",
              {
                title: "Error en el pago",
                description: "Hubo un problema al procesar tu pago. Por favor intenta nuevamente más tarde.",
              },
            )
          }
        } catch (orderError) {
          console.error("Error al crear la orden:", orderError)
          toast.error(orderError.message || "Error al crear la orden", {
            title: "Error en la orden",
            description: "No se pudo crear la orden. Por favor intenta nuevamente.",
          })
        }
      } catch (error) {
        console.error("Error general en el proceso de pago:", error)
        toast.error(error.message || "Error al procesar el pago", {
          title: "Error",
          description: "Ocurrió un error inesperado. Por favor intenta nuevamente más tarde.",
        })
      } finally {
        // Ocultar indicador de carga
        loading.value = false
      }
    }

    // Cargar datos al montar el componente
    onMounted(() => {
      loadInitialData()
    })

    return {
      orderItems,
      paymentMethods,
      banks,
      paymentInfo,
      shippingInfo,
      fileSelected,
      fileName,
      subtotal,
      shipping,
      discount,
      total,
      coupon,
      isFormValid,
      formatPrice,
      handleFileUpload,
      removeFile,
      confirmPayment,
      loading,
      bankData,
      activeTab,
      totalBs,
      formatPriceBs,
      dollarRate,
      getToken,
      getUserId,
    }
  },
}
