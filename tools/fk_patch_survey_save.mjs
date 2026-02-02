#!/usr/bin/env node
/*
  FISKAL Patch: Sanitizar input GraphQL del guardado de encuesta.

  Objetivo:
  - Evitar error AppSync: "The variables input contains a field that is not defined for input object type ..."

  Estrategia:
  - Mantener UI intacta.
  - Solo filtrar el objeto `variables.input` previo a ejecutar la mutación.

  Uso:
    node tools/fk_patch_survey_save.mjs src/components/surveys/NoticeSurvey20Form.tsx
*/

import fs from 'fs';
import path from 'path';

const targetPath = process.argv[2];
if (!targetPath) {
  console.error('ERROR: Debes indicar la ruta del archivo a parchear.');
  process.exit(1);
}

const abs = path.resolve(process.cwd(), targetPath);
if (!fs.existsSync(abs)) {
  console.error(`ERROR: No existe el archivo: ${abs}`);
  process.exit(1);
}

let code = fs.readFileSync(abs, 'utf8');

// 1) Asegurar import de fkSanitizeInput
const importLine = "import { fkSanitizeInput } from '@/lib/graphql/fkSanitizeInput';";
if (!code.includes(importLine)) {
  const importRegex = /^import\s+[^;]+;\s*$/gm;
  let lastImportIndex = -1;
  let match;
  while ((match = importRegex.exec(code)) !== null) {
    lastImportIndex = match.index + match[0].length;
  }

  if (lastImportIndex === -1) {
    // No hay imports? insertar al inicio
    code = `${importLine}\n${code}`;
  } else {
    code = `${code.slice(0, lastImportIndex)}\n${importLine}${code.slice(lastImportIndex)}`;
  }
}

// 2) Detectar variable del client generado por Amplify (default: client)
let clientVar = 'client';
const clientAssign = code.match(/const\s+(\w+)\s*=\s*generateClient\s*\(\s*\)\s*;?/);
if (clientAssign?.[1]) clientVar = clientAssign[1];

// 3) Reescribir el primer `variables: { input: ... }` (o similar)
// Buscamos un bloque `variables: { ... input: <expr> ... }`
// y reescribimos SOLO el primer `input:` encontrado dentro de ese bloque.
const variablesBlockRegex = /variables\s*:\s*\{([\s\S]*?)\}/m;
const varBlockMatch = code.match(variablesBlockRegex);
if (!varBlockMatch) {
  console.error('ERROR: No se encontró `variables: { ... }` en el archivo.');
  process.exit(2);
}

const fullMatch = varBlockMatch[0];
const inner = varBlockMatch[1];

// Encontrar primer input: <expr>
// - Captura la expresión hasta coma o fin de bloque.
const inputFieldRegex = /\binput\s*:\s*([^,\n\r}]+(?:\([^)]*\))?[^,\n\r}]*)/m;
const inputMatch = inner.match(inputFieldRegex);
if (!inputMatch) {
  console.error('ERROR: No se encontró `input:` dentro de `variables: { ... }`.');
  process.exit(3);
}

const inputExpr = inputMatch[1].trim();

// Si ya está sanitizado, no tocar.
if (inputExpr.includes('fkSanitizeInput')) {
  console.log('OK: El archivo ya parece estar parcheado (fkSanitizeInput presente).');
  process.exit(0);
}

const sanitizedExpr = `await fkSanitizeInput(${clientVar} as any, 'CreateSurveyResponseInput', ${inputExpr})`;

const newInner = inner.replace(inputFieldRegex, `input: ${sanitizedExpr}`);
const newFullMatch = `variables: {${newInner}}`;

code = code.replace(fullMatch, newFullMatch);

fs.writeFileSync(abs, code, 'utf8');
console.log(`OK: Parche aplicado a ${targetPath}`);
