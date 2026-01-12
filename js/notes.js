//import { API_URL } from "./config.js";

const token = localStorage.getItem("token");

if (!token) window.location.href = "index.html";

// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const applicationId = params.get("id");

// Botón volver
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = `edit-application.html?id=${applicationId}`;
});


//   CARGAR NOTAS

async function loadNotes() {
  const list = document.getElementById("notesList");

  const res = await fetch(`${API_URL}/api/notes/application/${applicationId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    list.innerHTML = "No se pudieron cargar las notas";
    return;
  }

  const notes = await res.json();
  list.innerHTML = "";

  if (notes.length === 0) {
    list.innerHTML = "<p>No hay notas aún.</p>";
    return;
  }

  notes.forEach(note => {
    const div = document.createElement("div");
    div.classList.add("note-item");

    div.innerHTML = `
      <p>${note.noteText}</p>
      <small>${new Date(note.createdAt).toLocaleString()}</small>
      <button class="delete-note-btn" data-id="${note.id}">Eliminar</button>
    `;

    list.appendChild(div);
  });

  // eventos de eliminar
  document.querySelectorAll(".delete-note-btn").forEach(btn => {
    btn.addEventListener("click", async e => {
      const id = e.target.dataset.id;

      if (confirm("¿Eliminar esta nota?")) {
        await deleteNote(id);
      }
    });
  });
}

loadNotes();


//   AGREGAR NOTA NUEVA

document.getElementById("noteForm").addEventListener("submit", async e => {
  e.preventDefault();

  const text = document.getElementById("noteText").value;

  if (!text.trim()) {
    alert("La nota no puede estar vacía");
    return;
  }

  const res = await fetch(`${API_URL}/api/notes/application/${applicationId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ noteText: text })
  });

  if (!res.ok) {
    alert("No se pudo guardar la nota");
    return;
  }

  document.getElementById("noteText").value = "";
  loadNotes();
});


//   ELIMINAR NOTA

async function deleteNote(id) {
  const res = await fetch(`${API_URL}/api/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    alert("Error eliminando nota");
    return;
  }

  loadNotes();
}
