<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-top">
                <div class="footer-column">
                    <div class="footer-logo">
                        <h3 class="logo-text">Royal Shop</h3>
                    </div>
                    <p class="footer-description">
                        Distribuidor autorizado de la maraca de comida Premium para mascotas BRIT.
                    </p>
                    <div class="social-icons">
                        <a href="https://www.facebook.com/share/16QYHjo8XU/" target="_blank" class="social-icon" aria-label="Facebook">
                            <FacebookIcon />
                        </a>
                        <a href="https://www.instagram.com/britvenezuela/" target="_blank" class="social-icon" aria-label="Instagram">
                            <InstagramIcon />
                        </a>
                        <a href="https://api.whatsapp.com/send/?phone=4126744409&text&type=phone_number&app_absent=0" target="_blank" class="social-icon" aria-label="Whatsapp">
                            <MessageCircleIcon />
                        </a>
                    </div>
                </div>

                <div class="footer-column">
                    <h4 class="footer-title">Información</h4>
                    <ul class="footer-links">
                        <li><a href="/about">Sobre nosotros</a></li>
                        <li><a href="/faq">Preguntas frecuentes</a></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h4 class="footer-title">Mi cuenta</h4>
                    <ul class="footer-links">
                        <li><a href="/user">Perfil</a></li>
                        <li><a href="/cart">Carrito</a></li>
                    </ul>
                </div>

                <div class="footer-column">
                    <h4 class="footer-title">Contacto</h4>
                    <ul class="contact-info">
                        <li>
                            <PhoneIcon class="contact-icon" />
                            <a href="https://api.whatsapp.com/send/?phone=4126744409&text&type=phone_number&app_absent=0" target="_blank">0412-6744409</a>
                        </li>
                        <li>
                            <MailIcon class="contact-icon" />
                            <span>contacto@royalpetve.com</span>
                        </li>
                        <li>
                            <ClockIcon class="contact-icon" />
                            <span>Lun-Vie: 8:00AM-4:00PM</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="copyright">
                    <p>&copy; {{ currentYear }} Royal Pet, C.A. Todos los derechos reservados.</p>
                </div>
                <div class="footer-bottom-links">
                    <a href="/terms">Términos y condiciones</a>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped src="./Footer.scss" lang="scss"></style>
<script src="./Footer.js"></script>