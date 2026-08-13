import nodemailer from "nodemailer";
import { EMAIL_CONFIG } from "../config/email";

const transporter = nodemailer.createTransport({
  host: EMAIL_CONFIG.host,
  port: EMAIL_CONFIG.port,
  secure: false,
  auth: {
    user: EMAIL_CONFIG.user,
    pass: EMAIL_CONFIG.pass,
  },
});

// Verify SMTP connection on startup
if (EMAIL_CONFIG.user && EMAIL_CONFIG.pass) {
  transporter.verify()
    .then(() => console.log("[Email] SMTP connection verified successfully"))
    .catch((err) => console.error("[Email] SMTP connection FAILED:", err.message));
} else {
  console.warn("[Email] SMTP credentials not configured — emails will be skipped");
}

/**
 * Send an email. Fire-and-forget: logs errors but never throws.
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  if (!EMAIL_CONFIG.user || !EMAIL_CONFIG.pass) {
    console.warn("[Email] SMTP not configured, skipping email to:", to);
    return false;
  }

  try {
    await transporter.sendMail({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html: wrapInLayout(subject, html),
    });
    console.log(`[Email] Sent "${subject}" to ${to}`);
    return true;
  } catch (error) {
    console.error(`[Email] Failed to send "${subject}" to ${to}:`, error);
    return false;
  }
}

function wrapInLayout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#1a1a2e; padding: 24px 32px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:0.5px;">
                Hotel Sircle
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9fb; padding: 20px 32px; text-align:center; border-top: 1px solid #e8e8ed;">
              <p style="margin:0; font-size:13px; color:#8e8ea0;">
                &copy; ${new Date().getFullYear()} Hotel Sircle. All rights reserved.
              </p>
              <p style="margin:4px 0 0; font-size:12px; color:#b0b0be;">
                This is an automated email. Please do not reply directly.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
