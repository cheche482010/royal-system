<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-top">
                <div class="footer-column">
                    <div class="footer-logo">
                        <h3 class="logo-text">Royal Shop</h3>
                    </div>
                    <p class="footer-description">
                        Tu tienda online de confianza para encontrar los mejores productos al mejor precio.
                    </p>
                    <div class="social-icons">
                        <a href="#" class="social-icon" aria-label="Facebook">
                            <FacebookIcon />
                        </a>
                        <a href="#" class="social-icon" aria-label="Instagram">
                            <InstagramIcon />
                        </a>
                        <a href="#" class="social-icon" aria-label="Twitter">
                            <TwitterIcon />
                        </a>
                    </div>
                </div>

                <div class="footer-column">
                    <h4 class="footer-title">Categorías</h4>
                    <ul class="footer-links">
                        <li><a href="/category/electronicos">Electrónicos</a></li>
                        <li><a href="/category/ropa">Ropa</a></li>
                        <li><a href="/category/hogar">Hogar</a></li>
                        <li><a href="/category/deportes">Deportes</a></li>
                        <li><a href="/category/juguetes">Juguetes</a></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h4 class="footer-title">Información</h4>
                    <ul class="footer-links">
                        <li><a href="/about">Sobre nosotros</a></li>
                        <li><a href="/contact">Contacto</a></li>
                        <li><a href="/faq">Preguntas frecuentes</a></li>
                        <li><a href="/shipping">Envíos</a></li>
                        <li><a href="/returns">Devoluciones</a></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h4 class="footer-title">Mi cuenta</h4>
                    <ul class="footer-links">
                        <li><a href="/login">Iniciar sesión</a></li>
                        <li><a href="/register">Registrarse</a></li>
                        <li><a href="/orders">Mis pedidos</a></li>
                        <li><a href="/wishlist">Lista de deseos</a></li>
                        <li><a href="/cart">Carrito</a></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h4 class="footer-title">Contacto</h4>
                    <ul class="contact-info">
                        <li>
                            <MapPinIcon class="contact-icon" />
                            <span>Calle Principal 123, Ciudad</span>
                        </li>
                        <li>
                            <PhoneIcon class="contact-icon" />
                            <span>+1 234 567 890</span>
                        </li>
                        <li>
                            <MailIcon class="contact-icon" />
                            <span>info@royalshop.com</span>
                        </li>
                        <li>
                            <ClockIcon class="contact-icon" />
                            <span>Lun - Vie: 9:00 - 18:00</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="footer-middle">
                <div class="newsletter">
                    <h4 class="newsletter-title">Suscríbete a nuestro boletín</h4>
                    <p class="newsletter-text">Recibe las últimas ofertas y novedades directamente en tu correo.</p>
                    <form class="newsletter-form" @submit.prevent="subscribeNewsletter">
                        <input type="email" placeholder="Tu correo electrónico" class="newsletter-input" v-model="email"
                            required />
                        <button type="submit" class="newsletter-button">
                            <SendIcon class="send-icon" />
                            Suscribirse
                        </button>
                    </form>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="copyright">
                    <p>&copy; {{ currentYear }} Royal Shop. Todos los derechos reservados.</p>
                </div>
                <div class="footer-bottom-links">
                    <a href="/privacy">Política de privacidad</a>
                    <a href="/terms">Términos y condiciones</a>
                    <a href="/cookies">Política de cookies</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped src="./Footer.scss" lang="scss"></style>
<script src="./Footer.js"></script>