//import { API_URL } from "./config.js";

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
