const { createInvoice } = require("./fatura");

const invoice = {
  shipping: {
    name: " ",
    address: " ",
    city: " ",
    state: " ",
    country: " ",
    postal_code: 140823
  },
  items: [
    {
      item: " ",
      description: " ",
      quantity: 2,
      amount: 5000
    },
    {
      item: " ",
      description: " ",
      quantity: 5,
      amount: 3000
    }
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 328041
};

createInvoice(invoice, "fatura.pdf");