# Reporte de ejecución

- **Fecha:** 26/10/2026, 4:07:56 p.m.
- **Duración total:** 6.5 s
- **Entorno:** Local

## Resumen

| Proyecto | Total | Pasaron | Fallaron | Flaky | Omitidas |
|---|---|---|---|---|---|
| api | 12 | 12 | 0 | 0 | 0 |
| e2e-chromium | 17 | 17 | 0 | 0 | 0 |
| **Total** | 29 | 29 | 0 | 0 | 0 |

**Tasa de éxito:** 100.0%

## Detalle por caso

| Estado | Proyecto | Caso | Tiempo (ms) |
|---|---|---|---|
| ✅ | api | GET /posts devuelve 200, lista de 100 posts válidos y rápido @smoke | 361 |
| ✅ | api | GET /posts/1 devuelve el post con id 1 y cumple el schema @smoke | 324 |
| ✅ | api | GET /posts?userId=1 filtra por usuario | 280 |
| ✅ | api | GET /posts/9999 devuelve 404 (recurso inexistente) | 318 |
| ✅ | api | POST /posts crea un recurso y devuelve 201 con id asignado @smoke | 337 |
| ✅ | api | PUT /posts/1 reemplaza el recurso y devuelve 200 | 330 |
| ✅ | api | PATCH /posts/1 actualiza parcialmente y devuelve 200 | 416 |
| ✅ | api | DELETE /posts/1 devuelve 200 y cuerpo vacío @smoke | 384 |
| ✅ | api | GET /users devuelve 10 usuarios que cumplen el schema | 306 |
| ✅ | api | GET /users/1 devuelve el usuario Leanne Graham | 224 |
| ✅ | api | GET /users/1/posts devuelve únicamente posts del usuario 1 | 237 |
| ✅ | api | GET /users/9999 devuelve 404 | 225 |
| ✅ | e2e-chromium | flujo completo: agregar 2 productos y finalizar compra @smoke | 2465 |
| ✅ | e2e-chromium | quitar un producto desde el carrito actualiza el contador | 2255 |
| ✅ | e2e-chromium | checkout sin nombre muestra validación | 2313 |
| ✅ | e2e-chromium | checkout sin apellido muestra validación | 2385 |
| ✅ | e2e-chromium | checkout sin código postal muestra validación | 2101 |
| ✅ | e2e-chromium | login válido redirige al inventario @smoke | 1879 |
| ✅ | e2e-chromium | usuario bloqueado ve mensaje de error | 1829 |
| ✅ | e2e-chromium | credenciales inválidas muestran error | 1836 |
| ✅ | e2e-chromium | usuario vacío muestra validación | 1198 |
| ✅ | e2e-chromium | contraseña vacía muestra validación | 1317 |
| ✅ | e2e-chromium | logout regresa a la pantalla de login | 2170 |
| ✅ | e2e-chromium | acceso sin sesión a /inventory.html redirige al login con error | 1350 |
| ✅ | e2e-chromium | el catálogo muestra 6 productos | 1251 |
| ✅ | e2e-chromium | ordenar por precio de menor a mayor | 1258 |
| ✅ | e2e-chromium | ordenar por nombre Z-A | 1394 |
| ✅ | e2e-chromium | abrir detalle de producto y volver al catálogo | 1260 |
| ✅ | e2e-chromium | el ícono del carrito navega a /cart.html | 1033 |
