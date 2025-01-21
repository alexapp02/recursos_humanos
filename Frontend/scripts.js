// scripts.js
function buscarEmpleado() {
    const template = document.getElementById("template-buscar-Empleado");
    const clone = template.content.cloneNode(true);
    document.getElementById("submenu").innerHTML = ""; // Limpiar contenido previo
    document.getElementById("submenu").appendChild(clone);
    document.getElementById("resultado").innerHTML = "";

    // Mostrar campos inmediatamente basado en el valor actual
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
            document.getElementById("resultado").innerHTML = `
                <h3>Resultado:</h3>
                <pre>${JSON.stringify(data, null, 2)}</pre>
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
            document.getElementById("resultado").innerHTML = `
                <h3>Resultado:</h3>
                <pre>${JSON.stringify(data, null, 2)}</pre>
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
            document.getElementById("resultado").innerHTML = `
                <h3>Resultado:</h3>
                <pre>${JSON.stringify(data, null, 2)}</pre>
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
        const data = await response.json();
        document.getElementById("resultado").innerHTML = `
            <h4 class="text-success">Resultado:</h4>
            <pre>${JSON.stringify(data, null, 2)}</pre>
        `;
    } catch (err) {
        document.getElementById("resultado").innerHTML = `
            <h4 class="text-danger">Error:</h4>
            <p>No se pudo conectar con el servidor.</p>
        `;
    }
}
