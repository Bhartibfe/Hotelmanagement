const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

if (process.env.NODE_ENV === "production" && (!smtpUser || !smtpPass)) {
  console.error(
    "WARNING: SMTP_USER and SMTP_PASS should be set in production for email delivery"
  );
}

export const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  user: smtpUser || "",
  pass: smtpPass || "",
  from: process.env.SMTP_FROM || "Hotel Sircle <hello@hotelsircle.com>",
};
