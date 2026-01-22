/**
 * register.js
 *
 * Rol:
 * - Maneja el registro de nuevos usuarios.
 * - Envía nombre, email y password al backend.
 *
 * Flujo general:
 * 1) Usuario envía el formulario de registro.
 * 2) POST /auth/register con los datos.
 * 3) Backend valida y crea el usuario.
 * 4) Redirección al login para iniciar sesión.
 *
 * Suposiciones importantes:
 * - API_URL está definido globalmente.
 * - El backend devuelve mensajes de error como texto plano.
 *
 * Nota para el futuro:
 * - Si el registro falla, revisar endpoint /auth/register y validaciones del backend.
 */


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
