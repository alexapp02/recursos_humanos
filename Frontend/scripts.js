function mostrarDirectorio() {
    const submenu = `
        <h2>Directorio</h2>
        <button onclick="buscarEmpleado()">1. Buscar Datos de un Empleado</button>
        <button onclick="buscarPorArea()">2. Buscar Empleados de un Área</button>
        <div id="opcion-directorio"></div>
    `;
    document.getElementById("submenu").innerHTML = submenu;
    document.getElementById("resultado").innerHTML = ""; // Limpiar resultado
}

function mostrarCumpleaños() {
    const submenu = `
        <h2>Cumpleaños</h2>
        <button onclick="buscarCumpleañosEmpleado()">1. Buscar Cumpleaños de un Empleado</button>
        <button onclick="buscarCumpleañosPorFecha()">2. Buscar Cumpleaños en una Fecha</button>
        <div id="opcion-cumpleaños"></div>
    `;
    document.getElementById("submenu").innerHTML = submenu;
    document.getElementById("resultado").innerHTML = ""; // Limpiar resultado
}

function buscarEmpleado() {
    const formulario = `
        <h3>Buscar Datos de un Empleado</h3>
        <label for="cedula">Cédula:</label>
        <input type="text" id="cedula">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre">
        <button onclick="consultarEmpleado()">Buscar</button>
    `;
    document.getElementById("opcion-directorio").innerHTML = formulario;
}

async function consultarEmpleado() {
    const cedula = document.getElementById("cedula").value.trim();
    const nombre = document.getElementById("nombre").value.trim();

    let url = "http://127.0.0.1:8000/empleado?";
    if (cedula) url += `cedula=${cedula}`;
    if (nombre) url += `${cedula ? "&" : ""}nombre=${nombre}`;

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
    const formulario = `
        <h3>Buscar Empleados de un Área</h3>
        <label for="area">Código de Área:</label>
        <input type="text" id="area">
        <button onclick="consultarPorArea()">Buscar</button>
    `;
    document.getElementById("opcion-directorio").innerHTML = formulario;
}

async function consultarPorArea() {
    const area = document.getElementById("area").value.trim();
    if (!area) {
        alert("Debe ingresar el código de área.");
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

function buscarCumpleañosEmpleado() {
    const formulario = `
        <h3>Buscar Cumpleaños de un Empleado</h3>
        <label for="cedula">Cédula:</label>
        <input type="text" id="cedula">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre">
        <button onclick="consultarCumpleañosEmpleado()">Buscar</button>
    `;
    document.getElementById("opcion-cumpleaños").innerHTML = formulario;
}

async function consultarCumpleañosEmpleado() {
    const cedula = document.getElementById("cedula").value.trim();
    const nombre = document.getElementById("nombre").value.trim();

    let url = "http://127.0.0.1:8000/birthday?";
    if (cedula) url += `cedula=${cedula}`;
    if (nombre) url += `${cedula ? "&" : ""}nombre=${nombre}`;

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
    const formulario = `
        <h3>Buscar Cumpleaños en una Fecha</h3>
        <label for="fecha">Fecha: </label>
        <input type="date" id="fecha">
        <button onclick="consultarCumpleañosPorFecha()">Buscar</button>
    `;
    document.getElementById("opcion-cumpleaños").innerHTML = formulario;
}

async function consultarCumpleañosPorFecha() {
    const fecha = document.getElementById("fecha").value.trim();
    if (!fecha) {
        alert("Debe ingresar una fecha.");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/birthday/empleados?fecha=${fecha}`);
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
