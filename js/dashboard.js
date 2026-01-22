/**
 * dashboard.js (o applications-list.js)
 *
 * Rol:
 * - Página principal después de login.
 * - Lista las aplicaciones del usuario autenticado y muestra tarjetas (cards).
 * - Permite navegar a editar, adjuntos, notas y eliminar.
 *
 * Depende de:
 * - `API_URL` definido globalmente (config.js o script previo).
 * - Token JWT en localStorage (key: "token").
 * - Estructura HTML: #appList, #logoutBtn, #addAppBtn.
 *
 * Contrato backend:
 * - GET  /api/applications -> retorna array de aplicaciones del usuario
 * - DELETE /api/applications/{id} -> elimina una aplicación
 *
 * Notas de UI:
 * - Se agregan clases CSS de alerta:
 *   - alert-followup si nextFollowUpDate <= hoy
 *   - alert-interview si interviewDate es en < 24h
 */

// const token = localStorage.getItem("token") define si hay sesión activa
const token = localStorage.getItem("token");

// Guard: si no hay token, regresamos al login para evitar acceso sin sesión
if (!token) {
  alert("Debes iniciar sesión primero.");
  window.location.href = "index.html";
}

// Usuario guardado en login.js (no es estrictamente necesario para listar, porque el backend usa el token)
const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.id; // (solo informativo por ahora)

// Logout: limpia sesión local
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

// Carga aplicaciones protegidas por JWT y delega render
async function loadApplications() {
  try {
    // Debug útil cuando hay problemas de auth/CORS:
    // console.log("Token usado:", token);
    // console.log("URL llamada:", `${API_URL}/api/applications`);

    const res = await fetch(`${API_URL}/api/applications`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    // Si algo falla, leer el texto ayuda a ver el error real del backend
    if (!res.ok) {
      const txt = await res.text();
      console.error("❌ Error backend:", res.status, txt);
      throw new Error("Error al obtener las aplicaciones");
    }

    const apps = await res.json();
    renderApplications(apps);

  } catch (err) {
    console.error(err);
    alert("No se pudieron cargar las aplicaciones");
  }
}

// Renderiza cards y conecta eventos de botones (edit/attach/delete/notes)
function renderApplications(apps) {
  const container = document.getElementById("appList");
  container.innerHTML = "";

  // Estado vacío: mensaje amigable para guiar al usuario
  if (apps.length === 0) {
    container.innerHTML = `
      <p style="font-size:18px; color:#555;">
        Aún no tienes aplicaciones registradas.<br>
        Usa el botón <strong>“Nueva Aplicación”</strong> para comenzar.
      </p>
    `;
    return;
  }

  apps.forEach(app => {
    const card = document.createElement("div");
    card.classList.add("app-card");

    // Regla UI: follow-up vencido o para hoy => resaltar
    if (app.nextFollowUpDate && new Date(app.nextFollowUpDate) <= new Date()) {
      card.classList.add("alert-followup");
    }

    // Regla UI: entrevista en menos de 24h => resaltar
    if (app.interviewDate) {
      const diff = new Date(app.interviewDate) - new Date();
      if (diff < 24 * 60 * 60 * 1000) {
        card.classList.add("alert-interview");
      }
    }

    // Nota: appliedDate viene como string ISO (por eso split("T")[0])
    card.innerHTML = `
      <h3>${app.company}</h3>
      <p><strong>Puesto:</strong> ${app.position}</p>
      <p><strong>Estado:</strong> ${app.status}</p>
      <p><strong>Contacto:</strong> ${app.contactName || "N/A"}</p>
      <p><strong>Email:</strong> ${app.contactEmail || "N/A"}</p>
      <p><strong>Aplicado el:</strong> ${app.appliedDate ? String(app.appliedDate).split("T")[0] : "N/A"}</p>
      <p><strong>Modalidad:</strong> ${app.workMode || "N/A"}</p>

      <div class="card-actions">
        <button class="edit-btn" data-id="${app.id}">Editar</button>
        <button class="attach-btn" data-id="${app.id}">Adjuntos</button>
        <button class="delete-btn" data-id="${app.id}">Eliminar</button>
        <button class="notes-btn" data-id="${app.id}">Notas</button>
      </div>
    `;

    container.appendChild(card);
  });

  // Eventos: navegación a páginas relacionadas usando el id
  document.querySelectorAll(".notes-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = e.target.dataset.id;
      window.location.href = `notes.html?id=${id}`;
    });
  });

  document.querySelectorAll(".attach-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      window.location.href = `edit-attachments.html?id=${id}`;
    });
  });

  document.querySelectorAll(".edit-btn").forEach(btn =>
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      window.location.href = `edit-application.html?id=${id}`;
    })
  );

  // Eliminar: confirma y luego llama DELETE al backend
  document.querySelectorAll(".delete-btn").forEach(btn =>
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (confirm("¿Seguro que deseas eliminar esta aplicación?")) {
        await deleteApplication(id);
      }
    })
  );
}

// DELETE: borra una aplicación por id y recarga lista
async function deleteApplication(id) {
  try {
    const res = await fetch(`${API_URL}/api/applications/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("Error al eliminar");

    alert("Aplicación eliminada correctamente");
    loadApplications();

  } catch (err) {
    console.error(err);
    alert("No se pudo eliminar la aplicación.");
  }
}

// Navega a crear nueva aplicación
document.getElementById("addAppBtn").addEventListener("click", () => {
  window.location.href = "add-application.html";
});

// Inicio: carga al entrar a la página
loadApplications();
