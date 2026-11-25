export async function sendForm(
  form: HTMLFormElement,
  key: string | undefined,
  subject: string,
  fallbackEmail: string,
  fallbackBody: string,
  alertUrl?: string,
) {
  if (!key || key.startsWith("YOUR-")) {
    window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fallbackBody)}`;
    return;
  }

  const body = new FormData(form);
  body.append("access_key", key);
  body.append("subject", subject);
  body.append("from_name", "Algorims Website");
  const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success !== true) throw new Error(result.message || "Submission failed");
  if (alertUrl) void sendLeadAlert(body, alertUrl);
}

async function sendLeadAlert(data: FormData, url: string) {
  try {
    const fields = ["page_url", "page_code", "event_id", "name", "company",
      "email", "gst_status", "whatsapp", "industry", "monthly_chats", "consent"];
    const body = Object.fromEntries(fields.map((name) => [name, data.get(name)]));
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
    if (!response.ok) console.warn("Staff alert request failed", response.status);
  } catch {
    console.warn("Staff alert request failed");
  }
}

export function setButtonLoading(button: HTMLButtonElement, loading: boolean) {
  if (loading) {
    button.dataset.idle = button.innerHTML;
    button.disabled = true;
    button.style.opacity = "0.7";
    button.innerHTML = "Sending…";
  } else {
    button.disabled = false;
    button.style.opacity = "";
    button.innerHTML = button.dataset.idle ?? button.innerHTML;
  }
}
