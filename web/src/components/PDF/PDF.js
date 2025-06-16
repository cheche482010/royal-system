import html2pdf from "html2pdf.js";

export default {
  name: "PDF",
  ordenId: '10',
  props: {
    ordenId: {
      type: String,
      required: true,
    },
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    // Función para limpiar el símbolo $ y convertir a número
    const cleanPrice = (priceString) => {
      if (typeof priceString === 'string') {
        return parseFloat(priceString.replace('$', '').trim());
      }
      return priceString;
    };

    return {
      invoice: {
        client: {
          name: "AGRO-FINCA DON FERNANDO C.A.",
          rif: this.ordenId,
          address: "CTRA ANTIGUA DE BARUTA - EL HATILLO CASA Nº S/N SEC SEMINARIO SAN JOSE CARACAS EL HATILLO MIRANDA",
          phone: "0424-1964408",
        },
        number: this.order.id,
        issueDate: this.order.date,
        items: this.order.products.map(product => ({
          code: product.code || product.id,
          description: product.name || product.description,
          quantity: product.quantity,
          unitPrice: cleanPrice(product.price || product.unitPrice),
        })),
        subtotal: this.order.products.reduce((total, product) => total + cleanPrice(product.price || product.unitPrice) * product.quantity, 0),
        exemptTotal: 0,
        taxableBase: 0,
        note: "",
        taxRate: 0,
        igtfRate: 0,
        paymentMethod: "[ ]",
        total: this.order.products.reduce((total, product) => total + cleanPrice(product.price || product.unitPrice) * product.quantity, 0),
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