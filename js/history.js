/**
 * history.js
 *
 * Rol:
 * - Muestra el historial de acciones de una aplicación específica.
 * - Se usa como vista de solo lectura (no modifica datos).
 *
 * Flujo general:
 * 1) Obtiene el `appId` desde los parámetros de la URL.
 * 2) GET /api/history/{appId} → obtiene el historial desde el backend.
 * 3) Renderiza los eventos en orden cronológico.
 * 4) Permite volver a la pantalla de edición de la aplicación.
 *
 * Suposiciones importantes:
 * - API_URL está definido globalmente.
 * - El token JWT existe en localStorage.
 * - El backend valida que el historial pertenezca al usuario autenticado.
 *
 * Nota para el futuro:
 * - Si el historial no carga, revisar token, appId en la URL y endpoint /api/history.
 */


const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const appId = params.get("id");

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = `edit-application.html?id=${appId}`;
});

async function loadHistory() {
  const list = document.getElementById("historyList");

  const res = await fetch(`${API_URL}/api/history/${appId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    list.innerHTML = "Error cargando historial";
    return;
  }

  const data = await res.json();
  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML = "<p>No hay historial aún.</p>";
    return;
  }

  data.forEach(h => {
    const div = document.createElement("div");
    div.classList.add("timeline-item");

    div.innerHTML = `
      <h3>${h.action}</h3>
      <p>${h.detail}</p>
      <small>${new Date(h.createdAt).toLocaleString()}</small>
      <hr>
    `;

    list.appendChild(div);
  });
}

loadHistory();
