/**
 * edit-application.js
 *
 * Rol:
 * - Pantalla para editar una aplicación existente.
 * - Carga los datos desde el backend usando el id en la URL.
 * - Permite actualizar la información (PUT).
 * - Permite subir archivos asociados a la aplicación.
 *
 * Flujo general:
 * 1) Verifica que exista token (sesión activa).
 * 2) Obtiene el `id` de la aplicación desde los query params.
 * 3) GET /api/applications/{id} → precarga el formulario.
 * 4) PUT /api/applications/{id} → guarda cambios.
 * 5) POST /api/attachments/{id}/upload → sube archivos.
 *
 * Suposiciones importantes:
 * - API_URL está definido globalmente.
 * - El backend valida el token y el id pertenece al usuario.
 * - Las fechas vienen en formato compatible con inputs type="datetime-local".
 *
 * Nota para el futuro:
 * - Si algo falla, revisar primero: token, id en la URL y endpoints.
 */


const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Volver al dashboard
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// ===============================
//  CARGAR DATOS DE LA APLICACIÓN
// ===============================
async function loadApplication() {
  try {
    const res = await fetch(`${API_URL}/api/applications/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("No se pudo cargar la aplicación");

    const app = await res.json();

    // General
    document.getElementById("company").value = app.company;
    document.getElementById("position").value = app.position;
    document.getElementById("location").value = app.location || "";
    document.getElementById("source").value = app.source || "";
    document.getElementById("status").value = app.status;

    // Contacto
    document.getElementById("contactName").value = app.contactName || "";
    document.getElementById("contactEmail").value = app.contactEmail || "";
    document.getElementById("contactPhone").value = app.contactPhone || "";

    // Info extra
    document.getElementById("jobUrl").value = app.jobUrl || "";
    document.getElementById("salary").value = app.salary || "";
    document.getElementById("workMode").value = app.workMode || "";

    // Recordatorios
    document.getElementById("reminderEnabled").checked = app.reminderEnabled;
    document.getElementById("emailReminderEnabled").checked = app.emailReminderEnabled;

    document.getElementById("followUpDays").value = app.followUpDays || 5;

    document.getElementById("nextFollowUpDate").value =
      app.nextFollowUpDate ? app.nextFollowUpDate : "";

    // Entrevista
    document.getElementById("interviewDate").value =
      app.interviewDate ? app.interviewDate.replace(" ", "T") : "";

    document.getElementById("interviewLocation").value =
      app.interviewLocation || "";

    document.getElementById("interviewReminderDays").value =
      app.interviewReminderDays || 1;

    document.getElementById("interviewReminderHours").value =
      app.interviewReminderHours || 2;

  } catch (err) {
    alert("Error cargando la aplicación");
    console.error(err);
  }
}

loadApplication();

// ===============================
//   GUARDAR CAMBIOS (PUT)
// ===============================
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    company: document.getElementById("company").value,
    position: document.getElementById("position").value,
    location: document.getElementById("location").value,
    source: document.getElementById("source").value,
    status: document.getElementById("status").value,

    contactName: document.getElementById("contactName").value,
    contactEmail: document.getElementById("contactEmail").value,
    contactPhone: document.getElementById("contactPhone").value,

    jobUrl: document.getElementById("jobUrl").value,
    salary: document.getElementById("salary").value,
    workMode: document.getElementById("workMode").value,

    // Recordatorios
    reminderEnabled: document.getElementById("reminderEnabled").checked,
    emailReminderEnabled: document.getElementById("emailReminderEnabled").checked,
    followUpDays: parseInt(document.getElementById("followUpDays").value),
    nextFollowUpDate: document.getElementById("nextFollowUpDate").value || null,

    // Entrevista
    interviewDate: document.getElementById("interviewDate").value || null,
    interviewLocation: document.getElementById("interviewLocation").value,
    interviewReminderDays: parseInt(document.getElementById("interviewReminderDays").value),
    interviewReminderHours: parseInt(document.getElementById("interviewReminderHours").value)
  };

  try {
    const res = await fetch(`${API_URL}/api/applications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("No se pudo actualizar");

    alert("✔️ Aplicación actualizada con éxito");
    window.location.href = "dashboard.html";

  } catch (err) {
    alert("❌ Error al actualizar");
    console.error(err);
  }
});

// ===============================
//    SUBIR ARCHIVO
// ===============================
document.getElementById("uploadBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");

  if (!fileInput.files.length) {
    alert("Selecciona un archivo primero");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    const res = await fetch(`${API_URL}/api/attachments/${id}/upload`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });

    if (!res.ok) throw new Error("Error al subir archivo");

    alert("Archivo subido correctamente");

  } catch (err) {
    alert("Error al subir archivo");
    console.error(err);
  }
});

// ===============================
//   VER HISTORIAL
// ===============================
document.getElementById("historyBtn").addEventListener("click", () => {
  window.location.href = `history.html?id=${id}`;
});
