\
#!/usr/bin/env bash
set -euo pipefail

# FISKAL MVP - PASO B (FIX)
# Reemplaza el bloque enum ProfessionalAgendaStatus + type ProfessionalAgenda
# por una version valida usando @index en FIELD (Transformer v2 style).
#
# Uso:
#   ./scripts/fix_professional_agenda_schema_v2.sh ~/tax-mvp

PROJECT_ROOT="${1:-$HOME/tax-mvp}"
BLOCK_FILE="$PROJECT_ROOT/schema/professional_agenda_block.graphql"

SCHEMA_PATH="$(find "$PROJECT_ROOT/amplify/backend/api" -maxdepth 3 -type f -name "schema.graphql" | head -n 1 || true)"
if [ -z "${SCHEMA_PATH}" ]; then
  echo "ERROR: No se encontró schema.graphql en amplify/backend/api/*/schema.graphql"
  exit 1
fi

if [ ! -f "$BLOCK_FILE" ]; then
  echo "ERROR: No existe $BLOCK_FILE. Asegura que copiaste schema/professional_agenda_block.graphql al proyecto."
  exit 1
fi

echo "Schema: $SCHEMA_PATH"

python3 - <<'PY' "$SCHEMA_PATH" "$BLOCK_FILE"
import re, sys, pathlib
schema_path = pathlib.Path(sys.argv[1])
block_path = pathlib.Path(sys.argv[2])

s = schema_path.read_text(encoding="utf-8")
block = block_path.read_text(encoding="utf-8").strip() + "\n"

# Remueve comentarios del bloque para insercion limpia (mantiene el bloque definido)
block_lines = []
for line in block.splitlines():
    if line.strip().startswith("#"):
        continue
    block_lines.append(line)
block_clean = "\n".join(block_lines).strip() + "\n\n"

# 1) Eliminar bloque enum ProfessionalAgendaStatus si existe (cualquier version)
s = re.sub(r'enum\s+ProfessionalAgendaStatus\s*{[\s\S]*?}\s*', '', s, flags=re.M)

# 2) Eliminar bloque type ProfessionalAgenda (cualquier version, con directivas raras)
s = re.sub(r'type\s+ProfessionalAgenda[\s\S]*?}\s*', '', s, flags=re.M)

# 3) Insertar al final del archivo, con separador
s = s.rstrip() + "\n\n" + block_clean

# 4) Limpieza defensiva: si quedo alguna linea @index(...) suelta en OBJECT por error anterior
#    (como " ) @index(...)" en la cabecera)
s = re.sub(r'\)\s*@index\s*\([^)]*\)\s*', ')\n', s, flags=re.S)

# 5) Limpieza defensiva: si quedo algun "@key(" suelto en rules
s = re.sub(r'\s*@key\s*\([\s\S]*?\)\s*', '\n', s, flags=re.M)

schema_path.write_text(s, encoding="utf-8")
print("OK: ProfessionalAgendaStatus + ProfessionalAgenda reemplazados por versión válida (@index en field).")
PY

echo "OK: Schema corregido."
echo ""
echo "Siguiente:"
echo "1) cd $PROJECT_ROOT"
echo "2) amplify push"
