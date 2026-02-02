FIX – Encuesta solo CLIENT + Bloqueo PRO

OBJETIVO
- Cliente ve /survey con encuesta completa y upload S3
- Profesional NO puede acceder a /survey

PASOS (Ubuntu VM)
1) Ir al proyecto
   cd ~/tax-mvp

2) Aplicar el ZIP (sobrescribe archivos)
   unzip -o ~/Descargas/FISKAL_FIX_SURVEY_ROLE.zip

3) Levantar
   npm run dev

TEST
- CLIENT: http://localhost:3000/survey  => debe ver encuesta completa + upload S3
- PRO:    http://localhost:3000/survey  => debe redirigir a /dashboard
