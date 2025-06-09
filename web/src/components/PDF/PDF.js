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
