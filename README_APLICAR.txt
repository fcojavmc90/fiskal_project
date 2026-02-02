FISKAL - Ruta Cliente Booking + Reserva (PASO C)

Este paquete agrega la pantalla /client/booking para que el CLIENTE pueda:
- Ver slots AVAILABLE del profesional (por professionalId)
- Seleccionar un slot
- Crear un Appointment (REQUESTED)
- Intentar marcar el slot como PENDING (si el auth del schema lo permite)

IMPORTANTE (Auth del schema):
- Si tu tipo ProfessionalAgenda NO permite lectura a clientes, la lista saldra vacia/Unauthorized.
  Solucion recomendada en schema (cuando corresponda): agregar { allow: private, operations:[read] }.
- Si tu tipo ProfessionalAgenda NO permite update por clientes, la reserva igual creara Appointment,
  pero el cambio de estado del slot a PENDING puede fallar (se muestra mensaje).

Como aplicar en Ubuntu (desde ~/tax-mvp):
1) Descomprime sobre el proyecto:
   unzip -o ~/Descargas/fiskal_pasoC_route_fix_client_booking_v2.zip -d ~/tax-mvp
2) Reinstala deps si hace falta:
   npm i
3) Ejecuta:
   npm run dev

Uso:
- Ir a: http://localhost:3000/client/booking?pro=<PRO_SUB>
  donde <PRO_SUB> es el sub/ID del profesional (el mismo que usa ProfessionalAgenda.professionalId).
