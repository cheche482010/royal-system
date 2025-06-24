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
    const cleanPriceBs = (priceString) => {
      if (typeof priceString === 'string') {
        // Si tiene coma decimal, reemplaza el punto de miles y la coma por punto
        if (priceString.includes(',')) {
          return parseFloat(priceString.replace(/\./g, '').replace(',', '.'));
        }
        // Si solo tiene punto decimal, simplemente parseFloat
        return parseFloat(priceString);
      }
      return priceString;
    };

    function formatBs(amount) {
      if (!amount) return "0,00 Bs"
      return (
        Number(amount)
          .toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
        " Bs"
      )
    }
    return {
      formatBs,
      invoice: {
        client: {
          name: this.order.envio.nombre_receptor,
          rif: this.order.documento,
          address: this.order.envio.direccion,
          phone: this.order.envio.telefono,
        },
        number: this.order.number,
        issueDate: this.order.date,
        items: this.order.products.map(product => {
          const priceBsNum = cleanPriceBs(product.priceBs);
          const quantityNum = typeof product.quantity === 'string' ? parseFloat(product.quantity) : product.quantity;
          return {
            code: product.code || product.id,
            description: product.name || product.description,
            quantity: product.quantity,
            unitPrice: quantityNum ? priceBsNum / quantityNum : 0,
            priceBs: product.priceBs,
          };
        }),
        subtotal: this.order.totalBs,
        exemptTotal: 0,
        taxableBase: 0,
        note: "",
        taxRate: 0,
        igtfRate: 0,
        paymentMethod: (this.order.Pagos && this.order.Pagos.length > 0 && this.order.Pagos[0].MetodoPago && this.order.Pagos[0].MetodoPago.nombre) ? this.order.Pagos[0].MetodoPago.nombre : '',
        total: this.order.totalBs,
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