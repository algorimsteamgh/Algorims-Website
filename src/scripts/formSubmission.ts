export async function sendForm(
  form: HTMLFormElement,
  key: string | undefined,
  subject: string,
  fallbackEmail: string,
  fallbackBody: string,
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
  if (!response.ok || result.success === false) throw new Error(result.message || "Submission failed");
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
