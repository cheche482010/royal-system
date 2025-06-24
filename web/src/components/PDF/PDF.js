import html2pdf from "html2pdf.js";

export default {
  name: "PDF",
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    console.log('order:', this.order);
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
          name: this.order.envio.nombre_receptor,
          rif: this.order.documento,
          address: this.order.envio.direccion,
          phone: this.order.envio.telefono,
        },
        number: this.order.number,
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
        currency: "Bolivares",
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