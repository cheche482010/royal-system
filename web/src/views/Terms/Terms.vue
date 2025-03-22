<template>
    <div class="register-container">
        <div class="register-card">
            <div class="register-header">
                <h1 class="register-title">Terminos y Condiciones de Uso</h1>
            </div>
            <div class="terminos">
                <h4 class="register-title">Términos y Condiciones de Uso de Royal Pet</h4>
                <p>Bienvenido/a a ROYAL PET, tu tienda online de alimentos para mascotas. Al registrarte y utilizar
                    nuestros servicios, aceptas los siguientes términos y condiciones. Por favor, léelos detenidamente
                    antes de continuar.</p>

                <h4>1. Aceptación de los Términos</h4>
                <p>Al registrarte en el sitio web de ROYAL PET, confirmas que has leído, comprendido y aceptado estos
                    términos y condiciones, así como nuestra Política de Privacidad. Si no estás de acuerdo con alguno
                    de estos términos, no podrás utilizar nuestros servicios.</p>

                <h4>2. Registro de Usuario</h4>
                <ol>
                    <li><strong>Datos Personales:</strong> Para registrarte, deberás proporcionar información personal
                        precisa y actualizada, como nombre, dirección, correo electrónico y otros datos necesarios.</li>
                    <li><strong>Responsabilidad:</strong> Eres responsable de mantener la confidencialidad de tu cuenta
                        y contraseña, y de restringir el acceso a tu dispositivo. Aceptas ser responsable de todas las
                        actividades que ocurran bajo tu cuenta.</li>
                    <li><strong>Mayoría de Edad:</strong> Para registrarte, debes ser mayor de edad según la legislación
                        de tu país. Si eres menor de edad, necesitarás el consentimiento de un tutor legal.</li>
                </ol>

                <h4>3. Uso del Sitio Web</h4>
                <ol>
                    <li><strong>Propósito:</strong> El sitio web de ROYAL PET está destinado únicamente para la compra
                        de alimentos y productos para mascotas. No podrás utilizarlo con fines ilegales o no
                        autorizados.</li>
                    <li><strong>Prohibiciones:</strong> Queda prohibido:
                        <ul>
                            <li>Copiar, distribuir o modificar cualquier contenido del sitio sin autorización.</li>
                            <li>Utilizar el sitio para fines fraudulentos o que infrinjan derechos de terceros.</li>
                            <li>Realizar acciones que puedan dañar la funcionalidad del sitio o afectar la experiencia
                                de otros usuarios.</li>
                        </ul>
                    </li>
                </ol>

                <h4>4. Compras y Pagos</h4>
                <ol>
                    <li><strong>Precios:</strong> Todos los precios están expresados en la moneda local e incluyen
                        impuestos aplicables, salvo que se indique lo contrario.</li>
                    <li><strong>Disponibilidad:</strong> Los productos están sujetos a disponibilidad. En caso de
                        agotamiento, nos reservamos el derecho a cancelar pedidos y reembolsar el pago.</li>
                    <li><strong>Métodos de Pago:</strong> Aceptamos pagos a través de tarjetas de crédito/débito,
                        transferencias bancarias y otros métodos indicados en el sitio.</li>
                    <li><strong>Facturación:</strong> Al realizar una compra, recibirás una factura electrónica en tu
                        correo registrado.</li>
                </ol>

                <h4>5. Devoluciones y Reembolsos</h4>
                <ol>
                    <li><strong>Plazo:</strong> Aceptamos devoluciones dentro de los 30 días posteriores a la recepción
                        del producto, siempre que esté en su embalaje original y en perfecto estado.</li>
                    <li><strong>Proceso:</strong> Para solicitar una devolución, contacta a nuestro servicio de atención
                        al cliente. Una vez aprobada, se te indicará cómo proceder.</li>
                    <li><strong>Reembolsos:</strong> Los reembolsos se realizarán mediante el mismo método de pago
                        utilizado en la compra, dentro de un plazo máximo de 14 días hábiles.</li>
                </ol>

                <h4>6. Privacidad y Protección de Datos</h4>
                <ol>
                    <li><strong>Datos Personales:</strong> Respetamos tu privacidad y protegemos tus datos personales de
                        acuerdo con nuestra *Política de Privacidad*.</li>
                    <li><strong>Uso de Datos:</strong> Tus datos se utilizarán únicamente para procesar pedidos, mejorar
                        nuestros servicios y enviar información relevante (si has dado tu consentimiento).</li>
                </ol>

                <h4>7. Limitación de Responsabilidad</h4>
                <ol>
                    <li><strong>Productos:</strong> ROYAL PET no se hace responsable por daños o perjuicios derivados
                        del uso incorrecto de los productos adquiridos en nuestro sitio.</li>
                    <li><strong>Terceros:</strong> No somos responsables por problemas derivados de servicios de
                        terceros, como empresas de transporte o pasarelas de pago.</li>
                </ol>

                <h4>8. Modificaciones</h4>
                <p>Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las
                    actualizaciones serán publicadas en el sitio web y entrarán en vigor inmediatamente después de su
                    publicación.</p>

                <h4>9. Ley Aplicable y Jurisdicción</h4>
                <p>Estos términos y condiciones se rigen por las leyes de Venezuela. Cualquier disputa relacionada con
                    el uso del sitio web estará sujeta a la jurisdicción exclusiva de los tribunales Barquisimeto,
                    estado Lara.</p>

                <h4>10. Contacto</h4>
                <p>Si tienes alguna pregunta sobre estos términos y condiciones, puedes contactarnos a través de:</p>
                <ul>
                    <li><strong>Correo electrónico:</strong> contacto@royalpetve.com</li>
                </ul>

                <p>Al hacer clic en "Aceptar", confirmas que has leído y aceptado estos términos y condiciones. Gracias
                    por elegir ROYAL PET para el cuidado de tus mascotas.</p>
            </div>
            <router-link to="/Register" class="action-item">
                <button type="submit" class="aceptar-button" :disabled="isLoading">
                    <LoaderIcon v-if="isLoading" class="spinner" />
                    <span v-else>Aceptar</span>
                </button>
            </router-link>
        </div>
    </div>
</template>

<script src="./Terms.js"></script>
<style scoped src="./Terms.scss" lang="scss"></style>