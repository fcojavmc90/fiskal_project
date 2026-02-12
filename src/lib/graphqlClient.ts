import { generateClient } from 'aws-amplify/api';
import { ensureAmplifyConfigured } from './amplifyClient';
import type { AppointmentStatus, PaymentStatus, PaymentType, ProfessionalAgendaStatus, ProType, UserRole } from '../API';

type SimpleGraphqlClient = {
  graphql: (options: { query: string; variables?: Record<string, unknown> }) => Promise<any>;
};

let client: SimpleGraphqlClient | null = null;

function getClient() {
  ensureAmplifyConfigured();
  if (!client) client = generateClient() as SimpleGraphqlClient;
  return client;
}

const listUserProfilesQuery = /* GraphQL */ `
  query ListUserProfiles($filter: ModelUserProfileFilterInput) {
    listUserProfiles(filter: $filter) {
      items { id owner role email firstName lastName }
    }
  }
`;

const listProfessionalProfilesQuery = /* GraphQL */ `
  query ListProfessionalProfiles($filter: ModelProfessionalProfileFilterInput) {
    listProfessionalProfiles(filter: $filter) {
      items { id owner proType displayName bio ratingAvg ratingCount isActive }
    }
  }
`;

const listAppointmentsQuery = /* GraphQL */ `
  query ListAppointments($filter: ModelAppointmentFilterInput) {
    listAppointments(filter: $filter) {
      items { id clientOwner clientName clientEmail proOwner professionalId requestedStart requestedEnd status proposedStart proposedEnd notes caseId createdAt meetingId meetingRegion meetingData clientAttendeeId proAttendeeId clientJoinToken proJoinToken }
    }
  }
`;

const getAppointmentQuery = /* GraphQL */ `
  query GetAppointment($id: ID!) {
    getAppointment(id: $id) {
      id
      clientOwner
      proOwner
      requestedStart
      requestedEnd
      status
      meetingId
      meetingRegion
      meetingData
      clientAttendeeId
      proAttendeeId
      clientJoinToken
      proJoinToken
    }
  }
`;

const listSurveyResponsesQuery = /* GraphQL */ `
  query ListSurveyResponses($filter: ModelSurveyResponseFilterInput) {
    listSurveyResponses(filter: $filter) {
      items { id owner proOwner professionalId answersJson createdAt }
    }
  }
`;

const listCasesQuery = /* GraphQL */ `
  query ListCases($filter: ModelCaseFilterInput) {
    listCases(filter: $filter) {
      items { id caseNumber clientOwner proOwner professionalId appointmentId status servicePriceCents currency }
    }
  }
`;

const listPaymentsQuery = /* GraphQL */ `
  query ListPayments($filter: ModelPaymentFilterInput) {
    listPayments(filter: $filter) {
      items { id clientOwner proOwner professionalId appointmentId caseId type amountCents currency status squareCheckoutId squarePaymentId }
    }
  }
`;

const caseDocumentsByCaseQuery = /* GraphQL */ `
  query CaseDocumentsByCase($caseId: ID!, $sortDirection: ModelSortDirection) {
    caseDocumentsByCase(caseId: $caseId, sortDirection: $sortDirection) {
      items { id caseId title status fileName fileType s3Key uploadedAt }
    }
  }
`;
const professionalAgendasByProfessionalIdQuery = /* GraphQL */ `
  query ProfessionalAgendasByProfessionalId($professionalId: ID!, $sortDirection: ModelSortDirection) {
    professionalAgendasByProfessionalId(professionalId: $professionalId, sortDirection: $sortDirection) {
      items { id professionalId clientId date time endTime status meetingLink }
    }
  }
`;

const createUserProfileMutation = /* GraphQL */ `
  mutation CreateUserProfile($input: CreateUserProfileInput!) {
    createUserProfile(input: $input) { id owner role email firstName lastName }
  }
`;

const createProfessionalProfileMutation = /* GraphQL */ `
  mutation CreateProfessionalProfile($input: CreateProfessionalProfileInput!) {
    createProfessionalProfile(input: $input) { id owner displayName bio ratingAvg ratingCount isActive proType }
  }
`;

const updateProfessionalProfileMutation = /* GraphQL */ `
  mutation UpdateProfessionalProfile($input: UpdateProfessionalProfileInput!) {
    updateProfessionalProfile(input: $input) { id ratingAvg ratingCount bio displayName isActive proType }
  }
`;

const createSurveyResponseMutation = /* GraphQL */ `
  mutation CreateSurveyResponse($input: CreateSurveyResponseInput!) {
    createSurveyResponse(input: $input) { id owner answersJson createdAt }
  }
`;

const updateSurveyResponseMutation = /* GraphQL */ `
  mutation UpdateSurveyResponse($input: UpdateSurveyResponseInput!) {
    updateSurveyResponse(input: $input) { id owner proOwner professionalId answersJson createdAt }
  }
`;

const createAppointmentMutation = /* GraphQL */ `
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) { id status }
  }
`;

const updateAppointmentMutation = /* GraphQL */ `
  mutation UpdateAppointment($input: UpdateAppointmentInput!) {
    updateAppointment(input: $input) { id status proposedStart proposedEnd meetingId meetingRegion meetingData clientAttendeeId proAttendeeId clientJoinToken proJoinToken }
  }
`;

const createPaymentMutation = /* GraphQL */ `
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) { id status type amountCents currency }
  }
`;

const updatePaymentMutation = /* GraphQL */ `
  mutation UpdatePayment($input: UpdatePaymentInput!) {
    updatePayment(input: $input) { id status squarePaymentId }
  }
`;

const createProfessionalAgendaMutation = /* GraphQL */ `
  mutation CreateProfessionalAgenda($input: CreateProfessionalAgendaInput!) {
    createProfessionalAgenda(input: $input) { id status date time endTime }
  }
`;

const createCaseMutation = /* GraphQL */ `
  mutation CreateCase($input: CreateCaseInput!) {
    createCase(input: $input) { id caseNumber status professionalId appointmentId }
  }
`;

const updateCaseMutation = /* GraphQL */ `
  mutation UpdateCase($input: UpdateCaseInput!) {
    updateCase(input: $input) { id status servicePriceCents currency }
  }
`;

const createCaseDocumentMutation = /* GraphQL */ `
  mutation CreateCaseDocument($input: CreateCaseDocumentInput!) {
    createCaseDocument(input: $input) { id caseId title status fileName fileType s3Key }
  }
`;

const updateProfessionalAgendaMutation = /* GraphQL */ `
  mutation UpdateProfessionalAgenda($input: UpdateProfessionalAgendaInput!) {
    updateProfessionalAgenda(input: $input) { id status date time endTime meetingLink clientId }
  }
`;

const deleteProfessionalAgendaMutation = /* GraphQL */ `
  mutation DeleteProfessionalAgenda($input: DeleteProfessionalAgendaInput!) {
    deleteProfessionalAgenda(input: $input) { id }
  }
`;

export async function getUserProfileByOwner(owner: string) {
  const res = await getClient().graphql({
    query: listUserProfilesQuery,
    variables: { filter: { owner: { eq: owner } } },
  });
  return res.data?.listUserProfiles?.items?.[0] ?? null;
}

export async function listProfessionalProfiles() {
  const res = await getClient().graphql({
    query: listProfessionalProfilesQuery,
    variables: { filter: { isActive: { eq: true } } },
  });
  return res.data?.listProfessionalProfiles?.items ?? [];
}

export async function getProfessionalProfileByOwner(owner: string) {
  const res = await getClient().graphql({
    query: listProfessionalProfilesQuery,
    variables: { filter: { owner: { eq: owner } } },
  });
  return res.data?.listProfessionalProfiles?.items?.[0] ?? null;
}

export async function createUserProfile(input: {
  owner: string;
  role: UserRole;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}) {
  return getClient().graphql({ query: createUserProfileMutation, variables: { input } });
}

export async function createProfessionalProfile(input: {
  owner: string;
  proType: ProType;
  displayName: string;
  bio?: string | null;
  ratingAvg?: number | null;
  ratingCount?: number | null;
  isActive?: boolean | null;
}) {
  return getClient().graphql({ query: createProfessionalProfileMutation, variables: { input } });
}

export async function updateProfessionalProfile(input: {
  id: string;
  ratingAvg?: number | null;
  ratingCount?: number | null;
  bio?: string | null;
  displayName?: string | null;
  isActive?: boolean | null;
  proType?: ProType | null;
}) {
  return getClient().graphql({ query: updateProfessionalProfileMutation, variables: { input } });
}

export async function createSurveyResponse(input: { owner: string; answersJson: string }) {
  return getClient().graphql({ query: createSurveyResponseMutation, variables: { input } });
}

export async function listSurveyResponsesByOwner(owner: string) {
  const res = await getClient().graphql({
    query: listSurveyResponsesQuery,
    variables: { filter: { owner: { eq: owner } } },
  });
  return res.data?.listSurveyResponses?.items ?? [];
}

export async function listSurveyResponsesByOwnerAndPro(owner: string, proOwner: string) {
  const res = await getClient().graphql({
    query: listSurveyResponsesQuery,
    variables: { filter: { and: [{ owner: { eq: owner } }, { proOwner: { eq: proOwner } }] } },
  });
  return res.data?.listSurveyResponses?.items ?? [];
}

export async function listSurveyResponsesByProOwner(proOwner: string) {
  const res = await getClient().graphql({
    query: listSurveyResponsesQuery,
    variables: { filter: { proOwner: { eq: proOwner } } },
  });
  return res.data?.listSurveyResponses?.items ?? [];
}

export async function updateSurveyResponse(input: {
  id: string;
  proOwner?: string | null;
  professionalId?: string | null;
  answersJson?: string | null;
}) {
  return getClient().graphql({ query: updateSurveyResponseMutation, variables: { input } });
}

export async function listAppointmentsByPro(proOwner: string) {
  const res = await getClient().graphql({
    query: listAppointmentsQuery,
    variables: { filter: { proOwner: { eq: proOwner } } },
  });
  return res.data?.listAppointments?.items ?? [];
}

export async function listAppointmentsByClient(clientOwner: string) {
  const res = await getClient().graphql({
    query: listAppointmentsQuery,
    variables: { filter: { clientOwner: { eq: clientOwner } } },
  });
  return res.data?.listAppointments?.items ?? [];
}

export async function getAppointmentById(id: string) {
  const res = await getClient().graphql({
    query: getAppointmentQuery,
    variables: { id },
  });
  return res.data?.getAppointment ?? null;
}

export async function createAppointment(input: {
  clientOwner: string;
  clientName?: string | null;
  clientEmail?: string | null;
  proOwner: string;
  professionalId: string;
  requestedStart: string;
  requestedEnd: string;
  status: AppointmentStatus;
  proposedStart?: string | null;
  proposedEnd?: string | null;
  notes?: string | null;
  caseId?: string | null;
}) {
  return getClient().graphql({ query: createAppointmentMutation, variables: { input } });
}

export async function updateAppointment(input: {
  id: string;
  status?: AppointmentStatus | null;
  proposedStart?: string | null;
  proposedEnd?: string | null;
  notes?: string | null;
  meetingId?: string | null;
  meetingRegion?: string | null;
  meetingData?: string | null;
  clientAttendeeId?: string | null;
  proAttendeeId?: string | null;
  clientJoinToken?: string | null;
  proJoinToken?: string | null;
}) {
  return getClient().graphql({ query: updateAppointmentMutation, variables: { input } });
}

export async function listAgendaByProfessional(professionalId: string) {
  const res = await getClient().graphql({
    query: professionalAgendasByProfessionalIdQuery,
    variables: { professionalId, sortDirection: 'ASC' },
  });
  return res.data?.professionalAgendasByProfessionalId?.items ?? [];
}

export async function createProfessionalAgenda(input: {
  professionalId: string;
  date: string;
  time: string;
  endTime?: string | null;
  status: ProfessionalAgendaStatus;
  clientId?: string | null;
  meetingLink?: string | null;
}) {
  return getClient().graphql({ query: createProfessionalAgendaMutation, variables: { input } });
}

export async function updateProfessionalAgenda(input: {
  id: string;
  status?: ProfessionalAgendaStatus | null;
  clientId?: string | null;
  meetingLink?: string | null;
  date?: string | null;
  time?: string | null;
  endTime?: string | null;
}) {
  return getClient().graphql({ query: updateProfessionalAgendaMutation, variables: { input } });
}

export async function deleteProfessionalAgenda(id: string) {
  return getClient().graphql({ query: deleteProfessionalAgendaMutation, variables: { input: { id } } });
}

export async function createPayment(input: {
  clientOwner: string;
  proOwner?: string | null;
  professionalId?: string | null;
  appointmentId?: string | null;
  caseId?: string | null;
  type: PaymentType;
  amountCents: number;
  currency: string;
  status: PaymentStatus;
  squareCheckoutId?: string | null;
  squarePaymentId?: string | null;
}) {
  return getClient().graphql({ query: createPaymentMutation, variables: { input } });
}

export async function listCasesByProOwner(proOwner: string) {
  const res = await getClient().graphql({
    query: listCasesQuery,
    variables: { filter: { proOwner: { eq: proOwner } } },
  });
  return res.data?.listCases?.items ?? [];
}

export async function listCasesByClientOwner(clientOwner: string) {
  const res = await getClient().graphql({
    query: listCasesQuery,
    variables: { filter: { clientOwner: { eq: clientOwner } } },
  });
  return res.data?.listCases?.items ?? [];
}

export async function listPaymentsBySquareId(id: string) {
  const res = await getClient().graphql({
    query: listPaymentsQuery,
    variables: { filter: { or: [{ squarePaymentId: { eq: id } }, { squareCheckoutId: { eq: id } }] } },
  });
  return res.data?.listPayments?.items ?? [];
}

export async function listPaymentsByClientOwner(owner: string) {
  const res = await getClient().graphql({
    query: listPaymentsQuery,
    variables: { filter: { clientOwner: { eq: owner } } },
  });
  return res.data?.listPayments?.items ?? [];
}

export async function listCaseDocumentsByCase(caseId: string) {
  const res = await getClient().graphql({
    query: caseDocumentsByCaseQuery,
    variables: { caseId, sortDirection: 'ASC' },
  });
  return res.data?.caseDocumentsByCase?.items ?? [];
}

export async function createCase(input: {
  caseNumber: string;
  clientOwner: string;
  proOwner: string;
  professionalId: string;
  appointmentId: string;
  status: import('../API').CaseStatus;
  servicePriceCents?: number | null;
  currency?: string | null;
}) {
  return getClient().graphql({ query: createCaseMutation, variables: { input } });
}

export async function updateCase(input: {
  id: string;
  status?: import('../API').CaseStatus | null;
  servicePriceCents?: number | null;
  currency?: string | null;
}) {
  return getClient().graphql({ query: updateCaseMutation, variables: { input } });
}

export async function createCaseDocument(input: {
  caseId: string;
  caseNumber: string;
  clientOwner: string;
  proOwner: string;
  professionalId: string;
  title: string;
  required?: boolean | null;
  status: import('../API').DocStatus;
  fileName?: string | null;
  fileType?: string | null;
  s3Key?: string | null;
  uploadedAt?: string | null;
  reviewNotes?: string | null;
  createdAt?: string | null;
}) {
  return getClient().graphql({ query: createCaseDocumentMutation, variables: { input } });
}

export async function updatePayment(input: {
  id: string;
  status?: PaymentStatus | null;
  squarePaymentId?: string | null;
}) {
  return getClient().graphql({ query: updatePaymentMutation, variables: { input } });
}
