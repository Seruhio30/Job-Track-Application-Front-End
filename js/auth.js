/**
 * login.js
 *
 * Rol:
 * - Maneja el inicio de sesión del usuario.
 * - Envía email y password al backend.
 * - Guarda el token JWT y los datos básicos del usuario en localStorage.
 *
 * Flujo general:
 * 1) Usuario envía el formulario de login.
 * 2) POST /auth/login con credenciales.
 * 3) Backend valida y responde con { token, user }.
 * 4) Se guarda la sesión en localStorage.
 * 5) Redirección al dashboard.
 *
 * Suposiciones:
 * - API_URL apunta al backend correcto.
 * - El backend devuelve un JSON con `token` y `user`.
 * - El dashboard requiere token para funcionar.
 *
 * Nota:
 * - El manejo de sesión del frontend se basa únicamente en localStorage.
 */

console.log("auth.js cargado");


// Log de carga para verificar que API_URL esté disponible
console.log("login cargado", API_URL);
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  console.log("submit capturado");

  e.preventDefault();

  // Capturamos credenciales del formulario
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    // Autenticación: endpoint público (no requiere token)
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    // El backend devuelve el error como texto plano
    if (!response.ok) {
      const err = await response.text();
      alert("Error: " + err);
      return;
    }

    const data = await response.json();

    // Sesión: se guarda el token y el usuario para uso global
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Inicio de sesión exitoso!");
    window.location.href = "dashboard.html";

  } catch (error) {
    // Errores de red, backend caído o CORS
    console.error("Error:", error);
    alert("No se pudo conectar al servidor.");
  }
});
