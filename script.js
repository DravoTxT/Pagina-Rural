document.addEventListener("DOMContentLoaded", function() { 
    const clases = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16];
    const semestres = [
        "Primer Semestre", "Tercer Semestre", "Quinto Semestre",
        "Séptimo Semestre", "Noveno Semestre", "Maestría",
        "Doctorado", "Extracurricular", "Fase Pública y Privada"
    ];

    const menu = document.getElementById("menu");

    clases.forEach(clase => {
        let dropdown = document.createElement("div");
        dropdown.classList.add("dropdown");

        let button = document.createElement("button");
        button.classList.add("dropbtn");
        button.innerText = `Clase ${clase}`;

        let submenu = document.createElement("div");
        submenu.classList.add("dropdown-content");

        semestres.forEach(semestre => {
            let link = document.createElement("a");
            link.href = `cursos.html?clase=${clase}&semestre=${semestre.replace(/ /g, "_")}`;
            link.innerText = semestre;
            submenu.appendChild(link);
        });

        dropdown.appendChild(button);
        dropdown.appendChild(submenu);
        menu.appendChild(dropdown);
    });

    // Funcionalidad para copiar al portapapeles sin alerta
    document.querySelectorAll('.copiar-btn').forEach(button => {
        button.addEventListener('click', function() {
            let text = this.parentElement.previousElementSibling.textContent.trim();
            
            navigator.clipboard.writeText(text).then(() => {
                console.log("Texto copiado:", text); // Se copia sin alerta
            }).catch(err => {
                console.error("Error al copiar: ", err);
            });
        });
    });
});
