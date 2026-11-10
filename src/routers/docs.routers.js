import { Router } from 'express';
import { swaggerSpec } from '../docs/swagger.spec.js';

const router = Router();

router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Centralguard - Documentación Swagger</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; padding: 0; background: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .topbar { background: #1e293b; color: white; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; }
    .topbar h1 { margin: 0; font-size: 18px; font-weight: 600; }
    .topbar .badge { background: #0284c7; padding: 4px 10px; border-radius: 9999px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="topbar">
    <h1>🛡️ Centralguard API - Swagger Docs</h1>
    <span class="badge">Trimestre 5</span>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/docs/swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
        deepLinking: true,
        persistAuthorization: true
      });
    };
  </script>
</body>
</html>`);
});

export default router;
