import { buildMailtoUrl, isValidEmail, readString, submitToWeb3Forms } from "../../../lib/web3forms";

const SUPPORT_EMAIL = "support@algorims.com";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = readString(formData, "name");
  const company = readString(formData, "company");
  const email = readString(formData, "email");
  const phone = readString(formData, "phone");
  const subjectText = readString(formData, "subject");
  const category = readString(formData, "category");
  const priority = readString(formData, "priority");
  const description = readString(formData, "description");
  const attachment = formData.get("attachment");

  const errors: Record<string, string> = {};
  if (name.length < 2) {
    errors.name = "Please enter your full name";
  }
  if (company.length < 2) {
    errors.company = "Please enter your company name";
  }
  if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email";
  }
  if (subjectText.length < 3) {
    errors.subject = "Please add a subject";
  }
  if (!category) {
    errors.category = "Please select a category";
  }
  if (!priority) {
    errors.priority = "Please select a priority";
  }
  if (description.length < 10) {
    errors.description = "Please describe the issue in a little more detail";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  const subject = `[${priority}] ${category} — ${subjectText}`;
  const body = [
    `Full name: ${name}`,
    `Company: ${company}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    `Category: ${category}`,
    `Priority: ${priority}`,
    "",
    "Description:",
    description,
    "",
    attachment instanceof File && attachment.size > 0
      ? `Attachment to follow: ${attachment.name}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const key = process.env.WEB3FORMS_SUPPORT_KEY;
  if (!key) {
    return Response.json({
      ok: true,
      fallbackMailto: buildMailtoUrl(SUPPORT_EMAIL, subject, body),
    });
  }

  try {
    await submitToWeb3Forms({
      formData,
      key,
      subject,
      fields: [
        "name",
        "company",
        "email",
        "phone",
        "subject",
        "category",
        "priority",
        "description",
      ],
      fileFields: ["attachment"],
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      {
        message: `Sorry — we couldn't submit your ticket just now. Please email ${SUPPORT_EMAIL} directly.`,
      },
      { status: 502 },
    );
  }
}
