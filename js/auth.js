//import { API_URL } from "./config.js";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const err = await response.text();
      alert("Error: " + err);
      return;
    }

    const data = await response.json();

    // Guardar token y usuario
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    alert("Inicio de sesión exitoso!");
    window.location.href = "dashboard.html";

  } catch (error) {
    console.error("Error:", error);
    alert("No se pudo conectar al servidor.");
  }
});
