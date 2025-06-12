<template>
  <div class="invoice-container">
    <!-- Contenedor principal con ref para PDF -->
    <div ref="invoiceContent" class="invoice-content">
      <!-- Encabezado con logo y datos -->
      <div class="header-row">
        <div class="logo-box">
          <img src="../../assets/img/logo2.png" alt="Royal Pet Logo" class="logo" />
        </div>
        <div class="header-info">
          <p class="header-title">CARRERA 24 ESQUINA AV. CONCORDIA LOCAL EDIF. GLORIA NRO. PB SECTOR</p>
          <p class="header-title">CENTRO - BARQUISIMETO. LARA, ZONA POSTAL 3001</p>
          <p class="header-title">J-40311366-1</p>
        </div>
      </div>

      <!-- Información de cliente y factura en dos columnas -->
      <div class="info-row">
        <div class="client-info">
          <div><span class="label">Razón Social:</span> {{ invoice.client.name }}</div>
          <div><span class="label">Rif:</span> {{ invoice.client.rif }}</div>
          <div><span class="label">Dirección:</span> {{ invoice.client.address }}</div>
          <div><span class="label">Teléfonos:</span> {{ invoice.client.phone }}</div>
        </div>
        <div class="invoice-details">
          <div><span class="label">Nota de Entrega Nro.:</span> {{ invoice.number }}</div>
          <div><span class="label">CRÉDITO</span></div>
          <div><span class="label">Fecha Emisión:</span> {{ invoice.issueDate }}</div>
          <div><span class="label">Fecha Vencimiento:</span> {{ invoice.dueDate }}</div>
        </div>
      </div>

      <!-- Tabla de productos -->
      <table class="products-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in invoice.items" :key="index">
            <td>{{ item.code }}</td>
            <td>{{ item.description }}</td>
            <td style="text-align: right">{{ item.quantity.toLocaleString() }}</td>
            <td style="text-align: right">{{ item.unitPrice.toLocaleString() }}</td>
            <td style="text-align: right">{{ (item.quantity * item.unitPrice).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totales y nota -->
      <div class="totals-row">
        <div class="totals-left">
          <div><span class="label">Sub-Total:</span> {{ invoice.subtotal.toLocaleString() }}</div>
          <div><span class="label">Nota:</span> {{ invoice.note || ' ' }}</div>
          <div><span class="label">Forma de Pago:</span> {{ invoice.paymentMethod }}</div>
        </div>
        <div class="totals-right">
          <div><span class="label">Total Base Imponible:</span> {{ invoice.taxableBase.toLocaleString() }}</div>
          <div><span class="label">Total Impuesto:</span> {{ invoice.taxRate }} %</div>
          <div><span class="label">Total IGTF:</span> {{ invoice.igtfRate }} %</div>
          <div><span class="label">Total Exento:</span> {{ invoice.exemptTotal.toLocaleString() }}</div>
          <div><span class="label">Total Operación:</span> <strong>{{ invoice.total.toLocaleString() }}</strong></div>
        </div>
      </div>
      <div class="footer-row">
        <div>Factura expresada en: <strong>{{ invoice.currency }}</strong></div>
        <div class="footer-right">Total Operación: <strong>{{ invoice.total.toLocaleString() }}</strong></div>
      </div>
    </div>
    <!-- Botón para generar PDF -->
    <button @click="generatePDF" class="btn-pdf">Exportar a PDF</button>
  </div>
</template>

<script src="./PDF.js"></script>
import html2pdf from "html2pdf.js";

export default {
  name: "PDF",
  ordenId: '10',
  data() {
    return {
      invoice: {
        client: {
          name: "AGRO-FINCA DON FERNANDO C.A.",
          rif: "J502132490",
          address: "CTRA ANTIGUA DE BARUTA - EL HATILLO CASA Nº S/N SEC SEMINARIO SAN JOSE CARACAS EL HATILLO MIRANDA",
          phone: "0424-1964408",
        },
        number: "NE00000360",
        issueDate: "4/6/2025",
        dueDate: "25/6/2025",
        items: [
          {
            code: "RP020",
            description: "BRIT DIETA VETERINARIA HIPOALLERGENIC 2KG",
            quantity: 6,
            unitPrice: 28,
          },
          {
            code: "RP026",
            description: "BRIT DIETA VETERINARIA HIPOALLERGENIC 12KG",
            quantity: 4,
            unitPrice: 150,
          },
        ],
        subtotal: 768,
        exemptTotal: 0,
        taxableBase: 0,
        note: "",
        taxRate: 0,
        igtfRate: 0,
        paymentMethod: "[ ]",
        total: 768,
        currency: "Dólar",
      },
    };
  },
  methods: {
    generatePDF() {
      const element = this.$refs.invoiceContent;
      const opt = {
        margin: 10,
        filename: `nota_entrega_${this.invoice.number}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf().from(element).set(opt).save();
    },
  },
};
<style scoped src="./PDF.scss" lang="scss"></style>
