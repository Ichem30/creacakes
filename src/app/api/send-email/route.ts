import { NextRequest, NextResponse } from "next/server"
import Mailgun from "mailgun.js"
import formData from "form-data"

const mailgun = new Mailgun(formData)
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
  url: "https://api.eu.mailgun.net"
})

const DOMAIN = process.env.MAILGUN_DOMAIN || ""
const FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || "noreply@mg.dscreacakes.fr"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "contact@dscreacakes.fr"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dscreacakes.fr"
const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/creacake-7ec43.firebasestorage.app/o/logo%2Fdcb8abcf4001979380eba637d1cacbb9~tplv-tiktokx-cropcenter_1080_1080.jpeg?alt=media&token=2894263b-dab7-402d-9e5e-a582c2346f5f"

// Base email wrapper with consistent DA
function emailWrapper(content: string, showUnsubscribe: boolean = false) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>D&S Créa'Cakes</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f0eb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
          
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="padding: 40px 40px 30px 40px; background: linear-gradient(135deg, #f9d5d4 0%, #f5e6e3 100%);">
              <img src="${LOGO_URL}" alt="D&S Créa'Cakes" style="width: 150px; height: auto; display: block;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #4a3428; text-align: center;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #f5e6e3; font-weight: 600;">D&S Créa'Cakes</p>
              <p style="margin: 0 0 15px 0; font-size: 12px; color: #d4a574; line-height: 1.5;">Pâtisseries artisanales & créations personnalisées</p>
              <table role="presentation" style="margin: 15px auto 0 auto;">
                <tr>
                  <td style="padding: 0 10px;"><a href="https://www.instagram.com/ds_creacakes/" style="color: #d4a574; text-decoration: none; font-size: 12px;">Instagram</a></td>
                  <td style="padding: 0 10px; color: #d4a574;">•</td>
                  <td style="padding: 0 10px;"><a href="https://www.tiktok.com/@ds.creacakes" style="color: #d4a574; text-decoration: none; font-size: 12px;">TikTok</a></td>
                  <td style="padding: 0 10px; color: #d4a574;">•</td>
                  <td style="padding: 0 10px;"><a href="${SITE_URL}" style="color: #d4a574; text-decoration: none; font-size: 12px;">Site Web</a></td>
                </tr>
              </table>
              <p style="margin: 20px 0 0 0; font-size: 11px; color: #a08d7f; line-height: 1.5;">
                © 2025 D&S Créa'Cakes. Tous droits réservés.${showUnsubscribe ? '<br><a href="' + SITE_URL + '/dashboard" style="color: #a08d7f; text-decoration: underline;">Gérer mes préférences</a>' : ''}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// Email templates
const templates = {
  // Welcome email (inscription)
  welcome: (data: { name: string; email: string }) => ({
    to: [data.email],
    subject: "Bienvenue chez D&S Créa'Cakes ! 🎂",
    html: emailWrapper(`
      <h1 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 28px; color: #4a3428; font-weight: 600; text-align: center;">
        Bienvenue ${data.name} ! 🎂
      </h1>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #5c4a42;">
        Merci de rejoindre la famille D&S Créa'Cakes ! Nous sommes ravis de vous compter parmi nous.
      </p>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #5c4a42;">
        Vous pouvez maintenant :
      </p>
      <ul style="margin: 0 0 20px 0; padding-left: 20px; color: #5c4a42; line-height: 2;">
        <li>Demander des devis personnalisés</li>
        <li>Suivre vos commandes</li>
        <li>Échanger directement avec notre équipe</li>
      </ul>
      <table role="presentation" style="margin: 30px 0; width: 100%;">
        <tr>
          <td align="center">
            <a href="${SITE_URL}/nos-creations" style="display: inline-block; padding: 14px 40px; background-color: #d4a574; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 2px 8px rgba(212, 165, 116, 0.3);">
              Découvrir nos créations
            </a>
          </td>
        </tr>
      </table>
    `),
  }),

  // Contact form confirmation (to client)
  contact: (data: { name: string; email: string; subject: string; message: string }) => ({
    to: [data.email],
    subject: "Nous avons bien reçu votre message - D&S Créa'Cakes",
    html: emailWrapper(`
      <h1 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 28px; color: #4a3428; font-weight: 600; text-align: center;">
        Merci ${data.name} !
      </h1>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #5c4a42;">
        Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.
      </p>
      <div style="margin: 20px 0; padding: 20px; background-color: #fdf9f7; border-radius: 8px; border-left: 4px solid #d4a574;">
        <p style="margin: 0; font-size: 14px; color: #5c4a42; font-style: italic;">"${data.message.substring(0, 150)}${data.message.length > 150 ? '...' : ''}"</p>
      </div>
      <table role="presentation" style="width: 100%; margin-top: 30px;">
        <tr>
          <td align="center" style="padding: 20px; background-color: #fdf9f7; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #5c4a42; font-weight: 600;">Besoin d'aide ?</p>
            <p style="margin: 0 0 5px 0; font-size: 14px; color: #5c4a42;">📧 <a href="mailto:contact@dscreacakes.fr" style="color: #d4a574; text-decoration: none;">contact@dscreacakes.fr</a></p>
          </td>
        </tr>
      </table>
    `),
  }),

  // Contact form notification (to admin)
  contactAdmin: (data: { name: string; email: string; subject: string; message: string }) => ({
    to: [ADMIN_EMAIL],
    subject: `[Contact] ${data.subject || 'Nouveau message'} - ${data.name}`,
    html: emailWrapper(`
      <h1 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 28px; color: #4a3428; font-weight: 600; text-align: center;">
        Nouveau message de contact
      </h1>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5d5c8; font-weight: bold; color: #4a3428;">Nom:</td><td style="padding: 10px 0; border-bottom: 1px solid #e5d5c8; color: #5c4a42;">${data.name}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5d5c8; font-weight: bold; color: #4a3428;">Email:</td><td style="padding: 10px 0; border-bottom: 1px solid #e5d5c8;"><a href="mailto:${data.email}" style="color: #d4a574;">${data.email}</a></td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #e5d5c8; font-weight: bold; color: #4a3428;">Sujet:</td><td style="padding: 10px 0; border-bottom: 1px solid #e5d5c8; color: #5c4a42;">${data.subject || 'Non spécifié'}</td></tr>
      </table>
      <div style="padding: 20px; background-color: #fdf9f7; border-radius: 8px;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #4a3428; font-weight: 600;">Message :</p>
        <p style="margin: 0; font-size: 14px; color: #5c4a42; white-space: pre-wrap;">${data.message}</p>
      </div>
      <table role="presentation" style="margin: 30px 0; width: 100%;">
        <tr>
          <td align="center">
            <a href="mailto:${data.email}?subject=Re: ${data.subject || 'Votre message'}" style="display: inline-block; padding: 14px 40px; background-color: #d4a574; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
              Répondre
            </a>
          </td>
        </tr>
      </table>
    `),
    replyTo: data.email,
  }),

  // New quote notification (to admin)
  newQuote: (data: { name: string; email: string; eventType: string; eventDate: string; quoteId: string }) => ({
    to: [ADMIN_EMAIL],
    subject: `🎂 Nouveau devis de ${data.name}`,
    html: emailWrapper(`
      <h1 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 28px; color: #4a3428; font-weight: 600; text-align: center;">
        Nouveau devis reçu !
      </h1>
      <table style="width: 100%; border-collapse: collapse; background-color: #fdf9f7; border-radius: 8px; padding: 20px;">
        <tr><td style="padding: 15px; font-weight: bold; color: #4a3428;">Client:</td><td style="padding: 15px; color: #5c4a42;">${data.name}</td></tr>
        <tr><td style="padding: 15px; font-weight: bold; color: #4a3428;">Email:</td><td style="padding: 15px;"><a href="mailto:${data.email}" style="color: #d4a574;">${data.email}</a></td></tr>
        <tr><td style="padding: 15px; font-weight: bold; color: #4a3428;">Événement:</td><td style="padding: 15px; color: #5c4a42;">${data.eventType}</td></tr>
        <tr><td style="padding: 15px; font-weight: bold; color: #4a3428;">Date:</td><td style="padding: 15px; color: #5c4a42;">${data.eventDate}</td></tr>
      </table>
      <table role="presentation" style="margin: 30px 0; width: 100%;">
        <tr>
          <td align="center">
            <a href="${SITE_URL}/dashboard/quotes/${data.quoteId}" style="display: inline-block; padding: 14px 40px; background-color: #d4a574; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
              Voir le devis
            </a>
          </td>
        </tr>
      </table>
    `),
  }),

  // Quote message notification
  quoteMessage: (data: { recipientEmail: string; recipientName: string; senderName: string; message: string; quoteId: string; isAdmin: boolean }) => ({
    to: [data.recipientEmail],
    subject: `💬 Nouveau message de ${data.senderName} - D&S Créa'Cakes`,
    html: emailWrapper(`
      <h1 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 28px; color: #4a3428; font-weight: 600; text-align: center;">
        Nouveau message
      </h1>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #5c4a42;">
        Bonjour ${data.recipientName},
      </p>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #5c4a42;">
        ${data.isAdmin ? "D&S Créa'Cakes" : data.senderName} vous a envoyé un message concernant votre devis :
      </p>
      <div style="margin: 20px 0; padding: 20px; background-color: #fdf9f7; border-radius: 8px; border-left: 4px solid #d4a574;">
        <p style="margin: 0; font-size: 14px; color: #5c4a42; white-space: pre-wrap;">${data.message}</p>
      </div>
      <table role="presentation" style="margin: 30px 0; width: 100%;">
        <tr>
          <td align="center">
            <a href="${SITE_URL}/dashboard/quotes/${data.quoteId}" style="display: inline-block; padding: 14px 40px; background-color: #d4a574; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
              Répondre
            </a>
          </td>
        </tr>
      </table>
    `),
  }),

  // Order confirmation (when quote is converted to order)
  orderConfirmation: (data: { email: string; name: string; orderId: string; eventDate: string; products: Array<{productName: string; quantity: number; price: number}>; total: number }) => ({
    to: [data.email],
    subject: "Commande confirmée ! 🎂 - D&S Créa'Cakes",
    html: emailWrapper(`
      <h1 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 28px; color: #4a3428; font-weight: 600; text-align: center;">
        Commande confirmée ! 🎂
      </h1>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #5c4a42;">
        Bonjour <strong>${data.name}</strong>,
      </p>
      <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #5c4a42;">
        Merci pour votre commande ! Nous sommes ravis de créer votre pâtisserie personnalisée.
      </p>
      <table role="presentation" style="width: 100%; border: 2px solid #e5d5c8; border-radius: 8px; margin-bottom: 30px;">
        <tr>
          <td style="padding: 25px; background-color: #fdf9f7;">
            <p style="margin: 0 0 15px 0; font-size: 14px; color: #5c4a42;"><strong>Numéro de commande :</strong> #${data.orderId.substring(0, 8).toUpperCase()}</p>
            <p style="margin: 0 0 15px 0; font-size: 14px; color: #5c4a42;"><strong>Date de l'événement :</strong> ${data.eventDate}</p>
            <div style="margin: 20px 0; height: 1px; background-color: #e5d5c8;"></div>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #5c4a42; font-weight: 600;">Articles :</p>
            ${data.products.map(p => `<p style="margin: 0 0 5px 0; font-size: 14px; color: #5c4a42;">• ${p.productName} x${p.quantity} - ${p.price * p.quantity}€</p>`).join('')}
            <div style="margin: 20px 0; height: 1px; background-color: #e5d5c8;"></div>
            <p style="margin: 0; font-size: 16px; color: #4a3428; font-weight: 600;">Total : ${data.total}€</p>
          </td>
        </tr>
      </table>
      <div style="background-color: #fdf9f7; padding: 20px; border-radius: 8px; border-left: 4px solid #d4a574; margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0; font-size: 16px; color: #4a3428; font-weight: 600;">Prochaines étapes :</p>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #5c4a42;">✓ Nous préparons votre commande avec soin</p>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #5c4a42;">✓ Vous recevrez une confirmation avant la date</p>
        <p style="margin: 0; font-size: 14px; color: #5c4a42;">✓ Pour toute question, contactez-nous</p>
      </div>
      <table role="presentation" style="width: 100%;">
        <tr>
          <td align="center" style="padding: 20px; background-color: #fdf9f7; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #5c4a42; font-weight: 600;">Des questions ?</p>
            <p style="margin: 0 0 5px 0; font-size: 14px; color: #5c4a42;">📧 <a href="mailto:contact@dscreacakes.fr" style="color: #d4a574; text-decoration: none;">contact@dscreacakes.fr</a></p>
          </td>
        </tr>
      </table>
    `),
  }),

  // Order status update
  orderStatus: (data: { email: string; name: string; orderId: string; status: string; statusLabel: string }) => ({
    to: [data.email],
    subject: `📦 Votre commande - ${data.statusLabel}`,
    html: emailWrapper(`
      <h1 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 28px; color: #4a3428; font-weight: 600; text-align: center;">
        Mise à jour de commande
      </h1>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #5c4a42;">
        Bonjour ${data.name},
      </p>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #5c4a42;">
        Le statut de votre commande a été mis à jour :
      </p>
      <table role="presentation" style="margin: 30px 0; width: 100%;">
        <tr>
          <td align="center">
            <span style="display: inline-block; padding: 15px 30px; background-color: #d4a574; color: white; border-radius: 25px; font-weight: bold; font-size: 16px;">
              ${data.statusLabel}
            </span>
          </td>
        </tr>
      </table>
      <table role="presentation" style="margin: 30px 0; width: 100%;">
        <tr>
          <td align="center">
            <a href="${SITE_URL}/dashboard/orders" style="display: inline-block; padding: 14px 40px; background-color: #4a3428; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
              Voir ma commande
            </a>
          </td>
        </tr>
      </table>
    `),
  }),

  // Newsletter / Marketing email
  newsletter: (data: { email: string; name: string; subject: string; message: string; imageUrl?: string }) => ({
    to: [data.email],
    subject: data.subject,
    html: emailWrapper(`
      <h1 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 28px; color: #4a3428; font-weight: 600; text-align: center;">
        ${data.subject}
      </h1>
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #5c4a42;">
        Bonjour ${data.name},
      </p>
      ${data.imageUrl ? `<img src="${data.imageUrl}" alt="Newsletter" style="width: 100%; height: auto; border-radius: 8px; display: block; margin-bottom: 20px;">` : ''}
      <div style="font-size: 16px; line-height: 1.8; color: #5c4a42; white-space: pre-wrap;">${data.message}</div>
      <table role="presentation" style="margin: 30px 0; width: 100%;">
        <tr>
          <td align="center">
            <a href="${SITE_URL}/nos-creations" style="display: inline-block; padding: 14px 40px; background-color: #d4a574; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; box-shadow: 0 2px 8px rgba(212, 165, 116, 0.3);">
              Voir nos créations
            </a>
          </td>
        </tr>
      </table>
    `, true),
  }),
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    if (!type || !templates[type as keyof typeof templates]) {
      return NextResponse.json({ error: "Type d'email invalide" }, { status: 400 })
    }

    const template = templates[type as keyof typeof templates](data)
    
    await mg.messages.create(DOMAIN, {
      from: `D&S Créa'Cakes <${FROM_EMAIL}>`,
      to: template.to,
      subject: template.subject,
      html: template.html,
      "h:Reply-To": (template as { replyTo?: string }).replyTo || FROM_EMAIL,
    })

    // For contact form, also send notification to admin
    if (type === "contact") {
      const adminTemplate = templates.contactAdmin(data)
      await mg.messages.create(DOMAIN, {
        from: `D&S Créa'Cakes <${FROM_EMAIL}>`,
        to: adminTemplate.to,
        subject: adminTemplate.subject,
        html: adminTemplate.html,
        "h:Reply-To": data.email,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Mailgun error:", error)
    return NextResponse.json({ error: "Erreur d'envoi" }, { status: 500 })
  }
}
