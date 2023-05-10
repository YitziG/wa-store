import fs from 'fs';
import PDFDocument from 'pdfkit';

export function generateDocument(checkout, buyer, link) {
    const doc = new PDFDocument();

    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream('invoice.pdf');
        doc.pipe(writeStream);

        writeToDoc(doc, checkout, buyer, link);
        doc.end();

        writeStream.on('finish', () => resolve(`${process.cwd()}/invoice.pdf`));
        writeStream.on('error', reject);
    });
}

function writeToDoc(doc, checkout, buyer, link) {

    // Header
    doc.fontSize(24)
        .text("Invoice", 50, 50);

    // Invoice Details
    doc.fontSize(14)
        .text(`Invoice ID: ${checkout._id}`, 50, 100)
        .text(`Date: ${formatDate(checkout._createdDate)}`, 50, 120)
        .text(`Buyer: ${buyer}`, 50, 140);

    // Line Items
    doc.fontSize(14)
        .text("Items", 50, 180);

    let yPosition = 200;
    for (const item of checkout.lineItems) {
        doc.fontSize(12)
            .text(item.productName.translated, 50, yPosition)
            .text(item.quantity + ' x ' + item.price.convertedAmount + ' NIS', 400, yPosition)
        yPosition += 60;
    }

    // Totals
    doc.fontSize(14)
        .text(`Subtotal: ${checkout.priceSummary.subtotal.convertedAmount + ' NIS'}`, 50, yPosition + 20)
        .text(`Tax: ${checkout.priceSummary.tax.convertedAmount + ' NIS'}`, 50, yPosition + 40)
        .text(`Total: ${checkout.priceSummary.total.convertedAmount + ' NIS'}`, 50, yPosition + 60);

    const linkText = "Pay invoice online";
    doc.fontSize(12)
        .fillColor('blue')
        .text(linkText, 50, yPosition + 100, {
            link: link,
            underline: true
        });
}

function formatDate(date) {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(date).toLocaleDateString('en-US', options);
}
