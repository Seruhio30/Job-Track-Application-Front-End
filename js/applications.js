/**
 * application.js
 *
 * Rol de este archivo:
 * - Proteger el acceso al dashboard (requiere token).
 * - Cargar las aplicaciones del usuario autenticado.
 * - Renderizar una vista simple (cards) con datos básicos.
 *
 * Suposiciones importantes:
 * - El token JWT ya fue guardado en localStorage al hacer login.
 * - API_URL apunta al backend correcto.
 * - El backend valida el token y devuelve solo las apps del usuario.
 *
 * Nota para el futuro:
 * - Si algo deja de cargar, revisar primero:
 *   1) token en localStorage
 *   2) endpoint del fetch
 *   3) estructura del JSON devuelto por el backend
 */

// Guard de sesión: sin token no se puede usar el dashboard
const token = localStorage.getItem("token");

if (!token) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "index.html";
}

// Headers comunes para endpoints protegidos por JWT
const headers = { 
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
};

// Carga y renderiza las aplicaciones del usuario
async function cargarAplicaciones() {
    try {
        const res = await fetch(`${API_URL}/auth/login`,{ headers });
        if (!res.ok) throw new Error("Error al obtener las aplicaciones");

        const apps = await res.json();
        const container = document.getElementById("appList");
        container.innerHTML = "";

        if (apps.length === 0) {
            container.innerHTML = "<p>No tienes aplicaciones registradas aún.</p>";
            return;
        }

        apps
            // Ordenamos por fecha para mostrar las más recientes primero
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .forEach(app => {
                const card = document.createElement("div");
                card.classList.add("app-card");
                card.innerHTML = `
                    <h3>${app.company}</h3>
                    <p><strong>Puesto:</strong> ${app.position}</p>
                    <p><strong>Estado:</strong> ${app.status}</p>
                `;
                container.appendChild(card);
            });
    } catch (err) {
        console.error(err);
        document.getElementById("appList").innerHTML = "<p>Error al cargar las aplicaciones.</p>";
    }
}

// Logout simple: borrar token y volver al login
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

document.getElementById("addAppBtn").addEventListener("click", () => {
    window.location.href = "add-application.html";
});

cargarAplicaciones();


// Botón volver
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = `dashboard.html?id=${applicationId}`;
});