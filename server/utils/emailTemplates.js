const ticketConfirmationHTML = (name, eventTitle, eventDate, eventLocation, ticketId, qrCodeBase64) => {
  const formattedDate = new Date(eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#059669;padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:bold;">EventHive</h1>
              <p style="color:#d1fae5;margin:5px 0 0 0;font-size:14px;">Ticket Confirmation</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:30px;">
              <p style="color:#333333;font-size:16px;margin:0 0 20px 0;">Hello ${name},</p>
              <p style="color:#333333;font-size:16px;margin:0 0 30px 0;">Your ticket has been confirmed! Here are your event details:</p>

              <!-- Event Details Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-radius:8px;margin-bottom:30px;">
                <tr>
                  <td style="padding:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:15px;">
                          <span style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px;">EVENT</span>
                          <p style="color:#111827;font-size:18px;font-weight:bold;margin:5px 0 0 0;">${eventTitle}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:15px;border-top:1px solid #e5e7eb;padding-top:15px;">
                          <span style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px;">DATE & TIME</span>
                          <p style="color:#111827;font-size:16px;font-weight:600;margin:5px 0 0 0;">${formattedDate}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border-top:1px solid #e5e7eb;padding-top:15px;">
                          <span style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px;">LOCATION</span>
                          <p style="color:#111827;font-size:16px;font-weight:600;margin:5px 0 0 0;">${eventLocation}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Ticket ID -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ecfdf5;border:1px solid #059669;border-radius:8px;margin-bottom:30px;">
                <tr>
                  <td style="padding:20px;text-align:center;">
                    <span style="color:#059669;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Ticket ID</span>
                    <p style="color:#065f46;font-size:20px;font-weight:bold;margin:5px 0 0 0;">${ticketId}</p>
                  </td>
                </tr>
              </table>

              <!-- QR Code -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:20px 0;">
                    <p style="color:#6b7280;font-size:14px;margin:0 0 15px 0;">Scan this QR code at the event</p>
                    <img src="data:image/png;base64,${qrCodeBase64}" style="width:150px;height:150px" alt="Your ticket QR code" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="color:#6b7280;font-size:12px;margin:0;">This is an automated confirmation. Please keep this email for your records.</p>
              <p style="color:#9ca3af;font-size:12px;margin:10px 0 0 0;">&copy; 2026 EventHive. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

module.exports = { ticketConfirmationHTML };