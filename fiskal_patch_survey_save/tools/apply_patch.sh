#!/usr/bin/env bash
set -euo pipefail

# Ejecutar desde la RAIZ del proyecto: ~/tax-mvp

TARGET="src/components/surveys/NoticeSurvey20Form.tsx"

if [ ! -f "$TARGET" ]; then
  echo "ERROR: No se encuentra $TARGET. Ejecuta este script desde la raiz del proyecto (~/tax-mvp)."
  exit 1
fi

# Copia de seguridad
BACKUP="${TARGET}.bak_$(date +%Y%m%d_%H%M%S)"
cp "$TARGET" "$BACKUP"

# Asegurar que el helper existe (este ZIP lo incluye en src/lib/graphql/...)
if [ ! -f "src/lib/graphql/fkSanitizeInput.ts" ]; then
  echo "ERROR: No existe src/lib/graphql/fkSanitizeInput.ts. Copia primero los archivos del ZIP respetando rutas."
  exit 2
fi

node tools/fk_patch_survey_save.mjs "$TARGET"

echo "OK: Backup creado en $BACKUP"
