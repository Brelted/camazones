import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const createDigitalSignature = (parts) => {
  const source = parts.map((part) => String(part ?? '')).join('|');
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `CMZ-SIGN-${(hash >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;
};

export const exportInvoicePdf = async ({ productTitle, total, method, transactionId, customerName, email }) => {
  const issuedAt = new Date().toLocaleString('fr-FR');
  const signature = createDigitalSignature([transactionId, productTitle, total, method, email, issuedAt]);
  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 32px; color: #1F1F1F; background: #F6F1EA;">
        <div style="border: 1px solid #D2B48C; border-radius: 18px; padding: 28px;">
          <h1 style="margin: 0; color: #FF5A00;">Camazones</h1>
          <p style="margin-top: 4px;">Facture achat marketplace</p>
          <hr />
          <p><strong>Client:</strong> ${escapeHtml(customerName ?? 'Client Camazones')}</p>
          <p><strong>Email:</strong> ${escapeHtml(email ?? 'client@camazones.demo')}</p>
          <p><strong>Produit:</strong> ${escapeHtml(productTitle)}</p>
          <p><strong>Methode:</strong> ${escapeHtml(method)}</p>
          <p><strong>Total:</strong> ${escapeHtml(total)}</p>
          <p><strong>Transaction:</strong> ${escapeHtml(transactionId)}</p>
          <p><strong>Date:</strong> ${escapeHtml(issuedAt)}</p>
          <div style="margin-top: 20px; border-radius: 14px; background: #FFF8EA; padding: 14px;">
            <p style="margin: 0;"><strong>Signature numerique:</strong> ${escapeHtml(signature)}</p>
            <p style="margin: 6px 0 0; font-size: 12px; color: rgba(31,31,31,.62);">Signature locale basee sur transaction, client, montant et date d'emission.</p>
          </div>
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
