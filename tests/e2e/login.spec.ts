import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

test.describe('E2E - Login', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.goto();
  });

  test('login válido redirige al inventario @smoke', async ({ page }) => {
    await login.login('standard_user', 'secret_sauce');
    await new InventoryPage(page).expectLoaded();
  });

  test('usuario bloqueado ve mensaje de error', async () => {
    await login.login('locked_out_user', 'secret_sauce');
    await login.expectError('Sorry, this user has been locked out');
  });

  test('credenciales inválidas muestran error', async () => {
    await login.login('standard_user', 'clave_incorrecta');
    await login.expectError('Username and password do not match');
  });

  test('usuario vacío muestra validación', async () => {
    await login.login('', 'secret_sauce');
    await login.expectError('Username is required');
  });

  test('contraseña vacía muestra validación', async () => {
    await login.login('standard_user', '');
    await login.expectError('Password is required');
  });

  test('logout regresa a la pantalla de login', async ({ page }) => {
    await login.login('standard_user', 'secret_sauce');
    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    await inventory.logout();
    await expect(login.loginButton).toBeVisible();
  });
});
