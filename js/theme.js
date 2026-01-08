document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeToggle");

    // cargar preferencia guardada
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        btn.textContent = "☀️";
    }

    btn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const dark = document.body.classList.contains("dark-mode");
        btn.textContent = dark ? "☀️" : "🌙";
        localStorage.setItem("theme", dark ? "dark" : "light");
    });
});
