function guardarCategoria() {

    var nombre = document.getElementById("nombreCategoria").value;

    if (nombre === "") {
        alert("Por favor escribe el nombre de la categoría");
        return;
    }

    alert("Categoría guardada correctamente");

    document.getElementById("nombreCategoria").value = "";
    document.getElementById("imagenCategoria").value = "";
}

function limpiarFormulario() {

    document.getElementById("nombreCategoria").value = "";
    document.getElementById("imagenCategoria").value = "";

}