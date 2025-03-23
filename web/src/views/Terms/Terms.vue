<template>
    <Header :disable-nav="true" />
    <div class="terms-container">
        <!-- Navegación superior -->
        <nav class="breadcrumb">
            <span>Página Legal</span>
            <span>/</span>
            <strong>{{ activeSection }}</strong>
        </nav>

        <!-- Contenedor principal -->
        <div class="content-wrapper">
            <!-- Menú lateral -->
            <aside class="sidebar">
                <nav>
                    <ul>
                        <li><a href="#" @click.prevent="activeSection = 'Términos y Condiciones'">{{
                            sectionNames.terminos
                                }}</a></li>
                        <li><a href="#" @click.prevent="activeSection = 'item2'">{{ sectionNames.item2 }}</a></li>
                        <li><a href="#" @click.prevent="activeSection = 'item3'">{{ sectionNames.item3 }}</a></li>
                    </ul>
                </nav>
            </aside>

            <!-- Contenido principal -->
            <main class="content">
                <!-- Sección Términos y Condiciones -->
                <section v-if="activeSection === 'Términos y Condiciones'" class="terms-content">
                    <h1>Términos y Condiciones de Uso de Royal Pet</h1>

                    <article>
                        <h2>Bienvenido/a a ROYAL PET, tu tienda online de alimentos para mascotas.</h2>
                        <p>Al registrarte y utilizar nuestros servicios, aceptas los siguientes términos y condiciones.
                            Por favor, léelos detenidamente antes de continuar.</p>
                    </article>

                    <!-- Secciones numeradas -->
                    <section class="term-section">
                        <h3>1. Aceptación de los Términos</h3>
                        <p>Al registrarte en el sitio web de ROYAL PET, confirmas que has leído, comprendido y aceptado
                            estos términos y
                            condiciones, así como nuestra Política de Privacidad. Si no estás de acuerdo con alguno de
                            estos términos, no
                            podrás utilizar nuestros servicios.</p>
                    </section>

                    <section class="term-section">
                        <h3>2. Registro de Usuario</h3>
                        <p>Datos Personales: Para registrarte, deberás proporcionar información personal precisa y
                            actualizada, como nombre,
                            dirección, correo electrónico y otros datos necesarios.</p>
                        <p>Responsabilidad: Eres responsable de mantener la confidencialidad de tu cuenta y contraseña,
                            y de restringir el
                            acceso a tu dispositivo. Aceptas ser responsable de todas las actividades que ocurran bajo
                            tu cuenta.</p>
                        <p>Mayoría de Edad: Para registrarte, debes ser mayor de edad según la legislación de tu país.
                            Si eres menor de
                            edad, necesitarás el consentimiento de un tutor legal.</p>
                    </section>

                    <section class="term-section">
                        <h3>3. Uso del Sitio Web</h3>
                        <p>Propósito: El sitio web de ROYAL PET está destinado únicamente para la compra de alimentos y
                            productos para
                            mascotas. No podrás utilizarlo con fines ilegales o no autorizados.</p>
                        <p>Prohibiciones: Queda prohibido:</p>
                        <ul>
                            <li>Copiar, distribuir o modificar cualquier contenido del sitio sin autorización.</li>
                            <li>Utilizar el sitio para fines fraudulentos o que infrinjan derechos de terceros.</li>
                            <li>Realizar acciones que puedan dañar la funcionalidad del sitio o afectar la experiencia
                                de otros usuarios.</li>
                        </ul>
                    </section>

                    <section class="term-section">
                        <h3>4. Compras y Pagos</h3>
                        <p>Precios: Todos los precios están expresados en la moneda local e incluyen impuestos
                            aplicables, salvo que se
                            indique lo contrario.</p>
                        <p>Disponibilidad: Los productos están sujetos a disponibilidad. En caso de agotamiento, nos
                            reservamos el derecho a
                            cancelar pedidos y reembolsar el pago.</p>
                        <p>Métodos de Pago: Aceptamos pagos a través de tarjetas de crédito/débito, transferencias
                            bancarias y otros métodos
                            indicados en el sitio.</p>
                        <p>Facturación: Al realizar una compra, recibirás una factura electrónica en tu correo
                            registrado.</p>
                    </section>

                    <section class="term-section">
                        <h3>5. Devoluciones y Reembolsos</h3>
                        <p>Plazo: Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del producto,
                            siempre que esté en
                            su embalaje original y en perfecto estado.</p>
                        <p>Proceso: Para solicitar una devolución, contacta a nuestro servicio de atención al cliente.
                            Una vez aprobada, se
                            te indicará cómo proceder.</p>
                        <p>Reembolsos: Los reembolsos se realizarán mediante el mismo método de pago utilizado en la
                            compra, dentro de un
                            plazo máximo de 14 días hábiles.</p>
                    </section>

                    <section class="term-section">
                        <h3>6. Privacidad y Protección de Datos</h3>
                        <p>Datos Personales: Respetamos tu privacidad y protegemos tus datos personales de acuerdo con
                            nuestra *Política de
                            Privacidad*.</p>
                        <p>Uso de Datos: Tus datos se utilizarán únicamente para procesar pedidos, mejorar nuestros
                            servicios y enviar
                            información relevante (si has dado tu consentimiento).</p>
                    </section>

                    <section class="term-section">
                        <h3>7. Limitación de Responsabilidad</h3>
                        <p>Productos: ROYAL PET no se hace responsable por daños o perjuicios derivados del uso
                            incorrecto de los productos
                            adquiridos en nuestro sitio.</p>
                        <p>Terceros: No somos responsables por problemas derivados de servicios de terceros, como
                            empresas de transporte o
                            pasarelas de pago.</p>
                    </section>

                    <section class="term-section">
                        <h3>8. Modificaciones</h3>
                        <p>Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las
                            actualizaciones
                            serán publicadas en el sitio web y entrarán en vigor inmediatamente después de su
                            publicación.</p>
                    </section>

                    <section class="term-section">
                        <h3>9. Ley Aplicable y Jurisdicción</h3>
                        <p>Estos términos y condiciones se rigen por las leyes de Venezuela. Cualquier disputa
                            relacionada con el uso del
                            sitio web estará sujeta a la jurisdicción exclusiva de los tribunales Barquisimeto, estado
                            Lara.</p>
                    </section>

                    <section class="term-section">
                        <h3>10. Contacto</h3>
                        <p>Si tienes alguna pregunta sobre estos términos y condiciones, puedes contactarnos a través
                            de:</p>
                        <p>Correo electrónico: contacto@royalpetve.com</p>
                        <p>Al hacer clic en "Aceptar", confirmas que has leído y aceptado estos términos y condiciones.
                            Gracias por elegir
                            ROYAL PET para el cuidado de tus mascotas.</p>
                    </section>
                </section>

                <!-- Otras secciones (vacías por defecto) -->
                <section v-if="activeSection === 'item2'" class="terms-content">
                    <h1>Item 2</h1>
                    <!-- Contenido cuando se active este item -->
                </section>

                <section v-if="activeSection === 'item3'" class="terms-content">
                    <h1>Item 3</h1>
                    <!-- Contenido cuando se active este item -->
                </section>
            </main>
        </div>
    </div>
</template>

<script src="./Terms.js"></script>
<style scoped src="./Terms.scss" lang="scss"></style>