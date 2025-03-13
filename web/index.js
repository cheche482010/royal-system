
// Función para cargar contenido dinámicamente según la ruta
function loadPage(route) {
    const content = document.getElementById("app");
    
    import(`./src/${route}/${route}.html`).then(htmlModule => {
        content.innerHTML = htmlModule.default;
        import(`./src/${route}/${route}.js`).then(jsModule => {
            if (jsModule.default) jsModule.default();
        });
        import(`./src/${route}/${route}.scss`);
    }).catch(() => {
        content.innerHTML = "<h1>Página no encontrada</h1>";
    });
}

// Función para manejar la navegación
function navigate(event) {
    event.preventDefault();
    const path = event.target.getAttribute("href");
    window.history.pushState({}, "", path);
    loadPage(path.substring(1) || "home");
}

// Configurar la navegación y la carga inicial
window.addEventListener("popstate", () => {
    loadPage(location.pathname.substring(1) || "home");
});

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", event => {
        if (event.target.tagName === "A") navigate(event);
    });
    loadPage(location.pathname.substring(1) || "home");
});