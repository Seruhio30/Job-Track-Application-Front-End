const params = new URLSearchParams(window.location.search);
const token = params.get("token");

const tokenInfo = document.getElementById("tokenInfo");
const msg = document.getElementById("msg");
const form = document.getElementById("resetForm");

if (!token) {
  tokenInfo.textContent = "❌ Token no encontrado en el link.";
  form.style.display = "none";
} else {
  tokenInfo.textContent = "✅ Token detectado. Ingresa tu nueva contraseña.";
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    msg.textContent = "❌ Las contraseñas no coinciden.";
    return;
  }

  msg.textContent = "Procesando...";

  try {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword })
    });

    const text = await res.text();

    if (!res.ok) {
      msg.textContent = "❌ " + text;
      return;
    }

    msg.textContent = "✅ Contraseña actualizada. Redirigiendo a login...";
    setTimeout(() => window.location.href = "index.html", 1200);

  } catch (err) {
    console.error(err);
    msg.textContent = "❌ No se pudo conectar al servidor.";
  }
});
