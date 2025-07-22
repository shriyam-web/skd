const nodemailer = require("nodemailer");
require("dotenv").config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const NOTIFY_RECEIVER = process.env.NOTIFY_RECEIVER;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error("❌ EMAIL_USER or EMAIL_PASS is missing in .env");
}
if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error("❌ EMAIL credentials are missing. Check .env");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (leadData) => {
  const { name, email, phone, propertyType, message } = leadData;

  const adminMailOptions = {
    from: `"SKD Propworld Contact Us Responses" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_RECEIVER,
    subject: `📥 New Contact Us Response from ${name}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 10px; background: #f9f9f9;">
        <h2 style="color: #333; border-bottom: 2px solid #ffc107; padding-bottom: 10px;">New Contact Us Form Submitted</h2>
        
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px;"><strong>👤 Name:</strong></td>
            <td style="padding: 10px;">${name}</td>
          </tr>
          <tr style="background-color: #fff;">
            <td style="padding: 10px;"><strong>📧 Email:</strong></td>
            <td style="padding: 10px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px;"><strong>📱 Phone:</strong></td>
            <td style="padding: 10px;">${phone}</td>
          </tr>
          <tr style="background-color: #fff;">
            <td style="padding: 10px;"><strong>🏠 Property Type:</strong></td>
            <td style="padding: 10px;">${propertyType}</td>
          </tr>
          <tr>
            <td style="padding: 10px;"><strong>📝 Message:</strong></td>
            <td style="padding: 10px;">${message || "N/A"}</td>
          </tr>
        </table>

        <p style="margin-top: 30px; font-size: 14px; color: #777;">📬 Submitted from <strong>SKD Propworld</strong> website</p>
      </div>
    `,
  };

  // 🔔 Confirmation mail to user
  const userMailOptions = {
    from: `"SKD Propworld" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🎉 Thank You for Contacting SKD Propworld!",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ddd; border-radius: 10px; padding: 30px;">
        <h2 style="color: #000;">Thank You, ${name}!</h2>
        <p style="font-size: 16px; color: #333;">
          We’ve received your enquiry regarding <strong>${propertyType}</strong>. Our team will get in touch with you shortly.
        </p>
        <p style="font-size: 15px; color: #555;">
          You contacted us with the following details:
        </p>

        <ul style="list-style-type: none; padding: 0; line-height: 1.6;">
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          ${message ? `<li><strong>Message:</strong> ${message}</li>` : ""}
        </ul>

        <p style="margin-top: 20px; font-size: 15px; color: #444;">
          You’ll hear back from us within 24–48 hours. Meanwhile, feel free to explore more properties on our website.
        </p>

        <a href="https://skdpropworld.com" style="display: inline-block; margin-top: 25px; padding: 12px 24px; background-color: #ffc107; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Visit Website
        </a>

        <p style="margin-top: 30px; font-size: 13px; color: #999;">
          — Team SKD Propworld
        </p>
      </div>
    `,
  };

  // ✅ Send both emails in parallel
  try {
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);
    console.log("✅ Emails sent successfully.");
  } catch (err) {
    console.error("❌ Failed to send emails:", err.message);
  }
};

// 🚀 2. Project Enquiry email
const sendProjectEnquiryEmail = async ({
  name,
  email,
  phone,
  remark,
  projectId,
  projectName,
}) => {
  const adminMailOptions = {
    from: `"SKD Propworld Project Enquiry" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_RECEIVER,
    subject: `📌 New Project Enquiry for ${projectName}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 10px; background: #f9f9f9;">
        <h2 style="color: #333; border-bottom: 2px solid #ffc107; padding-bottom: 10px;">New Project Enquiry</h2>
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tr><td style="padding: 10px;"><strong>👤 Name:</strong></td><td style="padding: 10px;">${name}</td></tr>
          <tr style="background-color: #fff;"><td style="padding: 10px;"><strong>📧 Email:</strong></td><td style="padding: 10px;">${email}</td></tr>
          <tr><td style="padding: 10px;"><strong>📱 Phone:</strong></td><td style="padding: 10px;">${phone}</td></tr>
          <tr style="background-color: #fff;"><td style="padding: 10px;"><strong>🏗️ Project:</strong></td><td style="padding: 10px;">${projectName} (ID: ${projectId})</td></tr>
          <tr><td style="padding: 10px;"><strong>📝 Remark:</strong></td><td style="padding: 10px;">${
            remark || "N/A"
          }</td></tr>
        </table>
        <p style="margin-top: 30px; font-size: 14px; color: #777;">📬 Submitted from <strong>SKD Propworld</strong> project page</p>
      </div>
    `,
  };

  const userMailOptions = {
    from: `"SKD Propworld" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ Your Enquiry for ${projectName} was Received`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ddd; border-radius: 10px; padding: 30px;">
        <h2 style="color: #000;">Hi ${name},</h2>
        <p style="font-size: 16px; color: #333;">
          Thank you for your interest in <strong>${projectName}</strong>! We've received your enquiry and our team will contact you shortly.
        </p>
        <ul style="list-style-type: none; padding: 0; line-height: 1.6;">
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          ${remark ? `<li><strong>Remark:</strong> ${remark}</li>` : ""}
        </ul>
        <a href="https://skdpropworld.com" style="display: inline-block; margin-top: 25px; padding: 12px 24px; background-color: #ffc107; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Visit Website
        </a>
        <p style="margin-top: 30px; font-size: 13px; color: #999;">— Team SKD Propworld</p>
      </div>
    `,
  };

  try {
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);
    console.log("✅ Project enquiry emails sent successfully.");
  } catch (err) {
    console.error("❌ Failed to send project enquiry emails:", err.message);
  }
};

// ✅ Export both
module.exports = {
  sendEmail,
  sendProjectEnquiryEmail,
};
