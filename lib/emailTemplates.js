const brand = {
  green: "#12372A",
  gold: "#C6A15B",
  text: "#1f2a24",
  muted: "#66736b",
  border: "#e8ece8",
  background: "#f6f8f6",
  white: "#ffffff",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function emailLayout({ title, previewText, children }) {
  const currentYear = new Date().getFullYear();

  return `
<!doctype html>
<html lang="mk">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0; padding:0; background:${brand.background}; font-family:Arial, Helvetica, sans-serif; color:${brand.text};">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; line-height:1px;">
      ${escapeHtml(previewText)}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; background:${brand.background}; margin:0; padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; max-width:600px; background:${brand.white}; border:1px solid ${brand.border}; border-radius:18px; overflow:hidden;">
            <tr>
              <td style="background:${brand.green}; padding:28px 32px; text-align:left;">
                <div style="font-size:24px; line-height:1.2; font-weight:700; color:${brand.white}; letter-spacing:0;">
                  LinkUp <span style="color:${brand.gold};">Next</span>
                </div>
                <div style="width:54px; height:3px; background:${brand.gold}; border-radius:999px; margin-top:14px;"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 32px 30px;">
                ${children}
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px; background:#fbfcfb; border-top:1px solid ${brand.border};">
                <p style="margin:0 0 8px; font-size:14px; line-height:1.6; color:${brand.muted};">
                  Со почит,<br />
                  Тимот на LinkUp Next
                </p>
                <p style="margin:0; font-size:12px; line-height:1.6; color:#8a958e;">
                  &copy; ${currentYear} LinkUp Next. Оваа порака е испратена автоматски.
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

export function welcomeEmailTemplate({ name }) {
  const safeName = escapeHtml(name);

  return emailLayout({
    title: "Добредојдовте на LinkUp Next",
    previewText: `Здраво ${name}, вашиот профил е успешно креиран.`,
    children: `
      <h1 style="margin:0 0 16px; font-size:28px; line-height:1.25; font-weight:700; color:${brand.green};">
        Добредојдовте, ${safeName}
      </h1>
      <p style="margin:0 0 16px; font-size:16px; line-height:1.7; color:${brand.text};">
        Вашиот профил е успешно креиран на LinkUp Next.
      </p>
      <p style="margin:0; font-size:16px; line-height:1.7; color:${brand.muted};">
        Ви благодариме што се приклучивте. Сега можете да продолжите со користење на платформата и да се поврзете со нови можности.
      </p>
    `,
  });
}

export function resetPasswordEmailTemplate({ resetUrl }) {
  const safeResetUrl = escapeHtml(resetUrl);

  return emailLayout({
    title: "Промена на лозинка",
    previewText: "Користете го линкот за да поставите нова лозинка.",
    children: `
      <h1 style="margin:0 0 16px; font-size:28px; line-height:1.25; font-weight:700; color:${brand.green};">
        Промена на лозинка
      </h1>
      <p style="margin:0 0 24px; font-size:16px; line-height:1.7; color:${brand.text};">
        Добивме барање за промена на лозинката за вашиот LinkUp Next профил. Кликнете на копчето подолу за да поставите нова лозинка.
      </p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
        <tr>
          <td align="center" bgcolor="${brand.gold}" style="border-radius:10px;">
            <a href="${safeResetUrl}" style="display:inline-block; padding:14px 24px; font-size:16px; line-height:1.2; font-weight:700; color:${brand.green}; text-decoration:none; border-radius:10px;">
              Промени лозинка
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 14px; font-size:15px; line-height:1.7; color:${brand.muted};">
        Линкот важи 15 минути.
      </p>
      <p style="margin:0; font-size:13px; line-height:1.6; color:#8a958e; word-break:break-word;">
        Ако копчето не работи, отворете го овој линк во прелистувач: <a href="${safeResetUrl}" style="color:${brand.green}; text-decoration:underline;">${safeResetUrl}</a>
      </p>
    `,
  });
}
