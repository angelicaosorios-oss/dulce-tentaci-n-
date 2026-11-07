document

    .getElementById("formProducto")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const nombre =
            document.getElementById("nombre").value;

        const precio =
            document.getElementById("precio").value;

        const categoria =
            document.getElementById("categoria").value;


        alert(
            "Producto guardado correctamente.\n\n" +
            "Producto: " + nombre +
            "\nPrecio: $" + precio +
            "\nCategoría: " + categoria
        );

        window.location.href = "productos.html";

    });