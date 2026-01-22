/**
 * add-application.js
 * Objetivo: tomar los datos del formulario "Agregar aplicación" y enviarlos al backend.
 *
 * Flujo:
 * 1) Espera a que cargue el DOM (para que existan los inputs).
 * 2) Intercepta el submit del form.
 * 3) Valida que haya token (sesión).
 * 4) Construye el objeto appData con los valores del form.
 * 5) POST /api/applications (Authorization: Bearer <token>)
 * 6) Si OK -> redirige a dashboard.
 *
 * Nota importante:
 * - Este archivo depende de IDs exactos en el HTML (company, position, etc).
 *   Si cambias un id en el HTML, hay que actualizarlo aquí.
 * - API_URL debe estar definido (normalmente en config.js).
 */

console.log("add-application.js CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appForm");

  // Si el HTML cambia o se carga otro template, evitamos errores silenciosos.
  if (!form) {
    console.error("❌ No se encontró el formulario #appForm");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Sesión: el backend requiere JWT para crear aplicaciones.
    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ No hay token. Inicia sesión de nuevo.");
      return;
    }

    // Armamos el payload tal como el backend lo espera.
    // Convención usada aquí: si un campo de fecha viene vacío, mandamos null (no string vacío).
    const appData = {
      company: document.getElementById("company").value,
      position: document.getElementById("position").value,
      location: document.getElementById("location").value,
      source: document.getElementById("source").value,
      status: document.getElementById("status").value,

      contactName: document.getElementById("contactName").value,
      contactEmail: document.getElementById("contactEmail").value,
      contactPhone: document.getElementById("contactPhone").value,

      appliedDate: document.getElementById("appliedDate").value || null,

      jobUrl: document.getElementById("jobUrl").value,
      salary: document.getElementById("salary").value,
      workMode: document.getElementById("workMode").value,

      // parseInt: backend espera número. Si este input puede venir vacío, ojo: parseInt("") => NaN.
      // Si te puede pasar, usa: Number(value) || 0  (o null) dependiendo tu backend.
      followUpDays: parseInt(document.getElementById("followUpDays").value),

      nextFollowUpDate: document.getElementById("nextFollowUpDate").value || null,

      interviewDate: document.getElementById("interviewDate").value || null,
      interviewLocation: document.getElementById("interviewLocation").value,

      reminderEnabled: document.getElementById("reminderEnabled").checked,
      emailReminderEnabled: document.getElementById("emailReminderEnabled").checked
    };

    // Debug rápido cuando algo falla en producción/local:
    // console.log("📤 Enviando a /api/applications:", appData);

    let response;
    try {
      response = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(appData)
      });
    } catch (err) {
      // Si cae aquí casi siempre es: backend caído, CORS, o sin internet.
      alert("❌ No se pudo conectar con el servidor.");
      console.error(err);
      return;
    }

    // Leemos texto porque el backend puede devolver errores como texto plano.
    const text = await response.text();

    // console.log("📥 Respuesta:", response.status, text);

    if (!response.ok) {
      // Importante: aquí verás el error real que responde el backend (validación, auth, etc).
      alert("❌ Error API: " + text);
      return;
    }

    alert("✔️ Aplicación guardada!");
    window.location.href = "dashboard.html";
  });
});

// Navegación simple: vuelve al dashboard sin tocar estado.
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});
