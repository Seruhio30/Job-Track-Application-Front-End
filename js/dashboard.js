const API_URL = "http://localhost:8080";

const token = localStorage.getItem("token");

// Si no hay sesión → fuera
if (!token) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "index.html";
}



// Obtener usuario del localStorage
const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.id;

// BOTÓN DE CERRAR SESIÓN
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
});

// CARGAR APLICACIONES DEL USUARIO (desde el token)
async function loadApplications() {
    try {
        //para prubas
        //console.log(" Token usado:", token);
        //console.log(" URL llamada:", `${API_URL}/api/applications`);

        const res = await fetch(`${API_URL}/api/applications`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

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

// RENDERIZAR LAS CARDS
function renderApplications(apps) {
    const container = document.getElementById("appList");
    container.innerHTML = "";

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
        //ALERTA Follow-up
        if (app.nextFollowUpDate && new Date(app.nextFollowUpDate) <= new Date()) {
            card.classList.add("alert-followup");
        }
         // ALERTA Entrevista próxima (< 24 horas)
        if (app.interviewDate) {
            const diff = new Date(app.interviewDate) - new Date();
            if (diff < 24 * 60 * 60 * 1000) {
                card.classList.add("alert-interview");
            }
        }

        card.innerHTML = `
            <h3>${app.company}</h3>
      <p><strong>Puesto:</strong> ${app.position}</p>
      <p><strong>Estado:</strong> ${app.status}</p>
      <p><strong>Contacto:</strong> ${app.contactName || "N/A"}</p>
      <p><strong>Email:</strong> ${app.contactEmail || "N/A"}</p>
      <p><strong>Aplicado el:</strong> ${app.applicationDate ? app.applicationDate.split("T")[0] : "N/A"}</p>
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


    // Eventos para EDITAR
    document.querySelectorAll(".edit-btn").forEach(btn =>
        btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            window.location.href = `edit-application.html?id=${id}`;
        })
    );

    // Eventos para ELIMINAR
    document.querySelectorAll(".delete-btn").forEach(btn =>
        btn.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;

            if (confirm("¿Seguro que deseas eliminar esta aplicación?")) {
                await deleteApplication(id);
            }
        })
    );
}

// ELIMINAR APLICACIÓN
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

// BOTÓN PARA AGREGAR NUEVA
document.getElementById("addAppBtn").addEventListener("click", () => {
    window.location.href = "add-application.html";
});

// INICIO
loadApplications();
