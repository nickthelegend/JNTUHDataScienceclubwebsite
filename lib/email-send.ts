interface EmailData {
  to: string
  userName: string
  eventName: string
  status: 'ACCEPTED' | 'REJECTED'
  eventDate?: string
  eventLocation?: string
}

export async function sendRegistrationStatusEmail({
  to,
  userName,
  eventName,
  status,
  eventDate,
  eventLocation
}: EmailData) {
  console.log('🔍 DEBUG: Starting email send process')
  console.log('📧 To:', to)
  console.log('👤 User:', userName)
  console.log('🎯 Event:', eventName)
  console.log('📊 Status:', status)

  const subject = `Registration ${status === 'ACCEPTED' ? 'Accepted' : 'Rejected'} for ${eventName}`

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          margin: 20px;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .status {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 14px;
          margin: 20px 0;
        }
        .status.accepted {
          background-color: #dcfce7;
          color: #166534;
        }
        .status.rejected {
          background-color: #fef2f2;
          color: #dc2626;
        }
        .content {
          margin: 20px 0;
        }
        .event-details {
          background-color: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #2563eb;
        }
        .event-details h3 {
          margin-top: 0;
          color: #1e40af;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .contact-info {
          margin: 15px 0;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          padding: 8px 16px;
          background-color: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-size: 14px;
        }
        .social-links a:hover {
          background-color: #1d4ed8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">JNTUH Data Science Club</div>
          <h1>Registration Update</h1>
        </div>

        <div class="status ${status === 'ACCEPTED' ? 'accepted' : 'rejected'}">
          ${status === 'ACCEPTED' ? '✅ Registration Accepted' : '❌ Registration Rejected'}
        </div>

        <div class="content">
          <p>Dear <strong>${userName}</strong>,</p>

          <p>
            ${status === 'ACCEPTED'
              ? 'Congratulations! Your registration for the following event has been accepted.'
              : 'We regret to inform you that your registration for the following event has been rejected.'
            }
          </p>

          <div class="event-details">
            <h3>Event Details</h3>
            <p><strong>Event:</strong> ${eventName}</p>
            ${eventDate ? `<p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>` : ''}
            ${eventLocation ? `<p><strong>Location:</strong> ${eventLocation}</p>` : ''}
          </div>

          ${status === 'ACCEPTED' ? `
            <p>We look forward to seeing you at the event! Please make sure to arrive on time and bring any required materials.</p>

            <p>If you have any questions, feel free to reach out to us.</p>
          ` : `
            <p>We appreciate your interest in our events. We hope to see you at future events organized by the JNTUH Data Science Club.</p>
          `}
        </div>

        <div class="footer">
          <div class="contact-info">
            <p><strong>Contact Us:</strong></p>
            <p>📧 jntuhdatascience@gmail.comn</p>
          </div>

          <div class="social-links">
            <a href="https://www.instagram.com/datascienceclubjntuh/" target="_blank">Instagram</a>
            <a href="https://linkedin.com/company/jntuh-dsc" target="_blank">LinkedIn</a>
            <a href="https://chat.whatsapp.com/JPlO3NzxSBf9LkG9uYspoA" target="_blank">WhatsApp</a>
          </div>

          <p>Stay connected with us for more exciting events!</p>
          <p>&copy; 2024 JNTUH Data Science Club. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  console.log('📤 Preparing to send email...')
  console.log('📧 Email payload:', {
    to: [to],
    subject,
    htmlLength: htmlContent.length
  })

  try {
    console.log('🚀 Calling send-email API...')
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject,
        html: htmlContent,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('❌ API returned error:', data)
      return { success: false, error: data }
    }

    console.log('✅ Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('💥 Exception during email send:', error)
    console.error('💥 Error message:', error.message)
    console.error('💥 Error stack:', error.stack)
    return { success: false, error: error.message || 'Unknown error' }
  }
}