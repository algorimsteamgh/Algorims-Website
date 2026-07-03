const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const readString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

export const buildMailtoUrl = (
  email: string,
  subject: string,
  body: string,
) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

type SubmitToWeb3FormsOptions = {
  formData: FormData;
  key: string;
  subject: string;
  fields: string[];
  fileFields?: string[];
};

export async function submitToWeb3Forms({
  formData,
  key,
  subject,
  fields,
  fileFields = [],
}: SubmitToWeb3FormsOptions) {
  const payload = new FormData();

  payload.append("access_key", key);
  payload.append("subject", subject);
  payload.append("from_name", "Algorims Website");

  for (const field of fields) {
    const value = formData.get(field);
    if (typeof value === "string") {
      payload.append(field, value.trim());
    }
  }

  for (const field of fileFields) {
    const value = formData.get(field);
    if (value instanceof File && value.size > 0) {
      payload.append(field, value, value.name);
    }
  }

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    body: payload,
  });
  const json = (await response.json().catch(() => ({}))) as {
    message?: string;
    success?: boolean;
  };

  if (!response.ok || json.success === false) {
    throw new Error(json.message || "Submission failed");
  }
}
