import { test, expect } from '@playwright/test';
import { MAX_MS, timed, validateSchema } from './helpers/api';

test.describe('API /posts - CRUD', () => {
  test('GET /posts devuelve 200, lista de 100 posts válidos y rápido @smoke', async ({ request }) => {
    const { res, ms } = await timed(() => request.get('/posts'));
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(100);
    for (const post of body.slice(0, 10)) {
      const { valid, errors } = validateSchema('post', post);
      expect(valid, errors).toBe(true);
    }
    expect(ms, `tiempo de respuesta ${ms}ms`).toBeLessThan(MAX_MS);
  });

  test('GET /posts/1 devuelve el post con id 1 y cumple el schema @smoke', async ({ request }) => {
    const { res, ms } = await timed(() => request.get('/posts/1'));
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(1);
    const { valid, errors } = validateSchema('post', body);
    expect(valid, errors).toBe(true);
    expect(ms).toBeLessThan(MAX_MS);
  });

  test('GET /posts?userId=1 filtra por usuario', async ({ request }) => {
    const res = await request.get('/posts', { params: { userId: 1 } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.length).toBeGreaterThan(0);
    expect(body.every((p: { userId: number }) => p.userId === 1)).toBe(true);
  });

  test('GET /posts/9999 devuelve 404 (recurso inexistente)', async ({ request }) => {
    const res = await request.get('/posts/9999');
    expect(res.status()).toBe(404);
  });

  test('POST /posts crea un recurso y devuelve 201 con id asignado @smoke', async ({ request }) => {
    const payload = { title: 'Post de prueba', body: 'Contenido de prueba', userId: 1 };
    const { res, ms } = await timed(() => request.post('/posts', { data: payload }));
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject(payload);
    expect(body.id).toBeGreaterThan(100);
    const { valid, errors } = validateSchema('post', body);
    expect(valid, errors).toBe(true);
    expect(ms).toBeLessThan(MAX_MS);
  });

  test('PUT /posts/1 reemplaza el recurso y devuelve 200', async ({ request }) => {
    const payload = { id: 1, title: 'Título actualizado', body: 'Cuerpo actualizado', userId: 1 };
    const { res, ms } = await timed(() => request.put('/posts/1', { data: payload }));
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject(payload);
    const { valid, errors } = validateSchema('post', body);
    expect(valid, errors).toBe(true);
    expect(ms).toBeLessThan(MAX_MS);
  });

  test('PATCH /posts/1 actualiza parcialmente y devuelve 200', async ({ request }) => {
    const res = await request.patch('/posts/1', { data: { title: 'Solo título' } });
    expect(res.status()).toBe(200);
    expect((await res.json()).title).toBe('Solo título');
  });

  test('DELETE /posts/1 devuelve 200 y cuerpo vacío @smoke', async ({ request }) => {
    const { res, ms } = await timed(() => request.delete('/posts/1'));
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({});
    expect(ms).toBeLessThan(MAX_MS);
  });
});
