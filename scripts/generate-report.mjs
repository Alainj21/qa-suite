// Genera docs/REPORTE_EJECUCION.md a partir de results/results.json (reporter JSON de Playwright).
// Uso: npx playwright test && npm run report:md
import fs from 'node:fs';

const INPUT = process.argv[2] ?? 'results/results.json';
const OUTPUT = 'docs/REPORTE_EJECUCION.md';

if (!fs.existsSync(INPUT)) {
  console.error(`No existe ${INPUT}. Ejecuta primero: npx playwright test`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));
const rows = [];

function walk(suite, trail = []) {
  const path = suite.title && !suite.file ? [...trail, suite.title] : trail;
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) {
      const last = t.results.at(-1) ?? {};
      rows.push({
        project: t.projectName,
        file: spec.file,
        title: [...path, spec.title].join(' › '),
        status: t.status, // expected | unexpected | flaky | skipped
        ms: last.duration ?? 0,
        error: last.error?.message?.split('\n')[0] ?? '',
      });
    }
  }
  for (const child of suite.suites ?? []) walk(child, path);
}
data.suites.forEach((s) => walk(s));

const icon = { expected: '✅', unexpected: '❌', flaky: '⚠️', skipped: '⏭️' };
const count = (list, s) => list.filter((r) => r.status === s).length;
const projects = [...new Set(rows.map((r) => r.project))];

let md = `# Reporte de ejecución\n\n`;
md += `- **Fecha:** ${new Date(data.stats.startTime).toLocaleString('es-MX')}\n`;
md += `- **Duración total:** ${(data.stats.duration / 1000).toFixed(1)} s\n`;
md += `- **Entorno:** ${process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'Local'}\n\n`;
md += `## Resumen\n\n| Proyecto | Total | Pasaron | Fallaron | Flaky | Omitidas |\n|---|---|---|---|---|---|\n`;
for (const p of projects) {
  const l = rows.filter((r) => r.project === p);
  md += `| ${p} | ${l.length} | ${count(l, 'expected')} | ${count(l, 'unexpected')} | ${count(l, 'flaky')} | ${count(l, 'skipped')} |\n`;
}
md += `| **Total** | ${rows.length} | ${count(rows, 'expected')} | ${count(rows, 'unexpected')} | ${count(rows, 'flaky')} | ${count(rows, 'skipped')} |\n\n`;
const pass = rows.length ? ((count(rows, 'expected') / rows.length) * 100).toFixed(1) : '0';
md += `**Tasa de éxito:** ${pass}%\n\n## Detalle por caso\n\n| Estado | Proyecto | Caso | Tiempo (ms) |\n|---|---|---|---|\n`;
for (const r of rows) md += `| ${icon[r.status] ?? r.status} | ${r.project} | ${r.title} | ${Math.round(r.ms)} |\n`;
const failed = rows.filter((r) => r.status === 'unexpected');
if (failed.length) {
  md += `\n## Defectos / fallos\n\n`;
  for (const r of failed) md += `- **${r.title}** (${r.project}): ${r.error}\n`;
}
fs.writeFileSync(OUTPUT, md);
console.log(`Reporte generado en ${OUTPUT}`);
