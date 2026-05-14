const nodemailer = require('nodemailer');

let transporter = null;
let testAccount = null;

const initTransporter = async () => {
  if (transporter) return transporter;

  try {
    testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    return transporter;
  } catch (error) {
    console.error('❌ Failed to create transporter:', error.message);
    throw error;
  }
};

const sendEmail = async (to, subject, html) => {
  try {
    const transport = await initTransporter();

    const info = await transport.sendMail({
      from: '"EventHive" <noreply@eventhive.com>',
      to,
      subject,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('📧 Email preview:', previewUrl);

    return info;
  } catch (error) {
    console.error('❌ sendEmail error:', error.message);
    return null;
  }
};

module.exports = { sendEmail };