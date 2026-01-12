import { API_URL } from "./config.js";

console.log("add-application.js CARGADO");

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("appForm");

    if (!form) {
        console.error("❌ No se encontró el formulario");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("❌ No hay token. Inicia sesión de nuevo.");
            return;
        }

        const appliedDate = document.getElementById("appliedDate").value;

        const appData = {
            company: document.getElementById("company").value,
            position: document.getElementById("position").value,
            location: document.getElementById("location").value,
            source: document.getElementById("source").value,
            status: document.getElementById("status").value,

            contactName: document.getElementById("contactName").value,
            contactEmail: document.getElementById("contactEmail").value,
            contactPhone: document.getElementById("contactPhone").value,

            appliedDate: appliedDate || null,

            jobUrl: document.getElementById("jobUrl").value,
            salary: document.getElementById("salary").value,
            workMode: document.getElementById("workMode").value,

            followUpDays: parseInt(document.getElementById("followUpDays").value),
            nextFollowUpDate: document.getElementById("nextFollowUpDate").value || null,

            interviewDate: document.getElementById("interviewDate").value || null,
            interviewLocation: document.getElementById("interviewLocation").value,

            reminderEnabled: document.getElementById("reminderEnabled").checked,
            emailReminderEnabled: document.getElementById("emailReminderEnabled").checked
        };

        console.log("📤 Enviando a /api/applications:", appData);

        const response = await fetch(`${API_URL}/api/applications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(appData)
        });

        const text = await response.text();
        console.log("📥 Respuesta:", response.status, text);

        if (!response.ok) {
            alert("❌ Error API: " + text);
            return;
        }

        alert("✔️ Aplicación guardada!");
        window.location.href = "dashboard.html";
    });
});


// Botón volver
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = `dashboard.html`;
});