import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  SurveyResponse: a.model({
    content: a.string(),
    status: a.string(),
    files: a.string().array(),
  }).authorization(allow => [allow.owner(), allow.specificGroup('PRO').to(['read'])]),

  Appointment: a.model({
    date: a.string(),
    time: a.string(),
    status: a.string(), // PENDING, PAID, ACCEPTED, REJECTED
    paymentId: a.string(), // ID de Square para los 150 USD
    notes: a.string(),
  }).authorization(allow => [allow.owner(), allow.specificGroup('PRO').to(['read', 'update'])]),

  Case: a.model({
    totalQuote: a.float(),
    paidAmount: a.float(),
    status: a.string(), // QUOTED, DEPOSIT_PAID, COMPLETED
    professionalId: a.string(),
  }).authorization(allow => [allow.owner(), allow.specificGroup('PRO').to(['read', 'update'])]),
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({ schema, authorizationModes: { defaultAuthorizationMode: 'userPool' } });
