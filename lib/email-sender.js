// Email Sender - Welcome & Notification Emails
// Uses Nodemailer with SMTP

import nodemailer from 'nodemailer'

// SMTP Configuration (Wedos or other provider)
const getTransporter = () => {
  // Check if SMTP is configured
  if (!process.env.SMTP_HOST) {
    console.log('⚠️ SMTP not configured - emails will be logged to console')
    return null
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

/**
 * Send welcome email after registration
 * @param {Object} clientData - Client information
 * @param {string} clientData.email - Client email
 * @param {string} clientData.firstName - Client first name
 * @param {string} clientData.openclawUrl - OpenClaw dashboard URL
 * @param {string} clientData.trialEndsAt - Trial expiration date
 */
export async function sendWelcomeEmail(clientData) {
  const { email, firstName, openclawUrl, trialEndsAt } = clientData

  const trialDate = new Date(trialEndsAt).toLocaleString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const subject = '🎉 Vítejte v ChciAI.cz - Váš OpenClaw je připravený!'
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 5px; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
    .highlight { color: #667eea; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Vítejte v ChciAI.cz!</h1>
      <p>Váš OpenClaw účet byl úspěšně vytvořen</p>
    </div>
    
    <div class="content">
      <p>Ahoj <strong>${firstName}</strong>,</p>
      
      <p>Děkujeme za registraci! Váš osobní OpenClaw AI agent je připravený k použití.</p>
      
      <div class="info-box">
        <h3>📋 Vaše přihlašovací údaje:</h3>
        <p><strong>Dashboard URL:</strong><br>
        <a href="https://chciai-cz-nextjs.onrender.com/dashboard" style="color: #667eea;">https://chciai-cz-nextjs.onrender.com/dashboard</a></p>
        
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Heslo:</strong> (vaše zvolené heslo při registraci)</p>
      </div>

      <div class="info-box">
        <h3>🤖 Váš OpenClaw Dashboard:</h3>
        <p><strong>URL:</strong><br>
        <a href="${openclawUrl}" style="color: #667eea;">${openclawUrl}</a></p>
        
        <p><em>V ChciAI dashboardu najdete tlačítko "Otevřít OpenClaw Dashboard"</em></p>
      </div>

      <div class="info-box" style="border-left-color: #48bb78;">
        <h3>🎁 24h Trial ZDARMA</h3>
        <p>Váš trial je aktivní do: <span class="highlight">${trialDate}</span></p>
        <p>Po vypršení můžete aktivovat za <strong>499 Kč/měsíc</strong></p>
      </div>

      <center>
        <a href="https://chciai-cz-nextjs.onrender.com/dashboard" class="button">
          Přejít do Dashboardu →
        </a>
      </center>

      <h3>📚 Další kroky:</h3>
      <ol>
        <li>Přihlaste se do ChciAI dashboardu</li>
        <li>Klikněte na "Otevřít OpenClaw Dashboard"</li>
        <li>Nastavte svého AI agenta podle potřeb</li>
        <li>Začněte používat!</li>
      </ol>

      <h3>💬 Potřebujete pomoc?</h3>
      <p>Jsme tu pro vás 24/7:</p>
      <ul>
        <li>📧 Email: <a href="mailto:info@chciai.cz">info@chciai.cz</a></li>
        <li>💬 Chat: Přímo v dashboardu (vpravo dole)</li>
        <li>🤖 AI Asistent: Clawix vám rád pomůže</li>
      </ul>

      <p>Těšíme se na spolupráci!</p>
      <p><strong>Tým ChciAI.cz</strong></p>
    </div>

    <div class="footer">
      <p>ChciAI.cz - OpenClaw AI Agent Hosting</p>
      <p>© 2026 ChciAI.cz | Všechna práva vyhrazena</p>
    </div>
  </div>
</body>
</html>
  `

  const textContent = `
Vítejte v ChciAI.cz!

Ahoj ${firstName},

Děkujeme za registraci! Váš OpenClaw účet byl úspěšně vytvořen.

📋 PŘIHLAŠOVACÍ ÚDAJE:
Dashboard: https://chciai-cz-nextjs.onrender.com/dashboard
Email: ${email}
Heslo: (vaše zvolené heslo)

🤖 VÁŠ OPENCLAW:
URL: ${openclawUrl}

🎁 24H TRIAL ZDARMA:
Trial aktivní do: ${trialDate}
Po vypršení: 499 Kč/měsíc

📚 DALŠÍ KROKY:
1. Přihlaste se do dashboardu
2. Otevřete OpenClaw dashboard
3. Nastavte svého AI agenta
4. Začněte používat!

💬 PODPORA:
Email: info@chciai.cz
Chat: V dashboardu (vpravo dole)

Těšíme se na spolupráci!
Tým ChciAI.cz
  `

  return sendEmail({
    to: email,
    subject,
    html: htmlContent,
    text: textContent,
  })
}

/**
 * Send trial expiring warning (2 hours before expiration)
 */
export async function sendTrialExpiringEmail(clientData) {
  const { email, firstName } = clientData

  const subject = '⏰ Váš Trial končí za 2 hodiny - ChciAI.cz'
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Trial končí za 2 hodiny!</h1>
    </div>
    
    <div class="content">
      <p>Ahoj <strong>${firstName}</strong>,</p>
      
      <p>Váš 24h trial OpenClaw končí <strong>za 2 hodiny</strong>.</p>
      
      <p>Aktivujte účet nyní a pokračujte bez přerušení!</p>
      
      <center>
        <a href="https://chciai-cz-nextjs.onrender.com/dashboard/install" class="button">
          Aktivovat za 499 Kč/měs →
        </a>
      </center>
      
      <p><strong>Co dostanete:</strong></p>
      <ul>
        <li>✅ Neomezený přístup k OpenClaw</li>
        <li>✅ 24/7 AI podpora</li>
        <li>✅ Automatické aktualizace</li>
        <li>✅ Český VPS hosting</li>
      </ul>
      
      <p>Děkujeme,<br><strong>Tým ChciAI.cz</strong></p>
    </div>
  </div>
</body>
</html>
  `

  return sendEmail({
    to: email,
    subject,
    html: htmlContent,
  })
}

/**
 * Send trial expired notification
 */
export async function sendTrialExpiredEmail(clientData) {
  const { email, firstName } = clientData

  const subject = '⚠️ Trial vypršel - Aktivujte účet | ChciAI.cz'
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Trial vypršel</h1>
    </div>
    
    <div class="content">
      <p>Ahoj <strong>${firstName}</strong>,</p>
      
      <p>Váš 24h trial OpenClaw vypršel.</p>
      
      <p>Váš OpenClaw byl pozastaven. Aktivujte účet pro pokračování!</p>
      
      <center>
        <a href="https://chciai-cz-nextjs.onrender.com/dashboard/install" class="button">
          Aktivovat za 499 Kč/měs →
        </a>
      </center>
      
      <p>Děkujeme,<br><strong>Tým ChciAI.cz</strong></p>
    </div>
  </div>
</body>
</html>
  `

  return sendEmail({
    to: email,
    subject,
    html: htmlContent,
  })
}

/**
 * Core email sending function
 */
async function sendEmail({ to, subject, html, text }) {
  try {
    const transporter = getTransporter()

    // If SMTP not configured, log to console
    if (!transporter) {
      console.log('📧 Email (would be sent):')
      console.log(`To: ${to}`)
      console.log(`Subject: ${subject}`)
      console.log(`Text: ${text || 'HTML only'}`)
      return { success: true, message: 'Email logged (SMTP not configured)' }
    }

    const info = await transporter.sendMail({
      from: `"ChciAI.cz" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
    })

    console.log('✅ Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }

  } catch (error) {
    console.error('❌ Email error:', error)
    return { success: false, error: error.message }
  }
}
