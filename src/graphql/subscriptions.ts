/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateUserProfile = /* GraphQL */ `subscription OnCreateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onCreateUserProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserProfileSubscriptionVariables,
  APITypes.OnCreateUserProfileSubscription
>;
export const onUpdateUserProfile = /* GraphQL */ `subscription OnUpdateUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onUpdateUserProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserProfileSubscriptionVariables,
  APITypes.OnUpdateUserProfileSubscription
>;
export const onDeleteUserProfile = /* GraphQL */ `subscription OnDeleteUserProfile(
  $filter: ModelSubscriptionUserProfileFilterInput
  $owner: String
) {
  onDeleteUserProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserProfileSubscriptionVariables,
  APITypes.OnDeleteUserProfileSubscription
>;
export const onCreateProfessionalProfile = /* GraphQL */ `subscription OnCreateProfessionalProfile(
  $filter: ModelSubscriptionProfessionalProfileFilterInput
  $owner: String
) {
  onCreateProfessionalProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateProfessionalProfileSubscriptionVariables,
  APITypes.OnCreateProfessionalProfileSubscription
>;
export const onUpdateProfessionalProfile = /* GraphQL */ `subscription OnUpdateProfessionalProfile(
  $filter: ModelSubscriptionProfessionalProfileFilterInput
  $owner: String
) {
  onUpdateProfessionalProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateProfessionalProfileSubscriptionVariables,
  APITypes.OnUpdateProfessionalProfileSubscription
>;
export const onDeleteProfessionalProfile = /* GraphQL */ `subscription OnDeleteProfessionalProfile(
  $filter: ModelSubscriptionProfessionalProfileFilterInput
  $owner: String
) {
  onDeleteProfessionalProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteProfessionalProfileSubscriptionVariables,
  APITypes.OnDeleteProfessionalProfileSubscription
>;
export const onCreateSurveyResponse = /* GraphQL */ `subscription OnCreateSurveyResponse(
  $filter: ModelSubscriptionSurveyResponseFilterInput
  $owner: String
  $proOwner: String
) {
  onCreateSurveyResponse(filter: $filter, owner: $owner, proOwner: $proOwner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSurveyResponseSubscriptionVariables,
  APITypes.OnCreateSurveyResponseSubscription
>;
export const onUpdateSurveyResponse = /* GraphQL */ `subscription OnUpdateSurveyResponse(
  $filter: ModelSubscriptionSurveyResponseFilterInput
  $owner: String
  $proOwner: String
) {
  onUpdateSurveyResponse(filter: $filter, owner: $owner, proOwner: $proOwner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSurveyResponseSubscriptionVariables,
  APITypes.OnUpdateSurveyResponseSubscription
>;
export const onDeleteSurveyResponse = /* GraphQL */ `subscription OnDeleteSurveyResponse(
  $filter: ModelSubscriptionSurveyResponseFilterInput
  $owner: String
  $proOwner: String
) {
  onDeleteSurveyResponse(filter: $filter, owner: $owner, proOwner: $proOwner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSurveyResponseSubscriptionVariables,
  APITypes.OnDeleteSurveyResponseSubscription
>;
export const onCreateAppointment = /* GraphQL */ `subscription OnCreateAppointment(
  $filter: ModelSubscriptionAppointmentFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onCreateAppointment(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAppointmentSubscriptionVariables,
  APITypes.OnCreateAppointmentSubscription
>;
export const onUpdateAppointment = /* GraphQL */ `subscription OnUpdateAppointment(
  $filter: ModelSubscriptionAppointmentFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onUpdateAppointment(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAppointmentSubscriptionVariables,
  APITypes.OnUpdateAppointmentSubscription
>;
export const onDeleteAppointment = /* GraphQL */ `subscription OnDeleteAppointment(
  $filter: ModelSubscriptionAppointmentFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onDeleteAppointment(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAppointmentSubscriptionVariables,
  APITypes.OnDeleteAppointmentSubscription
>;
export const onCreateCase = /* GraphQL */ `subscription OnCreateCase(
  $filter: ModelSubscriptionCaseFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onCreateCase(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
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
` as GeneratedSubscription<
  APITypes.OnCreateCaseSubscriptionVariables,
  APITypes.OnCreateCaseSubscription
>;
export const onUpdateCase = /* GraphQL */ `subscription OnUpdateCase(
  $filter: ModelSubscriptionCaseFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onUpdateCase(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateCaseSubscriptionVariables,
  APITypes.OnUpdateCaseSubscription
>;
export const onDeleteCase = /* GraphQL */ `subscription OnDeleteCase(
  $filter: ModelSubscriptionCaseFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onDeleteCase(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteCaseSubscriptionVariables,
  APITypes.OnDeleteCaseSubscription
>;
export const onCreateCaseDocument = /* GraphQL */ `subscription OnCreateCaseDocument(
  $filter: ModelSubscriptionCaseDocumentFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onCreateCaseDocument(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
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
` as GeneratedSubscription<
  APITypes.OnCreateCaseDocumentSubscriptionVariables,
  APITypes.OnCreateCaseDocumentSubscription
>;
export const onUpdateCaseDocument = /* GraphQL */ `subscription OnUpdateCaseDocument(
  $filter: ModelSubscriptionCaseDocumentFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onUpdateCaseDocument(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateCaseDocumentSubscriptionVariables,
  APITypes.OnUpdateCaseDocumentSubscription
>;
export const onDeleteCaseDocument = /* GraphQL */ `subscription OnDeleteCaseDocument(
  $filter: ModelSubscriptionCaseDocumentFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onDeleteCaseDocument(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteCaseDocumentSubscriptionVariables,
  APITypes.OnDeleteCaseDocumentSubscription
>;
export const onCreatePayment = /* GraphQL */ `subscription OnCreatePayment(
  $filter: ModelSubscriptionPaymentFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onCreatePayment(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePaymentSubscriptionVariables,
  APITypes.OnCreatePaymentSubscription
>;
export const onUpdatePayment = /* GraphQL */ `subscription OnUpdatePayment(
  $filter: ModelSubscriptionPaymentFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onUpdatePayment(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePaymentSubscriptionVariables,
  APITypes.OnUpdatePaymentSubscription
>;
export const onDeletePayment = /* GraphQL */ `subscription OnDeletePayment(
  $filter: ModelSubscriptionPaymentFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onDeletePayment(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePaymentSubscriptionVariables,
  APITypes.OnDeletePaymentSubscription
>;
export const onCreateMessage = /* GraphQL */ `subscription OnCreateMessage(
  $filter: ModelSubscriptionMessageFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onCreateMessage(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
    id
    caseId
    clientOwner
    proOwner
    senderRole
    body
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateMessageSubscriptionVariables,
  APITypes.OnCreateMessageSubscription
>;
export const onUpdateMessage = /* GraphQL */ `subscription OnUpdateMessage(
  $filter: ModelSubscriptionMessageFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onUpdateMessage(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
    id
    caseId
    clientOwner
    proOwner
    senderRole
    body
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateMessageSubscriptionVariables,
  APITypes.OnUpdateMessageSubscription
>;
export const onDeleteMessage = /* GraphQL */ `subscription OnDeleteMessage(
  $filter: ModelSubscriptionMessageFilterInput
  $clientOwner: String
  $proOwner: String
) {
  onDeleteMessage(
    filter: $filter
    clientOwner: $clientOwner
    proOwner: $proOwner
  ) {
    id
    caseId
    clientOwner
    proOwner
    senderRole
    body
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteMessageSubscriptionVariables,
  APITypes.OnDeleteMessageSubscription
>;
export const onCreateProfessionalAgenda = /* GraphQL */ `subscription OnCreateProfessionalAgenda(
  $filter: ModelSubscriptionProfessionalAgendaFilterInput
  $professionalId: String
) {
  onCreateProfessionalAgenda(filter: $filter, professionalId: $professionalId) {
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
` as GeneratedSubscription<
  APITypes.OnCreateProfessionalAgendaSubscriptionVariables,
  APITypes.OnCreateProfessionalAgendaSubscription
>;
export const onUpdateProfessionalAgenda = /* GraphQL */ `subscription OnUpdateProfessionalAgenda(
  $filter: ModelSubscriptionProfessionalAgendaFilterInput
  $professionalId: String
) {
  onUpdateProfessionalAgenda(filter: $filter, professionalId: $professionalId) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateProfessionalAgendaSubscriptionVariables,
  APITypes.OnUpdateProfessionalAgendaSubscription
>;
export const onDeleteProfessionalAgenda = /* GraphQL */ `subscription OnDeleteProfessionalAgenda(
  $filter: ModelSubscriptionProfessionalAgendaFilterInput
  $professionalId: String
) {
  onDeleteProfessionalAgenda(filter: $filter, professionalId: $professionalId) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteProfessionalAgendaSubscriptionVariables,
  APITypes.OnDeleteProfessionalAgendaSubscription
>;
