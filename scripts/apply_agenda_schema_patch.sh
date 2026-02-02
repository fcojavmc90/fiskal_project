#!/usr/bin/env bash
set -euo pipefail

# FISKAL MVP - PASO B
# Aplica patch de schema (agenda profesional) en Amplify Gen1.
# No sobreescribe el schema: solo inserta si no existe "type ProfessionalAgenda".

PROJECT_ROOT="${1:-$HOME/tax-mvp}"
PATCH_FILE="$PROJECT_ROOT/schema/agenda_patch.graphql"

if [ ! -f "$PATCH_FILE" ]; then
  echo "ERROR: No existe $PATCH_FILE. Asegura que copiaste la carpeta schema/ al proyecto."
  exit 1
fi

SCHEMA_PATH="$(find "$PROJECT_ROOT/amplify/backend/api" -maxdepth 3 -type f -name "schema.graphql" | head -n 1 || true)"
if [ -z "${SCHEMA_PATH}" ]; then
  echo "ERROR: No se encontró schema.graphql en amplify/backend/api/*/schema.graphql"
  exit 1
fi

if grep -q "type ProfessionalAgenda" "$SCHEMA_PATH"; then
  echo "OK: schema ya contiene ProfessionalAgenda -> $SCHEMA_PATH"
  exit 0
fi

echo "Aplicando patch a: $SCHEMA_PATH"
echo "" >> "$SCHEMA_PATH"
cat "$PATCH_FILE" >> "$SCHEMA_PATH"

echo "OK: Patch aplicado."
echo ""
echo "SIGUIENTE (manual):"
echo "1) cd $PROJECT_ROOT"
echo "2) amplify push"
echo "3) amplify codegen (si aplica)"
