import { test, expect } from '@playwright/test';
import { MAX_MS, timed, validateSchema } from './helpers/api';

test.describe('API /users - lectura y recursos anidados', () => {
  test('GET /users devuelve 10 usuarios que cumplen el schema', async ({ request }) => {
    const { res, ms } = await timed(() => request.get('/users'));
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(10);
    for (const user of body) {
      const { valid, errors } = validateSchema('user', user);
      expect(valid, `usuario ${user.id}: ${errors}`).toBe(true);
    }
    expect(ms).toBeLessThan(MAX_MS);
  });

  test('GET /users/1 devuelve el usuario Leanne Graham', async ({ request }) => {
    const res = await request.get('/users/1');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(1);
    expect(body.username).toBe('Bret');
    const { valid, errors } = validateSchema('user', body);
    expect(valid, errors).toBe(true);
  });

  test('GET /users/1/posts devuelve únicamente posts del usuario 1', async ({ request }) => {
    const res = await request.get('/users/1/posts');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.length).toBeGreaterThan(0);
    expect(body.every((p: { userId: number }) => p.userId === 1)).toBe(true);
  });

  test('GET /users/9999 devuelve 404', async ({ request }) => {
    const res = await request.get('/users/9999');
    expect(res.status()).toBe(404);
  });
});
