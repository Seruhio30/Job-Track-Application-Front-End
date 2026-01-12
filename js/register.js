import { API_URL } from "./config.js";

console.log("API_URL =", typeof API_URL, API_URL);

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const text = await res.text();

    if (!res.ok) {
      alert("Error: " + text);
      return;
    }

    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    window.location.href = "index.html";

  } catch (err) {
    console.error(err);
    alert("No se pudo conectar con el servidor");
  }
});
