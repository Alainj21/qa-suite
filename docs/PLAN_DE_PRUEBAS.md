# Plan de pruebas

## 1. Introducción
Plan de pruebas para validar (a) la API pública **JSONPlaceholder** y (b) la aplicación web de demostración **SauceDemo**, con automatización integrada en un pipeline de CI/CD.

## 2. Alcance

**Dentro del alcance**
| Área | Funcionalidad |
|---|---|
| API `/posts` | GET (lista, por id, filtro, 404), POST, PUT, PATCH, DELETE |
| API `/users` | GET (lista, por id, recurso anidado `/users/{id}/posts`, 404) |
| Validaciones API | Código de estado, esquema JSON (Ajv), cabecera `Content-Type`, tiempo de respuesta (< 2000 ms) |
| E2E login | Login válido, usuario bloqueado, credenciales inválidas, campos vacíos, logout |
| E2E navegación | Catálogo, ordenamiento, detalle de producto, carrito, acceso sin sesión |
| E2E checkout | Flujo completo, cálculo de subtotal/impuesto/total, validación de formulario, quitar producto |

**Fuera del alcance:** pruebas de carga/estrés, seguridad, accesibilidad, multi-navegador/mobile, usuarios `problem_user` y `performance_glitch_user`.

**Nota:** JSONPlaceholder simula las escrituras: POST/PUT/PATCH/DELETE devuelven respuestas correctas pero **no persisten** los datos, por lo que no se verifica persistencia con un GET posterior.

## 3. Estrategia y niveles de prueba
- **Pruebas de API (componente/integración):** verifican contrato (schema), códigos y rendimiento.
- **Pruebas E2E (sistema):** simulan al usuario con el patrón Page Object Model.
- **Humo (`@smoke`):** subconjunto crítico para validación rápida.
- Técnicas: partición de equivalencia (usuarios válidos/ inválidos/ bloqueados), análisis de valores límite (campos vacíos), pruebas negativas (404, validaciones).

## 4. Ambientes
| Ambiente | Detalle |
|---|---|
| API bajo prueba | `https://jsonplaceholder.typicode.com` (variable `API_URL`) |
| Web bajo prueba | `https://www.saucedemo.com` (variable `WEB_URL`) |
| Local | Node.js 20+, Chromium vía Playwright |
| CI | GitHub Actions, `ubuntu-latest`, Node 20, Java 17 (solo para Allure) |
| Datos de prueba | `standard_user` / `locked_out_user`, contraseña `secret_sauce` (públicos del demo) |

## 5. Herramientas
| Herramienta | Uso |
|---|---|
| Playwright Test (TypeScript) | Pruebas API (`request`) y E2E |
| Ajv + ajv-formats | Validación de JSON Schema |
| Allure Report | Reporte principal con historial y adjuntos |
| Reporte HTML de Playwright | Reporte alterno con traza |
| GitHub Actions | Ejecución en cada push, artefactos, notificación |
| Slack Webhook (opcional) | Notificación externa del resultado |

## 6. Criterios
**Criterios de entrada**
1. Código fuente en la rama y `npm ci` exitoso.
2. Ambientes API y web accesibles (HTTP 200 en la raíz).
3. Navegador Chromium instalado.
4. Datos de prueba disponibles.

**Criterios de salida**
1. 100 % de los casos `@smoke` aprobados.
2. ≥ 95 % de todos los casos aprobados.
3. Cero defectos críticos/altos abiertos.
4. Tiempo de respuesta de API < 2000 ms en todos los casos.
5. Reporte Allure generado y publicado como artefacto.

**Criterios de suspensión:** indisponibilidad del ambiente bajo prueba o fallo en la instalación de dependencias. **Reanudación:** al restablecerse el ambiente.

## 7. Matriz de casos
| ID | Tipo | Caso | Resultado esperado |
|---|---|---|---|
| API-01 | GET | Listar `/posts` | 200, 100 elementos, schema válido, < 2 s |
| API-02 | GET | `/posts/1` | 200, `id` = 1, schema válido |
| API-03 | GET | `/posts?userId=1` | 200, todos con `userId` = 1 |
| API-04 | GET | `/posts/9999` | 404 |
| API-05 | POST | Crear post | 201, eco del payload, `id` > 100 |
| API-06 | PUT | Reemplazar `/posts/1` | 200, payload reflejado |
| API-07 | PATCH | Actualizar título | 200, título modificado |
| API-08 | DELETE | Borrar `/posts/1` | 200, cuerpo `{}` |
| API-09 | GET | Listar `/users` | 200, 10 usuarios, schema válido |
| API-10 | GET | `/users/1` | 200, `username` = Bret |
| API-11 | GET | `/users/1/posts` | 200, posts del usuario 1 |
| API-12 | GET | `/users/9999` | 404 |
| E2E-01 | Login | Credenciales válidas | Redirige a inventario |
| E2E-02 | Login | Usuario bloqueado | Mensaje de bloqueo |
| E2E-03 | Login | Contraseña incorrecta | Mensaje de error |
| E2E-04/05 | Login | Usuario/contraseña vacíos | Mensaje de campo requerido |
| E2E-06 | Login | Logout | Regresa al login |
| E2E-07 | Nav | Acceso sin sesión | Redirige con error |
| E2E-08 | Nav | Catálogo | 6 productos |
| E2E-09/10 | Nav | Ordenar precio / nombre | Orden correcto |
| E2E-11 | Nav | Detalle y regreso | Navegación correcta |
| E2E-12 | Nav | Ícono de carrito | `/cart.html` |
| E2E-13 | Checkout | Flujo completo (2 productos) | Mensaje "Thank you for your order!" y totales correctos |
| E2E-14 | Checkout | Quitar producto | Carrito con 1 ítem |
| E2E-15/16/17 | Checkout | Nombre/apellido/CP vacío | Mensaje de validación |

## 8. Riesgos
| Riesgo | Mitigación |
|---|---|
| Servicios públicos caídos o con rate-limit | Reintento en CI (`retries: 1`), umbral de tiempo configurable |
| Cambios en el DOM del demo | Locators por `data-test` y Page Objects centralizados |
| Pruebas inestables (flaky) | Auto-espera de Playwright, aserciones web-first, trazas en fallos |
| Datos simulados que no persisten | Validar la respuesta de la API, no el estado posterior |

## 9. Entregables
Código fuente, este plan, reporte Allure/HTML (artefactos de CI), `docs/REPORTE_EJECUCION.md`, evidencias (traza, video y captura) en fallos.
