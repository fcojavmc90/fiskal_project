/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUserProfile = /* GraphQL */ `query GetUserProfile($id: ID!) {
  getUserProfile(id: $id) {
    id
    owner
    role
    email
    firstName
    lastName
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserProfileQueryVariables,
  APITypes.GetUserProfileQuery
>;
export const listUserProfiles = /* GraphQL */ `query ListUserProfiles(
  $filter: ModelUserProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      owner
      role
      email
      firstName
      lastName
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserProfilesQueryVariables,
  APITypes.ListUserProfilesQuery
>;
export const getProfessionalProfile = /* GraphQL */ `query GetProfessionalProfile($id: ID!) {
  getProfessionalProfile(id: $id) {
    id
    owner
    proType
    displayName
    bio
    ratingAvg
    ratingCount
    isActive
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetProfessionalProfileQueryVariables,
  APITypes.GetProfessionalProfileQuery
>;
export const listProfessionalProfiles = /* GraphQL */ `query ListProfessionalProfiles(
  $filter: ModelProfessionalProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listProfessionalProfiles(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      owner
      proType
      displayName
      bio
      ratingAvg
      ratingCount
      isActive
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProfessionalProfilesQueryVariables,
  APITypes.ListProfessionalProfilesQuery
>;
export const getSurveyResponse = /* GraphQL */ `query GetSurveyResponse($id: ID!) {
  getSurveyResponse(id: $id) {
    id
    owner
    proOwner
    professionalId
    answersJson
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetSurveyResponseQueryVariables,
  APITypes.GetSurveyResponseQuery
>;
export const listSurveyResponses = /* GraphQL */ `query ListSurveyResponses(
  $filter: ModelSurveyResponseFilterInput
  $limit: Int
  $nextToken: String
) {
  listSurveyResponses(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      owner
      proOwner
      professionalId
      answersJson
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSurveyResponsesQueryVariables,
  APITypes.ListSurveyResponsesQuery
>;
export const getAppointment = /* GraphQL */ `query GetAppointment($id: ID!) {
  getAppointment(id: $id) {
    id
    clientOwner
    clientName
    clientEmail
    proOwner
    professionalId
    requestedStart
    requestedEnd
    status
    proposedStart
    proposedEnd
    notes
    meetingId
    meetingRegion
    meetingData
    clientAttendeeId
    proAttendeeId
    clientJoinToken
    proJoinToken
    caseId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAppointmentQueryVariables,
  APITypes.GetAppointmentQuery
>;
export const listAppointments = /* GraphQL */ `query ListAppointments(
  $filter: ModelAppointmentFilterInput
  $limit: Int
  $nextToken: String
) {
  listAppointments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      clientOwner
      clientName
      clientEmail
      proOwner
      professionalId
      requestedStart
      requestedEnd
      status
      proposedStart
      proposedEnd
      notes
      meetingId
      meetingRegion
      meetingData
      clientAttendeeId
      proAttendeeId
      clientJoinToken
      proJoinToken
      caseId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAppointmentsQueryVariables,
  APITypes.ListAppointmentsQuery
>;
export const getCase = /* GraphQL */ `query GetCase($id: ID!) {
  getCase(id: $id) {
    id
    caseNumber
    clientOwner
    proOwner
    professionalId
    appointmentId
    status
    servicePriceCents
    currency
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetCaseQueryVariables, APITypes.GetCaseQuery>;
export const listCases = /* GraphQL */ `query ListCases(
  $filter: ModelCaseFilterInput
  $limit: Int
  $nextToken: String
) {
  listCases(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      caseNumber
      clientOwner
      proOwner
      professionalId
      appointmentId
      status
      servicePriceCents
      currency
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListCasesQueryVariables, APITypes.ListCasesQuery>;
export const getCaseDocument = /* GraphQL */ `query GetCaseDocument($id: ID!) {
  getCaseDocument(id: $id) {
    id
    caseId
    caseNumber
    clientOwner
    proOwner
    professionalId
    title
    required
    status
    fileName
    fileType
    s3Key
    uploadedAt
    reviewNotes
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCaseDocumentQueryVariables,
  APITypes.GetCaseDocumentQuery
>;
export const listCaseDocuments = /* GraphQL */ `query ListCaseDocuments(
  $filter: ModelCaseDocumentFilterInput
  $limit: Int
  $nextToken: String
) {
  listCaseDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      caseId
      caseNumber
      clientOwner
      proOwner
      professionalId
      title
      required
      status
      fileName
      fileType
      s3Key
      uploadedAt
      reviewNotes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCaseDocumentsQueryVariables,
  APITypes.ListCaseDocumentsQuery
>;
export const getPayment = /* GraphQL */ `query GetPayment($id: ID!) {
  getPayment(id: $id) {
    id
    clientOwner
    proOwner
    professionalId
    appointmentId
    caseId
    type
    amountCents
    currency
    status
    squareCheckoutId
    squarePaymentId
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPaymentQueryVariables,
  APITypes.GetPaymentQuery
>;
export const listPayments = /* GraphQL */ `query ListPayments(
  $filter: ModelPaymentFilterInput
  $limit: Int
  $nextToken: String
) {
  listPayments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      clientOwner
      proOwner
      professionalId
      appointmentId
      caseId
      type
      amountCents
      currency
      status
      squareCheckoutId
      squarePaymentId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaymentsQueryVariables,
  APITypes.ListPaymentsQuery
>;
export const getProfessionalAgenda = /* GraphQL */ `query GetProfessionalAgenda($id: ID!) {
  getProfessionalAgenda(id: $id) {
    id
    professionalId
    clientId
    date
    time
    endTime
    status
    meetingLink
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetProfessionalAgendaQueryVariables,
  APITypes.GetProfessionalAgendaQuery
>;
export const listProfessionalAgenda = /* GraphQL */ `query ListProfessionalAgenda(
  $filter: ModelProfessionalAgendaFilterInput
  $limit: Int
  $nextToken: String
) {
  listProfessionalAgenda(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      professionalId
      clientId
      date
      time
      endTime
      status
      meetingLink
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProfessionalAgendaQueryVariables,
  APITypes.ListProfessionalAgendaQuery
>;
export const caseDocumentsByCase = /* GraphQL */ `query CaseDocumentsByCase(
  $caseId: ID!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelCaseDocumentFilterInput
  $limit: Int
  $nextToken: String
) {
  caseDocumentsByCase(
    caseId: $caseId
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      caseId
      caseNumber
      clientOwner
      proOwner
      professionalId
      title
      required
      status
      fileName
      fileType
      s3Key
      uploadedAt
      reviewNotes
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.CaseDocumentsByCaseQueryVariables,
  APITypes.CaseDocumentsByCaseQuery
>;
export const professionalAgendasByProfessionalId = /* GraphQL */ `query ProfessionalAgendasByProfessionalId(
  $professionalId: ID!
  $dateTime: ModelProfessionalAgendaByProfessionalIdCompositeKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelProfessionalAgendaFilterInput
  $limit: Int
  $nextToken: String
) {
  professionalAgendasByProfessionalId(
    professionalId: $professionalId
    dateTime: $dateTime
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      professionalId
      clientId
      date
      time
      endTime
      status
      meetingLink
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ProfessionalAgendasByProfessionalIdQueryVariables,
  APITypes.ProfessionalAgendasByProfessionalIdQuery
>;
