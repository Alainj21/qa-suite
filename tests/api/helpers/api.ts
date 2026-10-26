import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'node:fs';
import path from 'node:path';

/** Umbral máximo de tiempo de respuesta (ms). Configurable con MAX_RESPONSE_MS. */
export const MAX_MS = Number(process.env.MAX_RESPONSE_MS ?? 2000);

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export function validateSchema(name: 'post' | 'user', data: unknown) {
  const file = path.join(__dirname, '..', 'schemas', `${name}.schema.json`);
  const schema = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const validate = ajv.compile(schema);
  const valid = validate(data) as boolean;
  return { valid, errors: ajv.errorsText(validate.errors) };
}

/** Ejecuta una petición y devuelve la respuesta junto con su duración en ms. */
export async function timed<T>(fn: () => Promise<T>): Promise<{ res: T; ms: number }> {
  const t0 = performance.now();
  const res = await fn();
  return { res, ms: Math.round(performance.now() - t0) };
}
