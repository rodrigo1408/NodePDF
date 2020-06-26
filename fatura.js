const fs = require("fs");
const PDFdocument = require("pdfkit");

function createInvoice(invoice, path) {
  let pdf = new PDFdocument({ size: "A4", margin: 50 });

  generateHeader(pdf);
  generateCustomerInformation(pdf, invoice);
  generateInvoiceTable(pdf, invoice);
  generateFooter(pdf);

  pdf.end();
  pdf.pipe(fs.createWriteStream(path));
}

function generateHeader(pdf) {
  pdf
    .image("logo.png", 25, 25, { width: 100 })
    .fillColor("#444444")
    .fontSize(20)
    //.text("Insiders Solutions.", 110, 57)
    .fontSize(10)
    .text("Insiders Solutions.", 200, 50, { align: "right" })
    .text("endereço ", 200, 65, { align: "right" })
    .text("cidade, estado, 669", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(pdf, invoice) {
  pdf
    .fillColor("#444444")
    .fontSize(20)
    .text("Fatura", 50, 160);

  generateHr(pdf, 185);

  const customerInformationTop = 200;

  pdf
    .fontSize(10)
    .text("Número fatura:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Data fatura:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Saldo devedor:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(invoice.subtotal - invoice.paid),
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.address, 300, customerInformationTop + 15)
    .text(
        invoice.shipping.city +
        ", " +
        invoice.shipping.state +
        ", " +
        invoice.shipping.country,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(pdf, 252);
}

function generateInvoiceTable(pdf, invoice) {
  let i;
  const invoiceTableTop = 330;

  pdf.font("Helvetica-Bold");
  generateTableRow(
    pdf,
    invoiceTableTop,
    "Item",
    "Descrição",
    "Custo unitário",
    "Quantidade",
    "Total"
  );
  generateHr(pdf, invoiceTableTop + 20);
  pdf.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      pdf,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(pdf, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    pdf,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    pdf,
    paidToDatePosition,
    "",
    "",
    "Pago até a data",
    "",
    formatCurrency(invoice.paid)
  );

  const duePosition = paidToDatePosition + 25;
  pdf.font("Helvetica-Bold");
  generateTableRow(
    pdf,
    duePosition,
    "",
    "",
    "Saldo devedor",
    "",
    formatCurrency(invoice.subtotal - invoice.paid)
  );
  pdf.font("Helvetica");
}

function generateFooter(pdf) {
  pdf
    .fontSize(10)
    .text(
      "O pagamento é devido no prazo até 20 dias. Agradeço pelos seus serviços.",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  pdf,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  pdf
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(pdf, y) {
  pdf
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice
};