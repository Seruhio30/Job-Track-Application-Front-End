document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgotForm");
  const msg = document.getElementById("msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    if (!email) return;

    msg.textContent = "Enviando...";

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const text = await res.text();

      // Siempre mostramos el mismo mensaje por seguridad
      if (!res.ok) {
        msg.textContent = "❌ " + text;
        return;
      }

      // En beta tu backend devuelve resetLink (solo para pruebas)
      let data;
      try { data = JSON.parse(text); } catch { data = null; }

      msg.innerHTML = "✅ Si el correo existe, se envió un link de recuperación.";

      //msg.textContent = "✅ Si el correo existe, se envió un link de recuperación.";

      if (data?.resetLink) {
        // modo beta: mostrar link clickeable
        const a = document.createElement("a");
        a.href = data.resetLink;
        a.textContent = "Abrir link de recuperación (beta)";
        a.style.display = "block";
        a.style.marginTop = "10px";
        msg.appendChild(document.createElement("br"));
        msg.appendChild(a);
      }

    } catch (err) {
      console.error(err);
      msg.textContent = "❌ No se pudo conectar al servidor.";
    }
  });
});

