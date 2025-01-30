document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("cursos.json");
        const cursos = await response.json();

        const urlParams = new URLSearchParams(window.location.search);
        const claseSeleccionada = urlParams.get("clase");
        const semestreSeleccionado = urlParams.get("semestre");

        if (!claseSeleccionada || !semestreSeleccionado) return;
        
        document.body.classList.add(`clase-${claseSeleccionada}`);

        const mapeoSemestre = {
            primer_semestre: "1",
            tercer_semestre: "3",
            quinto_semestre: "5",
            septimo_semestre: "7",
            noveno_semestre: "9",
            doctorado: "Doctorado",
            maestria: "Maestría",
            fase_publica_y_privada: "Fase Publica y Privada",
            privado: ["Privado Civil", "Privado Industrial"],
            extracurricular: "Extracurricular"
        };
        
        function normalizarTexto(texto) {
            return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        }

        const semestreNormalizado = normalizarTexto(semestreSeleccionado);
        const valoresSemestre = mapeoSemestre[semestreNormalizado];
        
        const cursosFiltrados = cursos.Hoja1.filter(curso => {
            if (!curso.Semestre) return false;
            const semestreJSON = normalizarTexto(String(curso.Semestre).trim());
            const semestreEsperado = normalizarTexto(valoresSemestre);

            if (Array.isArray(valoresSemestre)) {
                return valoresSemestre.some(s => normalizarTexto(s) === semestreJSON);
            }

            return semestreJSON === semestreEsperado;
        });

        const contenedorCursos = document.getElementById("cursos");
        contenedorCursos.innerHTML = "";

        if (cursosFiltrados.length === 0) {
            contenedorCursos.innerHTML = `<p style="color: red; text-align: center;">⚠ No hay cursos disponibles para este semestre.</p>`;
            return;
        }

        const baseRuta = {
            maestria: "downloads/Maestrias",
            doctorado: "downloads/Doctorado",
            fase_publica_y_privada: "downloads/Fasepublicaprivada",
            extracurricular: "downloads/Extracurricular"
        }[semestreNormalizado] || "downloads/Licenciatura";

        const cursosPorPagina = 15;
        let paginaActual = 1;

        function mostrarCursos(pagina) {
            contenedorCursos.innerHTML = "";
            const inicio = (pagina - 1) * cursosPorPagina;
            const fin = inicio + cursosPorPagina;

            const tabla = document.createElement("table");
            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Curso</th>
                        <th>Semestre</th>
                        <th>Nombre Archivo</th>
                        <th>Acción</th>
                        <th>Ruta</th>
                        <th>Copiar Ruta</th>
                    </tr>
                </thead>
                <tbody>
                    ${cursosFiltrados.slice(inicio, fin).map(curso => {
                        const nombreArchivo = `${curso.Curso}, Clase ${claseSeleccionada}, ${curso.Codigo}`;
                        const rutaArchivo = `${baseRuta}/SEM${String(claseSeleccionada).padStart(2, '0')}_CONF_2025_IMPAR/${nombreArchivo}.mp4`;
                        return `
                            <tr>
                                <td>${curso.Codigo}</td>
                                <td>${curso.Curso}</td>
                                <td>${curso.Semestre}</td>
                                <td>${nombreArchivo}</td>
                                <td>
                                    <button class="copiar-boton" data-texto="${nombreArchivo}" style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">
                                        Copiar
                                    </button>
                                </td>
                                <td>${rutaArchivo}</td>
                                <td>
                                    <button class="copiar-boton" data-texto="${rutaArchivo}" style="padding: 5px 10px; background-color: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;">
                                        Copiar
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            `;

            contenedorCursos.appendChild(tabla);
            agregarBotonesCopiar();

            const paginacion = document.createElement("div");
            paginacion.classList.add("paginacion");

            for (let i = 1; i <= Math.ceil(cursosFiltrados.length / cursosPorPagina); i++) {
                const botonPagina = document.createElement("button");
                botonPagina.classList.add("pagina");
                botonPagina.textContent = i;
                if (i === pagina) botonPagina.classList.add("activo");
                botonPagina.addEventListener("click", () => {
                    document.querySelectorAll(".pagina").forEach(btn => btn.classList.remove("activo"));
                    botonPagina.classList.add("activo");
                    mostrarCursos(i);
                });
                paginacion.appendChild(botonPagina);
            }

            contenedorCursos.appendChild(paginacion);

            const botonRetorno = document.createElement("button");
            botonRetorno.textContent = "⬅ Volver al Menú Principal";
            botonRetorno.style.display = "block";
            botonRetorno.style.margin = "20px auto";
            botonRetorno.style.padding = "10px 20px";
            botonRetorno.style.backgroundColor = "#333";
            botonRetorno.style.color = "white";
            botonRetorno.style.border = "none";
            botonRetorno.style.borderRadius = "5px";
            botonRetorno.style.cursor = "pointer";
            botonRetorno.addEventListener("click", () => {
                window.location.href = "index.html";
            });

            contenedorCursos.appendChild(botonRetorno);
        }

        function agregarBotonesCopiar() {
            document.querySelectorAll(".copiar-boton").forEach(boton => {
                boton.addEventListener("click", (e) => {
                    const texto = e.target.getAttribute("data-texto");
                    navigator.clipboard.writeText(texto).then(() => {
                        console.log(`Texto "${texto}" copiado al portapapeles.`);
                    }).catch(err => {
                        console.error("Error al copiar al portapapeles:", err);
                    });
                });
            });
        }

        mostrarCursos(paginaActual);

    } catch (error) {
        console.error("❌ Error cargando los cursos:", error);
    }
});
