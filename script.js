let almacenes = {};
let almacenActual = null;
const categorias = ["Objetos", "Armas", "Drogas", "Cargadores"];

function agregarAlmacen() {
    const nombre = document.getElementById("nombreAlmacen").value.trim();
    if (!nombre || almacenes[nombre]) return;

    almacenes[nombre] = {};
    categorias.forEach(cat => almacenes[nombre][cat] = []);

    const lista = document.getElementById("listaAlmacenes");
    const btn = document.createElement("button");
    btn.textContent = nombre;
    btn.onclick = () => seleccionarAlmacen(nombre);
    lista.appendChild(btn);

    document.getElementById("nombreAlmacen").value = "";
}

function seleccionarAlmacen(nombre) {
    almacenActual = nombre;
    document.getElementById("nombreAlmacenActual").textContent = nombre;
    document.getElementById("seccionStock").style.display = "block";
    renderizarStock();
}

function agregarItem() {
    if (!almacenActual) return;

    const nombre = document.getElementById("nombreItem").value.trim();
    const cantidad = parseInt(document.getElementById("cantidadItem").value);
    const precio = parseFloat(document.getElementById("precioItem").value);
    const categoria = document.getElementById("categoriaItem").value;

    if (!nombre || isNaN(cantidad) || isNaN(precio)) return;

    almacenes[almacenActual][categoria].push({ nombre, cantidad, precio });

    document.getElementById("nombreItem").value = "";
    document.getElementById("cantidadItem").value = "";
    document.getElementById("precioItem").value = "";
    renderizarStock();
}

function formatearPrecio(valor) {
    if (valor >= 1e6) return (valor / 1e6).toFixed(2) + " M $";
    if (valor >= 1e3) return (valor / 1e3).toFixed(2) + " K $";
    return valor.toFixed(2) + " $";
}

function eliminarItem(categoria, index) {
    almacenes[almacenActual][categoria].splice(index, 1);
    renderizarStock();
}

function editarItem(categoria, index) {
    const item = almacenes[almacenActual][categoria][index];
    document.getElementById("categoriaItem").value = categoria;
    document.getElementById("nombreItem").value = item.nombre;
    document.getElementById("cantidadItem").value = item.cantidad;
    document.getElementById("precioItem").value = item.precio;

    eliminarItem(categoria, index); // Eliminamos el antiguo, se reemplazará con el nuevo al agregar
}

function renderizarStock() {
    const contenedor = document.getElementById("contenedorCategorias");
    contenedor.innerHTML = "";

    categorias.forEach(categoria => {
        const seccion = document.createElement("details");
        seccion.className = "categoria";

        const resumen = document.createElement("summary");
        resumen.textContent = categoria;
        seccion.appendChild(resumen);

        const tabla = document.createElement("table");
        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const cuerpo = tabla.querySelector("tbody");
        almacenes[almacenActual][categoria].forEach((item, index) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>${formatearPrecio(item.precio)}</td>
                <td>${formatearPrecio(item.precio * item.cantidad)}</td>
                <td>
                    <button onclick="editarItem('${categoria}', ${index})">✏️</button>
                    <button onclick="eliminarItem('${categoria}', ${index})">🗑️</button>
                </td>
            `;
            cuerpo.appendChild(fila);
        });

        seccion.appendChild(tabla);
        contenedor.appendChild(seccion);
    });
}