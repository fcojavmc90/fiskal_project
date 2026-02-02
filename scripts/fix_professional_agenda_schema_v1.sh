\
#!/usr/bin/env bash
set -euo pipefail

# FISKAL MVP - PASO B (FIX)
# Corrige schema para Transformer v1:
# - Reemplaza @index(...) por @key(...) si ya existe el type
# - Si no existe, agrega el bloque patch

PROJECT_ROOT="${1:-$HOME/tax-mvp}"
PATCH_FILE="$PROJECT_ROOT/schema/agenda_patch.graphql"

if [ ! -f "$PATCH_FILE" ]; then
  echo "ERROR: No existe $PATCH_FILE. Copia este ZIP a la raiz del proyecto primero (unzip)."
  exit 1
fi

SCHEMA_PATH="$(find "$PROJECT_ROOT/amplify/backend/api" -maxdepth 3 -type f -name "schema.graphql" | head -n 1 || true)"
if [ -z "${SCHEMA_PATH}" ]; then
  echo "ERROR: No se encontró schema.graphql en amplify/backend/api/*/schema.graphql"
  exit 1
fi

echo "Schema: $SCHEMA_PATH"

# Caso 1: Existe type ProfessionalAgenda y tiene @index -> reemplazar por @key (Transformer v1)
if grep -q "type ProfessionalAgenda" "$SCHEMA_PATH" && grep -q "@index(" "$SCHEMA_PATH"; then
  echo "Detectado @index en ProfessionalAgenda. Reemplazando por @key (v1)..."
  python3 - <<'PY' "$SCHEMA_PATH"
import re, sys, pathlib
p = pathlib.Path(sys.argv[1])
s = p.read_text(encoding="utf-8")

# Reemplaza cualquier ocurrencia de @index(...) dentro de la declaración del type ProfessionalAgenda
# Soporta que esté en la misma línea o en bloque
def repl(match):
  block = match.group(0)
  block = re.sub(r'@index\s*\([^)]*\)', '', block, flags=re.S)
  # Inserta @key(...) si no está ya
  if '@key' not in block:
    # Inserta antes del '{' del type
    block = re.sub(r'\)\s*{', r')\n  @key(\n    name: "byProfessionalId"\n    fields: ["professionalId", "date", "time"]\n    queryField: "professionalAgendasByProfessionalId"\n  ) {', block, count=1)
  return block

pattern = r'type\s+ProfessionalAgenda[\s\S]*?{'
# Tomamos sólo el encabezado del type hasta el primer '{'
m = re.search(pattern, s)
if not m:
  print("No se encontró encabezado de type ProfessionalAgenda. No se modificó.")
  sys.exit(0)

head = m.group(0)

# Limpia @index en el head completo
head2 = re.sub(r'@index\s*\([^)]*\)', '', head, flags=re.S)

# Asegura @key en el head
if '@key' not in head2:
  # Inserta @key justo antes del '{'
  head2 = head2[:-1].rstrip()  # quita '{'
  head2 += '\n  @key(\n    name: "byProfessionalId"\n    fields: ["professionalId", "date", "time"]\n    queryField: "professionalAgendasByProfessionalId"\n  ) {\n'

# Reemplaza en el schema
s2 = s[:m.start()] + head2 + s[m.end():]

p.write_text(s2, encoding="utf-8")
print("OK: Reemplazo @index -> @key aplicado.")
PY
  echo "OK: Schema actualizado para v1."
  exit 0
fi

# Caso 2: No existe type -> agregar patch (v1)
if grep -q "type ProfessionalAgenda" "$SCHEMA_PATH"; then
  echo "OK: ProfessionalAgenda ya existe y no se detectó @index. No se hace nada."
  exit 0
fi

echo "Agregando bloque ProfessionalAgenda (v1) al schema..."
echo "" >> "$SCHEMA_PATH"
cat "$PATCH_FILE" >> "$SCHEMA_PATH"
echo "OK: Patch agregado."
