const transporter = require("../config/mailer");

const getFromAddress = () =>
  `"MyApp" <${process.env.EMAIL_USER || "noreply@myapp.com"}>`;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sendVerificationEmail = async (to, token) => {
  const appBaseUrl =
    process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  const verificationUrl = process.env.VERIFY_EMAIL_URL
    ? new URL(process.env.VERIFY_EMAIL_URL)
    : new URL("/api/auth/verify-email", appBaseUrl);
  verificationUrl.searchParams.set("token", token);
  const verificationLink = verificationUrl.toString();
  const currentYear = new Date().getFullYear();

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: "🔐 ផ្ទៀងផ្ទាត់អ៊ីមែលរបស់អ្នក | MyApp",

    html: `
<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Verify your email</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f5f7fb;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Helvetica,
    Arial,
    sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
  style="background:#f5f7fb; padding:45px 15px;">

  <tr>
    <td align="center">

      <!-- Main Card -->
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
          max-width:580px;
          background:#ffffff;
          border-radius:20px;
          overflow:hidden;
          box-shadow:0 12px 40px rgba(15,23,42,0.08);
        "
      >

        <!-- Top Gradient -->
        <tr>
          <td
            style="
              height:7px;
              background:#6366f1;
              background:linear-gradient(
                90deg,
                #6366f1 0%,
                #7c3aed 50%,
                #a855f7 100%
              );
            "
          ></td>
        </tr>


        <!-- Header -->
        <tr>
          <td align="center" style="padding:42px 35px 20px;">

            <!-- Logo -->
            <div style="
              width:64px;
              height:64px;
              line-height:64px;
              margin:auto;
              background:#eef2ff;
              border-radius:18px;
              font-size:30px;
            ">
              🔐
            </div>

            <h1 style="
              margin:22px 0 8px;
              font-size:25px;
              line-height:1.3;
              color:#111827;
              font-weight:700;
              letter-spacing:-0.5px;
            ">
              ផ្ទៀងផ្ទាត់អ៊ីមែលរបស់អ្នក
            </h1>

            <p style="
              margin:0;
              color:#6b7280;
              font-size:14px;
              line-height:1.6;
            ">
              សូមបញ្ជាក់អ៊ីមែលរបស់អ្នក ដើម្បីបញ្ចប់ការបង្កើតគណនី
            </p>

          </td>
        </tr>


        <!-- Content -->
        <tr>
          <td style="padding:10px 42px 35px;">

            <p style="
              margin:0 0 18px;
              color:#374151;
              font-size:15px;
              line-height:1.8;
            ">
              សួស្តី 👋
            </p>

            <p style="
              margin:0 0 22px;
              color:#4b5563;
              font-size:15px;
              line-height:1.8;
            ">
              អរគុណសម្រាប់ការចុះឈ្មោះជាមួយ
              <strong style="color:#4f46e5;">MyApp</strong>។
              ដើម្បីធានាថាអ៊ីមែលនេះជារបស់អ្នក
              សូមចុចប៊ូតុងខាងក្រោមដើម្បីផ្ទៀងផ្ទាត់។
            </p>


            <!-- CTA Button -->
            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
            >
              <tr>
                <td align="center" style="padding:12px 0 30px;">

                  <a
                    href="${verificationLink}"
                    target="_blank"
                    style="
                      display:inline-block;
                      padding:15px 32px;
                      border-radius:10px;
                      background:#4f46e5;
                      background:linear-gradient(
                        135deg,
                        #6366f1,
                        #7c3aed
                      );
                      color:#ffffff;
                      text-decoration:none;
                      font-size:15px;
                      font-weight:600;
                      box-shadow:
                        0 8px 20px
                        rgba(99,102,241,0.30);
                    "
                  >
                    ✓ &nbsp; ផ្ទៀងផ្ទាត់អ៊ីមែល
                  </a>

                </td>
              </tr>
            </table>


            <!-- Expiration Card -->
            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="
                background:#f8f7ff;
                border:1px solid #e5e7eb;
                border-radius:12px;
              "
            >
              <tr>

                <td
                  width="45"
                  valign="top"
                  style="padding:17px 0 17px 17px;"
                >
                  <div style="
                    width:34px;
                    height:34px;
                    line-height:34px;
                    text-align:center;
                    background:#ede9fe;
                    border-radius:9px;
                    font-size:16px;
                  ">
                    ⏱️
                  </div>
                </td>

                <td style="padding:15px 18px 15px 10px;">

                  <p style="
                    margin:0 0 4px;
                    color:#374151;
                    font-size:13px;
                    font-weight:600;
                  ">
                    តំណភ្ជាប់មានកំណត់ពេល
                  </p>

                  <p style="
                    margin:0;
                    color:#6b7280;
                    font-size:12px;
                    line-height:1.6;
                  ">
                    Link នេះនឹងផុតកំណត់ក្នុងរយៈពេល
                    <strong style="color:#4f46e5;">
                      ១ ម៉ោង
                    </strong>
                    ។
                  </p>

                </td>

              </tr>
            </table>


            <!-- Security Notice -->
            <p style="
              margin:22px 0 0;
              color:#9ca3af;
              font-size:12px;
              line-height:1.7;
              text-align:center;
            ">
              🔒 ប្រសិនបើអ្នកមិនបានស្នើសុំការបង្កើតគណនីនេះ
              អ្នកអាចមិនអើពើនឹងអ៊ីមែលនេះបាន។
            </p>

          </td>
        </tr>


        <!-- Divider -->
        <tr>
          <td style="padding:0 42px;">
            <div style="
              height:1px;
              background:#e5e7eb;
            "></div>
          </td>
        </tr>


        <!-- Fallback Link -->
        <tr>
          <td style="padding:25px 42px 10px;">

            <p style="
              margin:0 0 8px;
              color:#6b7280;
              font-size:12px;
              font-weight:600;
            ">
              ប៊ូតុងមិនដំណើរការ?
            </p>

            <div style="
              background:#f9fafb;
              border:1px solid #e5e7eb;
              border-radius:8px;
              padding:11px 13px;
            ">

              <a
                href="${verificationLink}"
                target="_blank"
                style="
                  color:#6366f1;
                  font-size:11px;
                  line-height:1.5;
                  text-decoration:none;
                  word-break:break-all;
                "
              >
                ${verificationLink}
              </a>

            </div>

          </td>
        </tr>


        <!-- Footer -->
        <tr>
          <td
            align="center"
            style="
              padding:25px 35px 35px;
            "
          >

            <div style="
              width:40px;
              height:1px;
              background:#e5e7eb;
              margin:0 auto 20px;
            "></div>

            <p style="
              margin:0 0 6px;
              color:#6b7280;
              font-size:12px;
              font-weight:600;
            ">
              MyApp
            </p>

            <p style="
              margin:0;
              color:#9ca3af;
              font-size:11px;
              line-height:1.6;
            ">
              Secure Authentication System
              <br>
              © ${currentYear} MyApp. រក្សាសិទ្ធិគ្រប់យ៉ាង។
            </p>

          </td>
        </tr>

      </table>


      <!-- Bottom Text -->
      <p style="
        margin:18px 0 0;
        color:#9ca3af;
        font-size:10px;
        text-align:center;
      ">
        This is an automated message. Please do not reply.
      </p>

    </td>
  </tr>

</table>

</body>
</html>
    `,
  });
};

const sendPasswordResetEmail = async (to, token) => {
  const resetBaseUrl =
    process.env.PASSWORD_RESET_URL ||
    (process.env.CLIENT_URL
      ? `${process.env.CLIENT_URL.replace(/\/$/, "")}/reset-password`
      : null);

  if (!resetBaseUrl) {
    throw new Error("PASSWORD_RESET_URL must be configured before sending email");
  }

  const resetUrl = new URL(resetBaseUrl);
  resetUrl.searchParams.set("token", token);
  const resetLink = resetUrl.toString();

  await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: "Reset your password | MyApp",
    text: `Reset your password using this link: ${resetLink}\n\nThis link expires in 1 hour. If you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <h2 style="color: #2506ad; margin-bottom: 12px;">Reset your password</h2>
        <p style="color: #334155; line-height: 1.6;">Click the button below to choose a new password. This link expires in 1 hour.</p>
        <p style="margin: 24px 0;">
          <a href="${escapeHtml(resetLink)}" style="display: inline-block; padding: 12px 24px; background: #2506ad; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
        </p>
        <p style="color: #64748b; font-size: 13px;">If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

const sendContactNotificationEmail = async ({ sender_name, sender_email, subject, message }) => {
  const recipient = process.env.EMAIL_USER;
  if (!recipient) return;

  const safeName = escapeHtml(sender_name);
  const safeEmail = escapeHtml(sender_email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);

  await transporter.sendMail({
    from: getFromAddress(),
    to: recipient,
    replyTo: sender_email,
    subject: `📬 [Portfolio Contact] ${String(subject).replace(/[\r\n]+/g, " ")} - from ${String(sender_name).replace(/[\r\n]+/g, " ")}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <h2 style="color: #4f46e5; margin-bottom: 16px;">New Contact Message Received</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 120px;">Sender:</td>
            <td style="padding: 8px 0; color: #1e293b;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0; color: #1e293b;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Subject:</td>
            <td style="padding: 8px 0; color: #1e293b;">${safeSubject}</td>
          </tr>
        </table>
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #4f46e5; color: #334155; line-height: 1.6; white-space: pre-wrap;">
${safeMessage}
        </div>
        <p style="margin-top: 24px; font-size: 13px; color: #94a3b8; text-align: center;">
          Sent from your Portfolio Website Contact Form
        </p>
      </div>
    `,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendContactNotificationEmail,
};
