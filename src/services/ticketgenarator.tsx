import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import { fetchEventById } from "./eventService";






export const generateTicketPDF = async (ticketId: string) => {

    const event = await fetchEventById(localStorage.getItem('eventid')!);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 200]);

    // Set background color
    page.drawRectangle({
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
        color: rgb(0.67, 0.73, 0.85),
    

    });

    // Add a title with improved styling
    page.drawText(event!.title, {
        x: 30,
        y: 150,
        size: 16,
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.TimesRomanBold), // Use a bold font for the title
    });

    page.drawText(`Venue: ${event!.venue}`, { x: 50, y: 115, size: 10, font: await pdfDoc.embedFont(StandardFonts.Helvetica) });
    page.drawText(`Date: ${new Date(event!.date).toLocaleString()}`, { x: 50, y: 100 , size: 10, font: await pdfDoc.embedFont(StandardFonts.Helvetica) });
    page.drawText(`Time: ${event!.time}`, { x: 50, y: 85, size: 10, font: await pdfDoc.embedFont(StandardFonts.Helvetica) });
    page.drawText(`Price: ${event!.price}`, { x: 50, y: 70, size: 10, font: await pdfDoc.embedFont(StandardFonts.Helvetica) });

    // Add a decorative border
    page.drawRectangle({
        x: 20,
        y: 10,
        width: 395,
        height: 170, // Increased height for more space
        borderWidth: 1,
        borderColor: rgb(0.0, 0.0, 0.0),
      
    });

    page.drawText(`N.O: ${ticketId}`, {
        x: 50,
        y: 40, // Adjusted y position to fit inside the border
        size: 6,
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    });
    

    // Generate a QR code and add it to the PDF
    const qrCodeUrl = await QRCode.toDataURL(ticketId);
    const pngImageBytes = await fetch(qrCodeUrl).then((res) => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(pngImageBytes);

    const pngDims = pngImage.scale(0.5);
    page.drawImage(pngImage, {
        x: page.getWidth() - 140,
        y: 80, // Adjusted y position to fit inside the border
        width: pngDims.width,
        height: pngDims.height,
    });

    // Add instructions under QR code
    page.drawText('Scan at the entrance', {
        x: page.getWidth() - 157,
        y: 60, // Adjusted y position to fit inside the border
        size: 10,
        color: rgb(0.6, 0.1, 0.1),
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    });

    // Convert the PDF to bytes and trigger download
    const pdf_for_saves = await pdfDoc.save();
    const pdf_for_Mail = await pdfDoc.saveAsBase64();
    const blob = new Blob([pdf_for_saves], { type: 'application/pdf' });

   
    return [pdf_for_Mail, pdf_for_saves];
};