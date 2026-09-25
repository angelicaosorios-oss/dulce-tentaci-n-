# Modelos 3D de los productos

Esta carpeta es donde deben ir los archivos `.glb` reales de cada producto.

Por ahora, cada tarjeta de producto (donde antes iba la imagen, justo encima del
botón "Agregar al carrito") muestra un modelo de muestra temporal (el pato de
glTF-Sample-Assets, alojado en GitHub) solo para que el visor 3D funcione de
extremo a extremo.

## Cómo reemplazar el modelo de muestra por el real

1. Consigue un archivo `.glb` del producto (por ejemplo, en https://poly.pizza o
   https://sketchfab.com, revisando que la licencia permita el uso que le vas a dar).
2. Guárdalo en esta carpeta, idealmente con un nombre por sabor, por ejemplo:

   | Página              | Nombres de archivo sugeridos                                   |
   |----------------------|-----------------------------------------------------------------|
   | `cupcake.html`       | `cupcake-chocolate.glb`, `cupcake-vainilla.glb`, `cupcake-fresa.glb` |
   | `malteada.html`      | `malteada-chocolate.glb`, `malteada-oreo.glb`, `malteada-fresa.glb` |
   | `galletas.html`      | `galleta-chocolate.glb`, `galleta-dinosaurio.glb`, `galleta-oreo.glb` |
   | `Cheesecakes.html`   | `cheesecake-fresa.glb`, `cheesecake-maracuya.glb`, `cheesecake-oreo.glb` |
   | `helados.html`       | `helado-chocolate.glb`, `helado-fresa.glb`, `helado-vainilla.glb` |

   Si prefieres usar un solo modelo genérico por página (en vez de uno por sabor),
   basta con un archivo, por ejemplo `cupcake.glb`.

3. En el archivo `.html` correspondiente, busca cada etiqueta `<model-viewer class="visor-producto" ...>`
   (hay una por cada tarjeta de producto, en el mismo lugar donde antes estaba el `<img>`)
   y cambia su atributo `src` de la URL de muestra a la ruta local, por ejemplo:

   ```html
   <model-viewer class="visor-producto"
       src="modelos3d/cupcake-chocolate.glb"
       alt="Cupcake de chocolate"
       camera-controls auto-rotate ar shadow-intensity="1"></model-viewer>
   ```

4. Si el modelo requiere atribución (licencia CC-BY), agrega el crédito en la
   página correspondiente (por ejemplo, en un `<p>` pequeño debajo de la tarjeta).
