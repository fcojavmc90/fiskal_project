import type { GraphQLResult } from '@aws-amplify/api-graphql';

type GraphQLClientLike = {
  graphql: (args: { query: string; variables?: Record<string, any> }) => Promise<GraphQLResult<any>>;
};

const INTROSPECT_INPUT_FIELDS_QUERY = /* GraphQL */ `
  query FkIntrospectInputFields($name: String!) {
    __type(name: $name) {
      kind
      name
      inputFields {
        name
      }
    }
  }
`;

const FALLBACK_ALLOWED_FIELDS = new Set<string>([
  // Campos comunes en modelos Amplify/AppSync (dependen del schema real)
  'id',
  'owner',
  'userId',
  'clientId',
  'professionalId',
  'role',
  'surveyId',
  'caseId',
  'title',
  'type',
  'status',
  'answers',
  'responses',
  'payload',
  'metadata',
  'createdAt',
  'updatedAt',
]);

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

async function fetchAllowedInputFields(
  client: GraphQLClientLike,
  inputTypeName: string,
): Promise<Set<string> | null> {
  try {
    const result = (await client.graphql({
      query: INTROSPECT_INPUT_FIELDS_QUERY,
      variables: { name: inputTypeName },
    })) as GraphQLResult<any>;

    const typeInfo = result?.data?.__type;
    const fields: string[] | undefined = typeInfo?.inputFields?.map((f: any) => f?.name).filter(Boolean);

    if (!fields || fields.length === 0) return null;
    return new Set(fields);
  } catch {
    return null;
  }
}

/**
 * Retorna una copia de `input` filtrada a los campos existentes en el InputType del schema.
 *
 * - Elimina: __typename
 * - Filtra: solo keys permitidas
 * - Si falla introspección: usa fallback conservador
 */
export async function fkSanitizeInput<T extends Record<string, any>>(
  client: GraphQLClientLike,
  inputTypeName: string,
  input: T,
): Promise<Partial<T>> {
  if (!isPlainObject(input)) return input;

  const allowed = (await fetchAllowedInputFields(client, inputTypeName)) ?? FALLBACK_ALLOWED_FIELDS;

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key === '__typename') continue;
    if (!allowed.has(key)) continue;
    cleaned[key] = value;
  }

  return cleaned as Partial<T>;
}
