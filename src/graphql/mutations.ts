/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createUserProfile = /* GraphQL */ `mutation CreateUserProfile(
  $input: CreateUserProfileInput!
  $condition: ModelUserProfileConditionInput
) {
  createUserProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserProfileMutationVariables,
  APITypes.CreateUserProfileMutation
>;
export const updateUserProfile = /* GraphQL */ `mutation UpdateUserProfile(
  $input: UpdateUserProfileInput!
  $condition: ModelUserProfileConditionInput
) {
  updateUserProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserProfileMutationVariables,
  APITypes.UpdateUserProfileMutation
>;
export const deleteUserProfile = /* GraphQL */ `mutation DeleteUserProfile(
  $input: DeleteUserProfileInput!
  $condition: ModelUserProfileConditionInput
) {
  deleteUserProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserProfileMutationVariables,
  APITypes.DeleteUserProfileMutation
>;
export const createProfessionalProfile = /* GraphQL */ `mutation CreateProfessionalProfile(
  $input: CreateProfessionalProfileInput!
  $condition: ModelProfessionalProfileConditionInput
) {
  createProfessionalProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateProfessionalProfileMutationVariables,
  APITypes.CreateProfessionalProfileMutation
>;
export const updateProfessionalProfile = /* GraphQL */ `mutation UpdateProfessionalProfile(
  $input: UpdateProfessionalProfileInput!
  $condition: ModelProfessionalProfileConditionInput
) {
  updateProfessionalProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateProfessionalProfileMutationVariables,
  APITypes.UpdateProfessionalProfileMutation
>;
export const deleteProfessionalProfile = /* GraphQL */ `mutation DeleteProfessionalProfile(
  $input: DeleteProfessionalProfileInput!
  $condition: ModelProfessionalProfileConditionInput
) {
  deleteProfessionalProfile(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteProfessionalProfileMutationVariables,
  APITypes.DeleteProfessionalProfileMutation
>;
export const createSurveyResponse = /* GraphQL */ `mutation CreateSurveyResponse(
  $input: CreateSurveyResponseInput!
  $condition: ModelSurveyResponseConditionInput
) {
  createSurveyResponse(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateSurveyResponseMutationVariables,
  APITypes.CreateSurveyResponseMutation
>;
export const updateSurveyResponse = /* GraphQL */ `mutation UpdateSurveyResponse(
  $input: UpdateSurveyResponseInput!
  $condition: ModelSurveyResponseConditionInput
) {
  updateSurveyResponse(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateSurveyResponseMutationVariables,
  APITypes.UpdateSurveyResponseMutation
>;
export const deleteSurveyResponse = /* GraphQL */ `mutation DeleteSurveyResponse(
  $input: DeleteSurveyResponseInput!
  $condition: ModelSurveyResponseConditionInput
) {
  deleteSurveyResponse(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteSurveyResponseMutationVariables,
  APITypes.DeleteSurveyResponseMutation
>;
export const createAppointment = /* GraphQL */ `mutation CreateAppointment(
  $input: CreateAppointmentInput!
  $condition: ModelAppointmentConditionInput
) {
  createAppointment(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateAppointmentMutationVariables,
  APITypes.CreateAppointmentMutation
>;
export const updateAppointment = /* GraphQL */ `mutation UpdateAppointment(
  $input: UpdateAppointmentInput!
  $condition: ModelAppointmentConditionInput
) {
  updateAppointment(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateAppointmentMutationVariables,
  APITypes.UpdateAppointmentMutation
>;
export const deleteAppointment = /* GraphQL */ `mutation DeleteAppointment(
  $input: DeleteAppointmentInput!
  $condition: ModelAppointmentConditionInput
) {
  deleteAppointment(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteAppointmentMutationVariables,
  APITypes.DeleteAppointmentMutation
>;
export const createCase = /* GraphQL */ `mutation CreateCase(
  $input: CreateCaseInput!
  $condition: ModelCaseConditionInput
) {
  createCase(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateCaseMutationVariables,
  APITypes.CreateCaseMutation
>;
export const updateCase = /* GraphQL */ `mutation UpdateCase(
  $input: UpdateCaseInput!
  $condition: ModelCaseConditionInput
) {
  updateCase(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateCaseMutationVariables,
  APITypes.UpdateCaseMutation
>;
export const deleteCase = /* GraphQL */ `mutation DeleteCase(
  $input: DeleteCaseInput!
  $condition: ModelCaseConditionInput
) {
  deleteCase(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteCaseMutationVariables,
  APITypes.DeleteCaseMutation
>;
export const createCaseDocument = /* GraphQL */ `mutation CreateCaseDocument(
  $input: CreateCaseDocumentInput!
  $condition: ModelCaseDocumentConditionInput
) {
  createCaseDocument(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateCaseDocumentMutationVariables,
  APITypes.CreateCaseDocumentMutation
>;
export const updateCaseDocument = /* GraphQL */ `mutation UpdateCaseDocument(
  $input: UpdateCaseDocumentInput!
  $condition: ModelCaseDocumentConditionInput
) {
  updateCaseDocument(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateCaseDocumentMutationVariables,
  APITypes.UpdateCaseDocumentMutation
>;
export const deleteCaseDocument = /* GraphQL */ `mutation DeleteCaseDocument(
  $input: DeleteCaseDocumentInput!
  $condition: ModelCaseDocumentConditionInput
) {
  deleteCaseDocument(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteCaseDocumentMutationVariables,
  APITypes.DeleteCaseDocumentMutation
>;
export const createPayment = /* GraphQL */ `mutation CreatePayment(
  $input: CreatePaymentInput!
  $condition: ModelPaymentConditionInput
) {
  createPayment(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreatePaymentMutationVariables,
  APITypes.CreatePaymentMutation
>;
export const updatePayment = /* GraphQL */ `mutation UpdatePayment(
  $input: UpdatePaymentInput!
  $condition: ModelPaymentConditionInput
) {
  updatePayment(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdatePaymentMutationVariables,
  APITypes.UpdatePaymentMutation
>;
export const deletePayment = /* GraphQL */ `mutation DeletePayment(
  $input: DeletePaymentInput!
  $condition: ModelPaymentConditionInput
) {
  deletePayment(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeletePaymentMutationVariables,
  APITypes.DeletePaymentMutation
>;
export const createProfessionalAgenda = /* GraphQL */ `mutation CreateProfessionalAgenda(
  $input: CreateProfessionalAgendaInput!
  $condition: ModelProfessionalAgendaConditionInput
) {
  createProfessionalAgenda(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateProfessionalAgendaMutationVariables,
  APITypes.CreateProfessionalAgendaMutation
>;
export const updateProfessionalAgenda = /* GraphQL */ `mutation UpdateProfessionalAgenda(
  $input: UpdateProfessionalAgendaInput!
  $condition: ModelProfessionalAgendaConditionInput
) {
  updateProfessionalAgenda(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateProfessionalAgendaMutationVariables,
  APITypes.UpdateProfessionalAgendaMutation
>;
export const deleteProfessionalAgenda = /* GraphQL */ `mutation DeleteProfessionalAgenda(
  $input: DeleteProfessionalAgendaInput!
  $condition: ModelProfessionalAgendaConditionInput
) {
  deleteProfessionalAgenda(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteProfessionalAgendaMutationVariables,
  APITypes.DeleteProfessionalAgendaMutation
>;
