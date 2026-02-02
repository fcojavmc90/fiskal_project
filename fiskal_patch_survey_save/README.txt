FISKAL MVP - PATCH 001 (Guardar Encuesta - GraphQL Input)

OBJETIVO
- Corregir el guardado de la encuesta evitando el error de AppSync:
  "The variables input contains a field that is not defined for input object type 'CreateSurveyResponseInput'"
- NO toca UI/estilos (solo sanitiza variables.input).

ARCHIVOS INCLUIDOS
- /src/lib/graphql/fkSanitizeInput.ts
- /tools/fk_patch_survey_save.mjs
- /tools/apply_patch.sh

COMO APLICAR (UBUNTU - DESDE TU PROYECTO)
1) En tu VM, ve a la raiz del proyecto:
   cd ~/tax-mvp

2) Copia el contenido del ZIP dentro del proyecto, respetando rutas (src/... y tools/...)
   (Puedes descomprimir y luego copiar/mergear carpetas.)

3) Da permisos y ejecuta el patch:
   chmod +x tools/apply_patch.sh
   ./tools/apply_patch.sh

4) Reinicia el dev server:
   npm run dev

VERIFICACION
- Reintenta guardar la encuesta.
- Si el schema tiene introspeccion habilitada, el helper filtrara exactamente a los campos reales.
- Si la introspeccion no esta habilitada, usa un fallback conservador (solo campos comunes).

BACKUP
- El script crea un backup automatico del archivo NoticeSurvey20Form.tsx en la misma carpeta, con sufijo .bak_YYYYMMDD_HHMMSS
