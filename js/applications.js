import { API_URL } from "./config.js";

const token = localStorage.getItem("token");

if (!token) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "index.html";
}

const headers = { 
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
};

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

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});

document.getElementById("addAppBtn").addEventListener("click", () => {
    window.location.href = "add-application.html";
});

cargarAplicaciones();
