import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const exportInvoicePdf = async ({ productTitle, total, method, transactionId, customerName, email }) => {
  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 32px; color: #1F1F1F; background: #F6F1EA;">
        <div style="border: 1px solid #D2B48C; border-radius: 18px; padding: 28px;">
          <h1 style="margin: 0; color: #FF5A00;">Camazones</h1>
          <p style="margin-top: 4px;">Facture achat marketplace</p>
          <hr />
          <p><strong>Client:</strong> ${customerName ?? 'Client Camazones'}</p>
          <p><strong>Email:</strong> ${email ?? 'client@camazones.demo'}</p>
          <p><strong>Produit:</strong> ${productTitle}</p>
          <p><strong>Methode:</strong> ${method}</p>
          <p><strong>Total:</strong> ${total}</p>
          <p><strong>Transaction:</strong> ${transactionId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <hr />
          <p>Merci pour votre achat. Le recu est genere localement depuis l'application Camazones.</p>
        </div>
      </body>
    </html>
  `;

  const file = await Print.printToFileAsync({ html, base64: false });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', dialogTitle: 'Facture Camazones' });
  }
  return file.uri;
};
