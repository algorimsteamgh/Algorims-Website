import { buildMailtoUrl, isValidEmail, readString, submitToWeb3Forms } from "../../../lib/web3forms";

const CONTACT_EMAIL = "contactus@algorims.com";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = readString(formData, "name");
  const email = readString(formData, "email");
  const company = readString(formData, "company");
  const service = readString(formData, "service");
  const message = readString(formData, "message");

  const errors: Record<string, string> = {};
  if (name.length < 2) {
    errors.name = "Please enter your name";
  }
  if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email";
  }
  if (!service) {
    errors.service = "Please select a service";
  }
  if (message.length < 10) {
    errors.message = "Please share a few more details";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  const subject = `New enquiry from ${name}${company ? ` (${company})` : ""}${service ? ` — ${service}` : ""}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    service ? `Service: ${service}` : null,
    "",
    "Message:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const key = process.env.WEB3FORMS_CONTACT_KEY;
  if (!key) {
    return Response.json({
      ok: true,
      fallbackMailto: buildMailtoUrl(CONTACT_EMAIL, subject, body),
    });
  }

  try {
    await submitToWeb3Forms({
      formData,
      key,
      subject,
      fields: ["name", "email", "company", "service", "message"],
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      {
        message:
          "Sorry — we couldn't send that just now. Please email contactus@algorims.com directly.",
      },
      { status: 502 },
    );
  }
}
