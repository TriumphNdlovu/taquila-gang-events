import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import { fetchEventById } from "./eventService";

export const generateTicketPDF = async (ticketId: string) => {
    const event = await fetchEventById(localStorage.getItem('eventid')!);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 200]); // Increased page height to accommodate the poster

    // Set background color
    page.drawRectangle({
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
        color: rgb(1, 1, 1),
    });


        const posterImageBytes = await fetch("../../EventPoster.jpeg").then((res) => res.arrayBuffer());
        const posterImage = await pdfDoc.embedJpg(posterImageBytes); // or use embedJpg if the image is a JPEG

        // Draw the poster image on the PDF (resize and position as needed)
        const posterDims = posterImage.scale(0.12);
        page.drawImage(posterImage, {
            x: 30,
            y: 30, // Adjust the y-position as needed
            width: posterDims.width,
            height: posterDims.height,
        });
    

    // Add a title with improved styling
    page.drawText(event!.title, {
        x: 190,
        y: 150,
        size: 16,
        color: rgb(0, 0, 0),
        font: await pdfDoc.embedFont(StandardFonts.TimesRomanBold), // Use a bold font for the title
    });

    page.drawText(`Venue: ${event!.venue}`, { x: 190, y: 125, size: 10, font: await pdfDoc.embedFont(StandardFonts.Courier) });
    page.drawText(`Date: ${new Date(event!.date).toLocaleDateString()}`, { x: 190, y: 110, size: 10, font: await pdfDoc.embedFont(StandardFonts.Courier) });
    page.drawText(`Time: ${event!.time}`, { x: 190, y: 95, size: 10, font: await pdfDoc.embedFont(StandardFonts.Courier) });
    page.drawText(`Price: R${event!.price}`, { x: 190, y: 80, size: 10, font: await pdfDoc.embedFont(StandardFonts.Courier) });

    // Add a decorative border
    page.drawRectangle({
        x: 20,
        y: 10,
        width: 395,
        height: 180 , // Adjusted height to fit around the poster
        borderWidth: 1,
        borderColor: rgb(0.0, 0.0, 0.0),
    });

    page.drawText(`N.O: ${ticketId}`, {
        x: 50,
        y: 20,
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
        y: 80,
        width: pngDims.width,
        height: pngDims.height,
    });

    // Add instructions under the QR code
    page.drawText('Scan at the entrance', {
        x: page.getWidth() - 160,
        y: 60,
        size: 10,
        color: rgb(0.6, 0.1, 0.1),
        font: await pdfDoc.embedFont(StandardFonts.Courier),
    });

    // Convert the PDF to bytes and trigger download
    const pdf_for_saves = await pdfDoc.save();
    const pdf_for_Mail = await pdfDoc.saveAsBase64();
    const blob = new Blob([pdf_for_saves], { type: 'application/pdf' });

    return [pdf_for_Mail, pdf_for_saves];
};
