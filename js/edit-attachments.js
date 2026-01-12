//import { API_URL } from "./config.js";

const token = localStorage.getItem("token");

// Obtener ID de la aplicación desde la URL
const params = new URLSearchParams(window.location.search);
const applicationId = params.get("id");

if (!applicationId) {
    console.error("❌ ERROR: No se encontró ID en la URL");
}

// CARGAR ARCHIVOS
async function loadAttachments() {
    try {
        const res = await fetch(`${API_URL}/api/attachments/application/${applicationId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            console.error("No se pudieron cargar los archivos");
            return;
        }

        const files = await res.json();
        const list = document.getElementById("attachmentList");

        list.innerHTML = "";

        if (files.length === 0) {
            list.innerHTML = "<p>No hay archivos adjuntos.</p>";
            return;
        }

        files.forEach(f => {
            const div = document.createElement("div");
            div.innerHTML = `
                <p>     
                    📎 <strong>${f.fileOriginalName}</strong>
                    (${Math.round(f.fileSize / 1024)} KB)

                    <button class="downloadFile" data-id="${f.id}" data-name="${f.fileOriginalName}">
                        Descargar
                    </button>

                    <button class="deleteFile" data-id="${f.id}">
                        Eliminar
                    </button>
                </p>
            `;
            list.appendChild(div);
        });

    } catch (err) {
        console.error(err);
    }
}

// SUBIR ARCHIVO
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("fileInput");

    if (!fileInput.files.length) {
        alert("Selecciona un archivo primero");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const res = await fetch(`${API_URL}/api/attachments/${applicationId}/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
    });

    if (!res.ok) {
        alert("Error al subir archivo");
        return;
    }

    alert("Archivo subido correctamente");
    loadAttachments();
});

// ELIMINAR ARCHIVO
async function deleteFile(fileId) {
    await fetch(`${API_URL}/api/attachments/${fileId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    loadAttachments();
}

// 📌 EVENT DELEGATION PARA DESCARGAR Y ELIMINAR
document.addEventListener("click", async (e) => {
    // Descargar archivo
    if (e.target.classList.contains("downloadFile")) {
        const fileId = e.target.dataset.id;
        const fileName = e.target.dataset.name || "archivo";

        try {
            const res = await fetch(`${API_URL}/api/attachments/download/${fileId}`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) {
                const t = await res.text();
                alert("Error al descargar: " + t);
                return;
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);
            alert("Error al descargar archivo.");
        }
    }

    // Eliminar archivo
    if (e.target.classList.contains("deleteFile")) {
        if (!confirm("¿Eliminar este archivo?")) return;

        const fileId = e.target.dataset.id;
        deleteFile(fileId);
    }
});

// Volver al dashboard
document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

// INICIO
loadAttachments();
