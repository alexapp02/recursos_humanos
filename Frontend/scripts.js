function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.getElementById('toggle-sidebar');

    // Alternar la clase "hidden" en el sidebar
    sidebar.classList.toggle('hidden');

    // Cambiar el texto del botón según el estado del sidebar
    toggleButton.textContent = sidebar.classList.contains('hidden') ? '▶' : '◀';
}



function buscarEmpleado() {
    // Seleccionar el template
    const template = document.getElementById("template-buscar-empleado");

    // Verificar si el template existe
    if (!template) {
        console.error("No se encontró el template con id 'template-buscar-empleado'.");
        return;
    }

    // Clonar el contenido del template
    const clone = template.content.cloneNode(true);

    // Insertar el contenido en el contenedor
    const submenu = document.getElementById("submenu");
    if (!submenu) {
        console.error("No se encontró el contenedor con id 'submenu'.");
        return;
    }

    submenu.innerHTML = ""; // Limpiar el contenido previo
    submenu.appendChild(clone);

    // Limpiar cualquier resultado previo
    const resultado = document.getElementById("resultado");
    if (resultado) {
        resultado.innerHTML = "";
    }

    // Mostrar el campo de búsqueda por defecto (cédula)
    mostrarCamposBusqueda();
}


function mostrarCamposBusqueda() {
    const criterio = document.getElementById("criterio").value;
    const campoBusqueda = document.getElementById("campo-busqueda");
    let campoHTML = "";

    if (criterio === "cedula") {
        campoHTML = `
            <label for="cedula">Cédula:</label>
            <input type="text" id="cedula" class="form-control" placeholder="Ingrese la cédula">
        `;
    } else if (criterio === "nombre") {
        campoHTML = `
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" class="form-control" placeholder="Ingrese el nombre">
        `;
    }

    campoBusqueda.innerHTML = campoHTML;
}

async function consultarEmpleado() {
    const criterio = document.getElementById("criterio").value;
    let url = "http://127.0.0.1:8000/empleado?";

    if (criterio === "cedula") {
        const cedula = document.getElementById("cedula").value.trim();
        if (!cedula) {
            alert("Debe ingresar la cédula.");
            return;
        }
        url += `cedula=${cedula}`;
    } else if (criterio === "nombre") {
        const nombre = document.getElementById("nombre").value.trim();
        if (!nombre) {
            alert("Debe ingresar el nombre.");
            return;
        }
        url += `nombre=${nombre}`;
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            mostrarTabla([data], "resultado"); // Mostrar un solo resultado en tabla
        } else {
            const error = await response.json();
            document.getElementById("resultado").innerHTML = `
                <h3>Error:</h3>
                <p>${error.detail}</p>
            `;
        }
    } catch (err) {
        document.getElementById("resultado").innerHTML = `
            <h3>Error:</h3>
            <p>No se pudo conectar con el servidor.</p>
        `;
    }
}

function buscarPorArea() {
    const template = document.getElementById("template-buscar-area");
    const clone = template.content.cloneNode(true);

    const areas = [
        { codigo: '00', nombre: 'PRESIDENCIA' },
        { codigo: '01', nombre: 'GER. COMERCIAL' },
        { codigo: '02', nombre: 'GER. FINANCIERA' },
        { codigo: '03', nombre: 'GER. RRHH' },
        { codigo: '0101', nombre: 'SUBG. COMERCIO EXTERIOR' },
        { codigo: '0102', nombre: 'SUBG. COMERCIO NACIONAL' },
        { codigo: '010101', nombre: 'ALIMENTOS EXT.' },
        { codigo: '010102', nombre: 'CONFECCIONES EXT.' },
        { codigo: '010103', nombre: 'JUGUETERIA EXT' },
        { codigo: '010201', nombre: 'ALIMENTOS NAC.' },
        { codigo: '010202', nombre: 'CONFECCIONES NAC.' },
        { codigo: '010203', nombre: 'JUGUETERIA NAC.' },
    ];

    const select = clone.querySelector("#area");
    areas.forEach(area => {
        const option = document.createElement("option");
        option.value = area.codigo;
        option.textContent = area.nombre;
        select.appendChild(option);
    });

    document.getElementById("submenu").innerHTML = ""; // Limpiar contenido previo
    document.getElementById("submenu").appendChild(clone);
}

async function consultarPorArea() {
    const area = document.getElementById("area").value.trim();
    if (!area) {
        alert("Debe seleccionar un área.");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/empleados/dependencia?dependencia_codigo=${area}`);
        if (response.ok) {
            const data = await response.json();
            mostrarTabla(data, "resultado"); // Mostrar lista de resultados en tabla
        } else {
            const error = await response.json();
            document.getElementById("resultado").innerHTML = `
                <h3>Error:</h3>
                <p>${error.detail}</p>
            `;
        }
    } catch (err) {
        document.getElementById("resultado").innerHTML = `
            <h3>Error:</h3>
            <p>No se pudo conectar con el servidor.</p>
        `;
    }
}


function mostrarCumpleaños() {
    const template = document.getElementById("template-buscar-cumpleanos");
    const clone = template.content.cloneNode(true);
    document.getElementById("submenu").innerHTML = "";
    document.getElementById("submenu").appendChild(clone);
    document.getElementById("resultado").innerHTML = "";

    // Mostrar campos inmediatamente basado en el valor actual
    mostrarCamposCumpleBusqueda();
}

function mostrarCamposCumpleBusqueda() {
    const criterioCumple = document.getElementById("criterioCumple").value;
    const campoBusqueda = document.getElementById("campo-cumple-busqueda");
    let campoHTML = "";

    if (criterioCumple === "cedula") {
        campoHTML = `
            <label for="cedulaCumple">Cédula:</label>
            <input type="text" id="cedulaCumple" class="form-control" placeholder="Ingrese la cédula">
        `;
    } else if (criterioCumple === "nombre") {
        campoHTML = `
            <label for="nombreCumple">Nombre:</label>
            <input type="text" id="nombreCumple" class="form-control" placeholder="Ingrese el nombre">
        `;
    }

    campoBusqueda.innerHTML = campoHTML;
}

async function consultarCumpleañosEmpleado() {
    const criterioCumple = document.getElementById("criterioCumple").value;
    let url = "http://127.0.0.1:8000/birthday?";

    if (criterioCumple === "cedula") {
        const cedulaCumple = document.getElementById("cedulaCumple").value.trim();
        if (!cedulaCumple) {
            alert("Debe ingresar la cédula.");
            return;
        }
        url += `cedula=${cedulaCumple}`;
    } else if (criterioCumple === "nombre") {
        const nombreCumple = document.getElementById("nombreCumple").value.trim();
        if (!nombreCumple) {
            alert("Debe ingresar el nombre.");
            return;
        }
        url += `nombre=${nombreCumple}`;
    }

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();

            // Obtener la fecha de nacimiento y reemplazar el año por el actual
            const fechaNacimientoOriginal = new Date(data.fecha_nacimiento);
            const hoy = new Date();
            const añoActual = hoy.getFullYear();
            const fechaCumpleañosEsteAño = new Date(
                añoActual,
                fechaNacimientoOriginal.getMonth(),
                fechaNacimientoOriginal.getDate()
            );

            // Calcular la edad
            const edad = añoActual - fechaNacimientoOriginal.getFullYear();
            const cumpleHoy =
                hoy.getMonth() === fechaCumpleañosEsteAño.getMonth() &&
                hoy.getDate() === fechaCumpleañosEsteAño.getDate();

            // Crear el mensaje de cumpleaños
            const mensajeCumpleaños = cumpleHoy
                ? `🎉 ¡Feliz cumpleaños! Hoy celebramos tu día especial. 🎂`
                : `Tu cumpleaños es el ${fechaCumpleañosEsteAño.toLocaleDateString("es-ES")}.`;

            // Mostrar la tarjeta de cumpleaños
            document.getElementById("resultado").innerHTML = `
                <div class="birthday-card">
                    <img src="cake.png" alt="Torta de cumpleaños" class="cake-img">
                    <h2>🎉 ¡Feliz Cumpleaños, ${data.nombre}! 🎉</h2>
                    <p>${mensajeCumpleaños}</p>
                    <p>🎂 Edad: ${edad} años</p>
                </div>
            `;
        } else {
            const error = await response.json();
            document.getElementById("resultado").innerHTML = `
                <h3>Error:</h3>
                <p>${error.detail}</p>
            `;
        }
    } catch (err) {
        document.getElementById("resultado").innerHTML = `
            <h3>Error:</h3>
            <p>No se pudo conectar con el servidor.</p>
        `;
    }
}

function buscarCumpleañosPorFecha() {
    const template = document.getElementById("template-buscar-cumpleanos-fecha");
    const clone = template.content.cloneNode(true);
    document.getElementById("submenu").innerHTML = "";
    document.getElementById("submenu").appendChild(clone);
}

async function consultarCumpleañosPorFecha() {
    const fecha = document.getElementById("fechaCumple").value.trim();
    if (!fecha) {
        alert("Debe ingresar una fecha.");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/birthday/empleados?fecha=${fecha}`);
        if (response.ok) {
            const data = await response.json();
            mostrarTabla(data, "resultado"); // Mostrar cumpleaños en tabla
        } else {
            const error = await response.json();
            document.getElementById("resultado").innerHTML = `
                <h4>Error:</h4>
                <p>${error.detail}</p>
            `;
        }
    } catch (err) {
        document.getElementById("resultado").innerHTML = `
            <h4>Error:</h4>
            <p>No se pudo conectar con el servidor.</p>
        `;
    }
}


function mostrarTabla(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Limpiar el contenido previo

    if (data.length === 0) {
        container.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-bordered'); // Estilo Bootstrap

    const headers = Object.keys(data[0]);

    // Crear encabezados
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Crear filas
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.appendChild(table);
}
