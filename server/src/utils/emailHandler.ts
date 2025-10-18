import nodemailer from "nodemailer";

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const sendInsecure = process.env.EMAIL_INSECURE === "true";
if (sendInsecure) {
  console.warn(
    "WARNING: Email is configured to use insecure connection. This is not recommended for production environments.",
  );
}

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  secure: !sendInsecure,
  port: 25,
  tls: {
    rejectUnauthorized: !sendInsecure,
  },
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

async function sendMail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: EMAIL_USER,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

function sendPasswordResetEmail(to: string, username: string, link: string) {
  return sendMail(
    to,
    "Password reset request for you Larp Calendar account",
    `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      text-align: center;
      margin-bottom: 20px;
    }
    .email-header h1 {
      font-size: 24px;
      color: #333;
    }
    .email-body {
      color: #333;
      line-height: 1.6;
    }
    .email-body a {
      color: #007bff;
      text-decoration: none;
    }
    .email-footer {
      margin-top: 20px;
      font-size: 14px;
      text-align: center;
      color: #999;
    }
    .email-link {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="email-body">
      <p>Hello <strong>${username}</strong>,</p>
      <p>We received a request to reset the password for your <strong>Larp Calendar</strong> account associated with this email address. If you made this request, please click the link below to reset your password:</p>
      <p>
        <a href="${link}" class="email-link">Reset Password</a>
      </p>
      <p>This link will expire in <strong>10 minutes</strong>.</p>
      <p>If you did not request a password reset, you can safely ignore this email. Your account will remain secure, and no changes will be made.</p>
      <p>If you have any questions or need further assistance, feel free to reach out to our support team at <a href="mailto:${EMAIL_USER}">${EMAIL_USER}</a>.</p>
    </div>
    <div class="email-footer">
      <p>Thank you,<br>The Larp Calendar Team</p>
      <p><a href="mailto:${EMAIL_USER}">${EMAIL_USER}</a></p>
    </div>
  </div>
</body>
</html>
`,
  );
}

export { sendPasswordResetEmail };
