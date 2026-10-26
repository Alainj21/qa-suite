import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';

test.describe('E2E - Navegación', () => {
  test('acceso sin sesión a /inventory.html redirige al login con error', async ({ page }) => {
    await page.goto('/inventory.html');
    const login = new LoginPage(page);
    await expect(login.loginButton).toBeVisible();
    await login.expectError('You can only access');
  });

  test.describe('con sesión iniciada', () => {
    let inventory: InventoryPage;

    test.beforeEach(async ({ page }) => {
      const login = new LoginPage(page);
      await login.goto();
      await login.login('standard_user', 'secret_sauce');
      inventory = new InventoryPage(page);
      await inventory.expectLoaded();
    });

    test('el catálogo muestra 6 productos', async () => {
      await expect(inventory.items).toHaveCount(6);
    });

    test('ordenar por precio de menor a mayor', async () => {
      await inventory.sortBy('lohi');
      const prices = await inventory.prices();
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    test('ordenar por nombre Z-A', async () => {
      await inventory.sortBy('za');
      const names = await inventory.itemNames.allTextContents();
      expect(names).toEqual([...names].sort().reverse());
    });

    test('abrir detalle de producto y volver al catálogo', async ({ page }) => {
      await inventory.itemNames.first().click();
      await expect(page).toHaveURL(/inventory-item\.html\?id=/);
      await page.getByTestId('back-to-products').click();
      await inventory.expectLoaded();
    });

    test('el ícono del carrito navega a /cart.html', async ({ page }) => {
      await inventory.openCart();
      await new CartPage(page).expectLoaded();
    });
  });
});
