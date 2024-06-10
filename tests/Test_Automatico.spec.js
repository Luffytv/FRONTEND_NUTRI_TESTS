import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
await page.goto('http://127.0.0.1:5500/index.html');
});

test('Completar la encuesta una vez', async ({ page }) => {
await completeSurvey(page);
await page.getByRole('button', {name:'Enviar'}).click()
await page.waitForSelector('#thankYouMessage', { state: 'visible' });
await expect(page.locator('#thankYouMessage')).toBeVisible();
await page.pause()
});

test('Completar la encuesta cincuenta veces y guardar en el backend', async ({ page, request }) => {
  test.setTimeout(100000);
  for (let i = 0; i < 50; i++) {
    // Completar y enviar la encuesta
    const surveyData = await completeSurvey(page);

    await page.getByRole('button', { name: 'Enviar' }).click();

    await page.waitForSelector('#thankYouMessage', { state: 'visible' });

    await expect(page.locator('#thankYouMessage')).toBeVisible();

    // Enviar los datos al backend
    const response = await request.post('https://integrador-nutricion-backend.vercel.app/api/survey', {
      data: surveyData,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(201);

    await page.reload(); // Recargar la página para volver a completar la encuesta
  }
});

async function completeSurvey(page) {
  // Generar respuestas aleatorias
  const age = Math.floor(Math.random() * (80 - 18 + 1)) + 18; // Edad entre 18 y 80 años
  const generalFlavor = Math.floor(Math.random() * 5) + 1;
  const chocolateAroma = Math.floor(Math.random() * 5) + 1;
  const mouthTexture = Math.floor(Math.random() * 5) + 1;
  const cookieColor = Math.floor(Math.random() * 5) + 1;
  const generalSatisfaction = Math.floor(Math.random() * 5) + 1;
  const sweetnessIntensity = Math.floor(Math.random() * 5) + 1;
  const chocolateAromaIntensity = Math.floor(Math.random() * 5) + 1;
  const softTexture = Math.floor(Math.random() * 5) + 1;
  const satietyLevel = Math.floor(Math.random() * 5) + 1;
  const perceivedSize = Math.floor(Math.random() * 5) + 1;

  // Llenar el formulario con las respuestas aleatorias
  await page.fill('#age', age.toString());
  await page.click(`input[name="generalFlavor"][value="${generalFlavor}"]`);
  await page.click(`input[name="chocolateAroma"][value="${chocolateAroma}"]`);
  await page.click(`input[name="mouthTexture"][value="${mouthTexture}"]`);
  await page.click(`input[name="cookieColor"][value="${cookieColor}"]`);
  await page.click(`input[name="generalSatisfaction"][value="${generalSatisfaction}"]`);
  await page.click(`input[name="sweetnessIntensity"][value="${sweetnessIntensity}"]`);
  await page.click(`input[name="chocolateAromaIntensity"][value="${chocolateAromaIntensity}"]`);
  await page.click(`input[name="softTexture"][value="${softTexture}"]`);
  await page.click(`input[name="satietyLevel"][value="${satietyLevel}"]`);
  await page.click(`input[name="perceivedSize"][value="${perceivedSize}"]`);

  // Retornar los datos generados para enviarlos al backend
  return {
    age,
    generalFlavor,
    chocolateAroma,
    mouthTexture,
    cookieColor,
    generalSatisfaction,
    sweetnessIntensity,
    chocolateAromaIntensity,
    softTexture,
    satietyLevel,
    perceivedSize,
  };
}

test('Verificar que el gráfico se genera correctamente con datos del backend', async ({ page }) => {
  // Interceptar la llamada a la API y verificar los datos
  let backendData;
  page.route('**/api/survey/average', route => {
    route.continue(async response => {
      backendData = await response.json();
    });
  });

  // Navegar a la página que contiene el gráfico
  await page.goto('http://127.0.0.1:5500/resultados.html'); // Ajusta la ruta según tu configuración

  // Esperar un momento para que se genere el gráfico
  await page.waitForTimeout(2000); // Espera 2 segundos (ajusta según sea necesario)

  // Verificar que el gráfico se haya generado correctamente
  const canvas = await page.$('#barChart');
  expect(canvas).not.toBeNull();

  // Verificar que los datos del gráfico sean los esperados
  const chartData = await page.evaluate(() => {
    const chart = Chart.getChart('barChart');
    return chart ? chart.data.datasets[0].data : null;
  });

  expect(chartData).toEqual(Object.values(backendData));
});