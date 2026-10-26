# QA Suite: API + E2E

Suite automatizada con **Playwright (TypeScript)**:
- **API** contra [JSONPlaceholder](https://jsonplaceholder.typicode.com): GET/POST/PUT/PATCH/DELETE, status, JSON Schema (Ajv) y tiempos de respuesta.
- **E2E** contra [SauceDemo](https://www.saucedemo.com): login, navegación y checkout (Page Object Model).
- **CI** en GitHub Actions con reporte **Allure**, reporte HTML y notificación.

## Requisitos
Node.js 20+ (y Java 11+ solo para ver el reporte Allure en local).

## Uso
```bash
npm ci
npx playwright install chromium

npm test              # todo
npm run test:api      # solo API
npm run test:e2e      # solo E2E

npm run report:allure # genera y abre Allure
npm run report:html   # reporte HTML de Playwright
npm run report:md     # genera docs/REPORTE_EJECUCION.md
```

## Variables de entorno
| Variable | Default |
|---|---|
| `API_URL` | `https://jsonplaceholder.typicode.com` |
| `WEB_URL` | `https://www.saucedemo.com` |
| `MAX_RESPONSE_MS` | `2000` |

## Estructura
```
.github/workflows/ci.yml   pipeline
docs/PLAN_DE_PRUEBAS.md    plan de pruebas
docs/REPORTE_EJECUCION.md  reporte (generado)
scripts/generate-report.mjs
tests/api/                 specs + schemas + helpers
tests/e2e/                 specs + pages (POM)
```

## Pipeline
En cada `push`/`pull_request`: `api-tests` ∥ `e2e-tests` → `report` (Allure, artefacto + GitHub Pages en `main`) → `notify` (resumen en la corrida y Slack si existe el secret `SLACK_WEBHOOK_URL`).
Para Pages: *Settings → Pages → Source: GitHub Actions*.
