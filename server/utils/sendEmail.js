const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (leadData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { name, email, phone, propertyType, message } = leadData;

  const mailOptions = {
    from: `"SKD Propworld Lead" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_RECEIVER,
    subject: `🆕 New Lead from ${name}`,
    html: `
      <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; border: 1px solid #eee; padding: 20px; border-radius: 10px; background-color: #fff;">
        <h2 style="color: #000; border-bottom: 2px solid #ffc107; padding-bottom: 10px;">📥 New Lead Submitted</h2>
  
        <p style="font-size: 16px;"><strong>👤 Name:</strong> ${name}</p>
        <p style="font-size: 16px;"><strong>📧 Email:</strong> ${email}</p>
        <p style="font-size: 16px;"><strong>📱 Phone:</strong> ${phone}</p>
        <p style="font-size: 16px;"><strong>🏠 Property Type:</strong> ${propertyType}</p>
        <p style="font-size: 16px;"><strong>📝 Message:</strong><br> ${
          message || "N/A"
        }</p>
  
        <hr style="margin: 20px 0;" />
  
        <p style="font-size: 14px; color: #555;">
          📩 This lead was submitted via the <strong style="color: #000;">SKD Propworld</strong> website.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
