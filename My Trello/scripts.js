let filtroActual = 'todas';

// 1. OBTENER ELEMENTOS DEL DOM (El puente entre HTML y JS)
const btnMenuMovil = document.getElementById('btn-menu-movil');
const sidebar = document.getElementById('sidebar');

const modalPerfil = document.getElementById('modal-perfil');
const btnPerfilCabecera = document.getElementById('btn-perfil');
const btnAjustesSidebar = document.getElementById('menu-ajustes');
const btnCerrarPerfil = document.getElementById('btn-cerrar-perfil');

const btnAgregarTarea = document.getElementById('btn-agregar-tarea');
const inputTarea = document.getElementById('input-tarea');
const inputPrioridad = document.getElementById('input-prioridad');
const inputFecha = document.getElementById('input-fecha');
const listaTareas = document.getElementById('lista-tareas');

// 2. ASIGNAR EVENTOS 

// Menú Móvil
btnMenuMovil.addEventListener('click', () => {
    sidebar.classList.toggle('activa');
});

// Mostrar / Ocultar Modal Perfil (Ajustes)
function togglePerfil() {
    modalPerfil.classList.toggle('mostrar');
}
btnPerfilCabecera.addEventListener('click', togglePerfil);
btnAjustesSidebar.addEventListener('click', togglePerfil);
btnCerrarPerfil.addEventListener('click', togglePerfil);

// Calendario en Sidebar
document.getElementById('menu-calendario').addEventListener('click', () => {
    inputFecha.focus();
    if(typeof inputFecha.showPicker === 'function') {
        inputFecha.showPicker();
    }
});

// Estadísticas (Resaltado visual)
document.getElementById('menu-estadisticas').addEventListener('click', () => {
    const caja = document.getElementById('caja-estadisticas');
    caja.classList.add('resaltar');
    setTimeout(() => caja.classList.remove('resaltar'), 1500);
});

// Eventos de Filtros (Menú lateral y Botones centrales)
document.getElementById('menu-todas').addEventListener('click', () => filtrar('todas'));
document.getElementById('menu-pendientes').addEventListener('click', () => filtrar('pendientes'));
document.getElementById('menu-completadas').addEventListener('click', () => filtrar('completadas'));
document.getElementById('btn-filtro-todas').addEventListener('click', () => filtrar('todas'));
document.getElementById('btn-filtro-pendientes').addEventListener('click', () => filtrar('pendientes'));
document.getElementById('btn-filtro-completadas').addEventListener('click', () => filtrar('completadas'));

// 3. LÓGICA DE NEGOCIO (Las funciones que hacen el trabajo)

// Agregar nueva tarea
btnAgregarTarea.addEventListener('click', () => {
    if (inputTarea.value.trim() === '') {
        alert('Por favor, escribe una tarea.');
        return;
    }


    let clasePrioridad = '';
    if (inputPrioridad.value === 'Alta') clasePrioridad = 'prioridad-alta';
    else if (inputPrioridad.value === 'Media') clasePrioridad = 'prioridad-media';
    else clasePrioridad = 'prioridad-baja';

    const fechaTexto = inputFecha.value !== '' ? inputFecha.value : 'Sin fecha';

    // A los botones internos les ponemos clases para identificarlos después (Delegación de eventos)
    const nuevaTareaHTML = `
        <div class="tarea-item">
            <div class="tarea-info">
                <strong>${inputTarea.value}</strong>
                <span class="etiqueta ${clasePrioridad}">${inputPrioridad.value}</span>
                <span class="fecha-texto">📅 ${fechaTexto}</span>
            </div>
            <div class="tarea-acciones">
                <button class="btn btn-accion btn-completar">✓</button>
                <button class="btn btn-accion btn-eliminar">🗑</button>
            </div>
        </div>
    `;

    listaTareas.insertAdjacentHTML('beforeend', nuevaTareaHTML);
    
    inputTarea.value = '';
    inputFecha.value = '';
    actualizarContadores();
    aplicarFiltrosVisibles();
});

// Delegación de Eventos para botones que aún no existían al cargar la página
listaTareas.addEventListener('click', (evento) => {
    // evento.target es el elemento exacto al que el usuario le dio clic
    
    // Si dimos clic en el botón de completar...
    if (evento.target.classList.contains('btn-completar')) {
        const tareaItem = evento.target.closest('.tarea-item');
        tareaItem.classList.toggle('completada');
        actualizarContadores();
        aplicarFiltrosVisibles();
    }
    
    // Si dimos clic en el botón de eliminar...
    if (evento.target.classList.contains('btn-eliminar')) {
        const tareaItem = evento.target.closest('.tarea-item');
        tareaItem.remove();
        actualizarContadores();
    }
});

// Lógica de Contadores y Filtros
function actualizarContadores() {
    const total = document.querySelectorAll('.tarea-item').length;
    const completadas = document.querySelectorAll('.tarea-item.completada').length;
    const pendientes = total - completadas;

    document.getElementById('cont-total').textContent = total;
    document.getElementById('cont-pendientes').textContent = pendientes;
    document.getElementById('cont-completadas').textContent = completadas;
}

function filtrar(tipoFiltro) {
    filtroActual = tipoFiltro;

    // Cambia el diseño visual de los botones de filtro centrales
    document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('activo'));
    document.getElementById('btn-filtro-' + tipoFiltro).classList.add('activo');

    aplicarFiltrosVisibles();
}

function aplicarFiltrosVisibles() {
    const tareas = document.querySelectorAll('.tarea-item');
    
    tareas.forEach(tarea => {
        const estaCompletada = tarea.classList.contains('completada');
        
        if (filtroActual === 'todas') {
            tarea.style.display = 'flex';
        } else if (filtroActual === 'pendientes') {
            tarea.style.display = estaCompletada ? 'none' : 'flex';
        } else if (filtroActual === 'completadas') {
            tarea.style.display = estaCompletada ? 'flex' : 'none';
        }
    });
}