// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({page})=> {
  await page.goto('http://127.0.0.1:5500/index.html')
});

test('Debe estar visible el titulo y el heading', async ({ page }) => {
  // Verificar que el título de la página sea correcto
  const title = await page.title();
  expect(title).toBe('UCP. LN y ISI');
  // Verificar que el heading de la pagina sea correcto
  const heading = page.locator('h1');
  await expect(heading).toHaveText(/Creando las mejores\s*galletitas integrales/)
});

  test('Debe Comprobar que se scrolleo hacia abajo al presionar en "Quienes Somos"', async ({ page }) => {
  const initialScrollY = await page.evaluate(() => window.scrollY);
  await page.getByRole('link', {name:'Quienes Somos'}).click()
  await page.waitForTimeout(500);
  const finalScrollY = await page.evaluate(() => window.scrollY);
  expect(finalScrollY).toBeGreaterThan(initialScrollY);
  await page.pause()
});

test('Debe Comprobar que se scrolleo hacia abajo al presionar en "Encuesta"', async ({ page }) => {
  const initialScrollY = await page.evaluate(() => window.scrollY);
  await page.getByRole('link', {name:'Encuesta'}).click()
  await page.waitForTimeout(500);
  const finalScrollY = await page.evaluate(() => window.scrollY);
  expect(finalScrollY).toBeGreaterThan(initialScrollY);
  await page.pause()
});

test('Debe Comprobar que se scrolleo hacia abajo al presionar en "Caracteristicas"', async ({ page }) => {
  const initialScrollY = await page.evaluate(() => window.scrollY);
  await page.getByRole('link', {name:'Características'}).click()
  await page.waitForTimeout(500);
  const finalScrollY = await page.evaluate(() => window.scrollY);
  expect(finalScrollY).toBeGreaterThan(initialScrollY);
  await page.pause()
});