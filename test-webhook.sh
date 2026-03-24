#!/bin/bash
echo "Verificando si el servidor está activo..."
if ! curl -s http://localhost:3000 > /dev/null; then
  echo "ERROR: El servidor no está corriendo. Ejecuta 'npm run dev' en otra pestaña primero."
  exit 1
fi

echo "Simulando Pago PayPal (CAPTURE COMPLETED)..."
curl -X POST http://localhost:3000/api/webhooks/paypal \
     -H "Content-Type: application/json" \
     -d '{"event_type":"PAYMENT.CAPTURE.COMPLETED","resource":{"id":"CAPTURE-123","supplementary_data":{"related_ids":{"order_id":"ORDER-123"}}}}'
