import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';

const BACKPACK = 'sauce-labs-backpack';
const BIKE_LIGHT = 'sauce-labs-bike-light';

test.describe('E2E - Checkout', () => {
  let inventory: InventoryPage;
  let cart: CartPage;
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);
    await inventory.expectLoaded();
  });

  test('flujo completo: agregar 2 productos y finalizar compra @smoke', async ({ page }) => {
    await inventory.addToCart(BACKPACK);
    await inventory.addToCart(BIKE_LIGHT);
    await expect(inventory.cartBadge).toHaveText('2');

    await inventory.openCart();
    await cart.expectLoaded();
    await expect(cart.items).toHaveCount(2);

    await cart.checkout();
    await checkout.fillInfo('Alain', 'Tester', '86000');
    await checkout.expectOverview();

    const subtotal = await checkout.amount(checkout.subtotal);
    const tax = await checkout.amount(checkout.tax);
    const total = await checkout.amount(checkout.total);
    expect(subtotal).toBeCloseTo(29.99 + 9.99, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);

    await checkout.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
  });

  test('quitar un producto desde el carrito actualiza el contador', async () => {
    await inventory.addToCart(BACKPACK);
    await inventory.addToCart(BIKE_LIGHT);
    await inventory.openCart();
    await cart.remove(BACKPACK);
    await expect(cart.items).toHaveCount(1);
  });

  const casosInvalidos: Array<[string, [string, string, string], string]> = [
    ['nombre', ['', 'Tester', '86000'], 'First Name is required'],
    ['apellido', ['Alain', '', '86000'], 'Last Name is required'],
    ['código postal', ['Alain', 'Tester', ''], 'Postal Code is required'],
  ];
  for (const [campo, args, mensaje] of casosInvalidos) {
    test(`checkout sin ${campo} muestra validación`, async () => {
      await inventory.addToCart(BACKPACK);
      await inventory.openCart();
      await cart.checkout();
      await checkout.fillInfo(...args);
      await expect(checkout.error).toContainText(mensaje);
    });
  }
});
