#!/bin/bash
echo "Verificando si el servidor está activo..."
if ! curl -s http://localhost:3000 > /dev/null; then
  echo "ERROR: El servidor no está corriendo. Ejecuta 'npm run dev' en otra pestaña primero."
  exit 1
fi

echo "Simulando Pago Hito 1..."
curl -X POST http://localhost:3000/api/webhooks/square \
     -H "Content-Type: application/json" \
     -d '{"type":"payment.updated","data":{"object":{"payment":{"status":"COMPLETED","note":"f.m.correa@outlook.com","reference_id":"SURVEY-12345"}}}}'
