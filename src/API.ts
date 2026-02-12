/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserProfileInput = {
  id?: string | null,
  owner: string,
  role: UserRole,
  email?: string | null,
  firstName?: string | null,
  lastName?: string | null,
};

export enum UserRole {
  CLIENT = "CLIENT",
  PRO = "PRO",
}


export type ModelUserProfileConditionInput = {
  owner?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  email?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  and?: Array< ModelUserProfileConditionInput | null > | null,
  or?: Array< ModelUserProfileConditionInput | null > | null,
  not?: ModelUserProfileConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelUserRoleInput = {
  eq?: UserRole | null,
  ne?: UserRole | null,
};

export type UserProfile = {
  __typename: "UserProfile",
  id: string,
  owner: string,
  role: UserRole,
  email?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateUserProfileInput = {
  id: string,
  owner?: string | null,
  role?: UserRole | null,
  email?: string | null,
  firstName?: string | null,
  lastName?: string | null,
};

export type DeleteUserProfileInput = {
  id: string,
};

export type CreateProfessionalProfileInput = {
  id?: string | null,
  owner: string,
  proType: ProType,
  displayName: string,
  bio?: string | null,
  ratingAvg?: number | null,
  ratingCount?: number | null,
  isActive?: boolean | null,
};

export enum ProType {
  TAX = "TAX",
  LEGAL = "LEGAL",
  OTHER = "OTHER",
}


export type ModelProfessionalProfileConditionInput = {
  owner?: ModelStringInput | null,
  proType?: ModelProTypeInput | null,
  displayName?: ModelStringInput | null,
  bio?: ModelStringInput | null,
  ratingAvg?: ModelFloatInput | null,
  ratingCount?: ModelIntInput | null,
  isActive?: ModelBooleanInput | null,
  and?: Array< ModelProfessionalProfileConditionInput | null > | null,
  or?: Array< ModelProfessionalProfileConditionInput | null > | null,
  not?: ModelProfessionalProfileConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelProTypeInput = {
  eq?: ProType | null,
  ne?: ProType | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ProfessionalProfile = {
  __typename: "ProfessionalProfile",
  id: string,
  owner: string,
  proType: ProType,
  displayName: string,
  bio?: string | null,
  ratingAvg?: number | null,
  ratingCount?: number | null,
  isActive?: boolean | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateProfessionalProfileInput = {
  id: string,
  owner?: string | null,
  proType?: ProType | null,
  displayName?: string | null,
  bio?: string | null,
  ratingAvg?: number | null,
  ratingCount?: number | null,
  isActive?: boolean | null,
};

export type DeleteProfessionalProfileInput = {
  id: string,
};

export type CreateSurveyResponseInput = {
  id?: string | null,
  owner: string,
  proOwner?: string | null,
  professionalId?: string | null,
  answersJson: string,
};

export type ModelSurveyResponseConditionInput = {
  owner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
  professionalId?: ModelIDInput | null,
  answersJson?: ModelStringInput | null,
  and?: Array< ModelSurveyResponseConditionInput | null > | null,
  or?: Array< ModelSurveyResponseConditionInput | null > | null,
  not?: ModelSurveyResponseConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type SurveyResponse = {
  __typename: "SurveyResponse",
  id: string,
  owner: string,
  proOwner?: string | null,
  professionalId?: string | null,
  answersJson: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateSurveyResponseInput = {
  id: string,
  owner?: string | null,
  proOwner?: string | null,
  professionalId?: string | null,
  answersJson?: string | null,
};

export type DeleteSurveyResponseInput = {
  id: string,
};

export type CreateAppointmentInput = {
  id?: string | null,
  clientOwner: string,
  clientName?: string | null,
  clientEmail?: string | null,
  proOwner: string,
  professionalId: string,
  requestedStart: string,
  requestedEnd: string,
  status: AppointmentStatus,
  proposedStart?: string | null,
  proposedEnd?: string | null,
  notes?: string | null,
  meetingId?: string | null,
  meetingRegion?: string | null,
  meetingData?: string | null,
  clientAttendeeId?: string | null,
  proAttendeeId?: string | null,
  clientJoinToken?: string | null,
  proJoinToken?: string | null,
  caseId?: string | null,
};

export enum AppointmentStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  RESCHEDULE_PROPOSED = "RESCHEDULE_PROPOSED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}


export type ModelAppointmentConditionInput = {
  clientOwner?: ModelStringInput | null,
  clientName?: ModelStringInput | null,
  clientEmail?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
  professionalId?: ModelIDInput | null,
  requestedStart?: ModelStringInput | null,
  requestedEnd?: ModelStringInput | null,
  status?: ModelAppointmentStatusInput | null,
  proposedStart?: ModelStringInput | null,
  proposedEnd?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  meetingId?: ModelStringInput | null,
  meetingRegion?: ModelStringInput | null,
  meetingData?: ModelStringInput | null,
  clientAttendeeId?: ModelStringInput | null,
  proAttendeeId?: ModelStringInput | null,
  clientJoinToken?: ModelStringInput | null,
  proJoinToken?: ModelStringInput | null,
  caseId?: ModelIDInput | null,
  and?: Array< ModelAppointmentConditionInput | null > | null,
  or?: Array< ModelAppointmentConditionInput | null > | null,
  not?: ModelAppointmentConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelAppointmentStatusInput = {
  eq?: AppointmentStatus | null,
  ne?: AppointmentStatus | null,
};

export type Appointment = {
  __typename: "Appointment",
  id: string,
  clientOwner: string,
  clientName?: string | null,
  clientEmail?: string | null,
  proOwner: string,
  professionalId: string,
  requestedStart: string,
  requestedEnd: string,
  status: AppointmentStatus,
  proposedStart?: string | null,
  proposedEnd?: string | null,
  notes?: string | null,
  meetingId?: string | null,
  meetingRegion?: string | null,
  meetingData?: string | null,
  clientAttendeeId?: string | null,
  proAttendeeId?: string | null,
  clientJoinToken?: string | null,
  proJoinToken?: string | null,
  caseId?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateAppointmentInput = {
  id: string,
  clientOwner?: string | null,
  clientName?: string | null,
  clientEmail?: string | null,
  proOwner?: string | null,
  professionalId?: string | null,
  requestedStart?: string | null,
  requestedEnd?: string | null,
  status?: AppointmentStatus | null,
  proposedStart?: string | null,
  proposedEnd?: string | null,
  notes?: string | null,
  meetingId?: string | null,
  meetingRegion?: string | null,
  meetingData?: string | null,
  clientAttendeeId?: string | null,
  proAttendeeId?: string | null,
  clientJoinToken?: string | null,
  proJoinToken?: string | null,
  caseId?: string | null,
};

export type DeleteAppointmentInput = {
  id: string,
};

export type CreateCaseInput = {
  id?: string | null,
  caseNumber: string,
  clientOwner: string,
  proOwner: string,
  professionalId: string,
  appointmentId: string,
  status: CaseStatus,
  servicePriceCents?: number | null,
  currency?: string | null,
};

export enum CaseStatus {
  AWAITING_PRO_SELECTION = "AWAITING_PRO_SELECTION",
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}


export type ModelCaseConditionInput = {
  caseNumber?: ModelStringInput | null,
  clientOwner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
  professionalId?: ModelIDInput | null,
  appointmentId?: ModelIDInput | null,
  status?: ModelCaseStatusInput | null,
  servicePriceCents?: ModelIntInput | null,
  currency?: ModelStringInput | null,
  and?: Array< ModelCaseConditionInput | null > | null,
  or?: Array< ModelCaseConditionInput | null > | null,
  not?: ModelCaseConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelCaseStatusInput = {
  eq?: CaseStatus | null,
  ne?: CaseStatus | null,
};

export type Case = {
  __typename: "Case",
  id: string,
  caseNumber: string,
  clientOwner: string,
  proOwner: string,
  professionalId: string,
  appointmentId: string,
  status: CaseStatus,
  servicePriceCents?: number | null,
  currency?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateCaseInput = {
  id: string,
  caseNumber?: string | null,
  clientOwner?: string | null,
  proOwner?: string | null,
  professionalId?: string | null,
  appointmentId?: string | null,
  status?: CaseStatus | null,
  servicePriceCents?: number | null,
  currency?: string | null,
};

export type DeleteCaseInput = {
  id: string,
};

export type CreateCaseDocumentInput = {
  id?: string | null,
  caseId: string,
  caseNumber: string,
  clientOwner: string,
  proOwner: string,
  professionalId: string,
  title: string,
  required?: boolean | null,
  status: DocStatus,
  fileName?: string | null,
  fileType?: string | null,
  s3Key?: string | null,
  uploadedAt?: string | null,
  reviewNotes?: string | null,
  createdAt?: string | null,
};

export enum DocStatus {
  REQUESTED = "REQUESTED",
  UPLOADED = "UPLOADED",
  IN_REVIEW = "IN_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}


export type ModelCaseDocumentConditionInput = {
  caseId?: ModelIDInput | null,
  caseNumber?: ModelStringInput | null,
  clientOwner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
  professionalId?: ModelIDInput | null,
  title?: ModelStringInput | null,
  required?: ModelBooleanInput | null,
  status?: ModelDocStatusInput | null,
  fileName?: ModelStringInput | null,
  fileType?: ModelStringInput | null,
  s3Key?: ModelStringInput | null,
  uploadedAt?: ModelStringInput | null,
  reviewNotes?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelCaseDocumentConditionInput | null > | null,
  or?: Array< ModelCaseDocumentConditionInput | null > | null,
  not?: ModelCaseDocumentConditionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelDocStatusInput = {
  eq?: DocStatus | null,
  ne?: DocStatus | null,
};

export type CaseDocument = {
  __typename: "CaseDocument",
  id: string,
  caseId: string,
  caseNumber: string,
  clientOwner: string,
  proOwner: string,
  professionalId: string,
  title: string,
  required?: boolean | null,
  status: DocStatus,
  fileName?: string | null,
  fileType?: string | null,
  s3Key?: string | null,
  uploadedAt?: string | null,
  reviewNotes?: string | null,
  createdAt?: string | null,
  updatedAt: string,
};

export type UpdateCaseDocumentInput = {
  id: string,
  caseId?: string | null,
  caseNumber?: string | null,
  clientOwner?: string | null,
  proOwner?: string | null,
  professionalId?: string | null,
  title?: string | null,
  required?: boolean | null,
  status?: DocStatus | null,
  fileName?: string | null,
  fileType?: string | null,
  s3Key?: string | null,
  uploadedAt?: string | null,
  reviewNotes?: string | null,
  createdAt?: string | null,
};

export type DeleteCaseDocumentInput = {
  id: string,
};

export type CreatePaymentInput = {
  id?: string | null,
  clientOwner: string,
  proOwner?: string | null,
  professionalId?: string | null,
  appointmentId?: string | null,
  caseId?: string | null,
  type: PaymentType,
  amountCents: number,
  currency: string,
  status: PaymentStatus,
  squareCheckoutId?: string | null,
  squarePaymentId?: string | null,
};

export enum PaymentType {
  UNLOCK_150 = "UNLOCK_150",
  SERVICE_50_FIRST = "SERVICE_50_FIRST",
  SERVICE_50_FINAL = "SERVICE_50_FINAL",
}


export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}


export type ModelPaymentConditionInput = {
  clientOwner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
  professionalId?: ModelIDInput | null,
  appointmentId?: ModelIDInput | null,
  caseId?: ModelIDInput | null,
  type?: ModelPaymentTypeInput | null,
  amountCents?: ModelIntInput | null,
  currency?: ModelStringInput | null,
  status?: ModelPaymentStatusInput | null,
  squareCheckoutId?: ModelStringInput | null,
  squarePaymentId?: ModelStringInput | null,
  and?: Array< ModelPaymentConditionInput | null > | null,
  or?: Array< ModelPaymentConditionInput | null > | null,
  not?: ModelPaymentConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelPaymentTypeInput = {
  eq?: PaymentType | null,
  ne?: PaymentType | null,
};

export type ModelPaymentStatusInput = {
  eq?: PaymentStatus | null,
  ne?: PaymentStatus | null,
};

export type Payment = {
  __typename: "Payment",
  id: string,
  clientOwner: string,
  proOwner?: string | null,
  professionalId?: string | null,
  appointmentId?: string | null,
  caseId?: string | null,
  type: PaymentType,
  amountCents: number,
  currency: string,
  status: PaymentStatus,
  squareCheckoutId?: string | null,
  squarePaymentId?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdatePaymentInput = {
  id: string,
  clientOwner?: string | null,
  proOwner?: string | null,
  professionalId?: string | null,
  appointmentId?: string | null,
  caseId?: string | null,
  type?: PaymentType | null,
  amountCents?: number | null,
  currency?: string | null,
  status?: PaymentStatus | null,
  squareCheckoutId?: string | null,
  squarePaymentId?: string | null,
};

export type DeletePaymentInput = {
  id: string,
};

export type CreateMessageInput = {
  id?: string | null,
  caseId: string,
  clientOwner: string,
  proOwner: string,
  senderRole: string,
  body: string,
  createdAt?: string | null,
};

export type ModelMessageConditionInput = {
  caseId?: ModelIDInput | null,
  clientOwner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
  senderRole?: ModelStringInput | null,
  body?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelMessageConditionInput | null > | null,
  or?: Array< ModelMessageConditionInput | null > | null,
  not?: ModelMessageConditionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type Message = {
  __typename: "Message",
  id: string,
  caseId: string,
  clientOwner: string,
  proOwner: string,
  senderRole: string,
  body: string,
  createdAt?: string | null,
  updatedAt: string,
};

export type UpdateMessageInput = {
  id: string,
  caseId?: string | null,
  clientOwner?: string | null,
  proOwner?: string | null,
  senderRole?: string | null,
  body?: string | null,
  createdAt?: string | null,
};

export type DeleteMessageInput = {
  id: string,
};

export type CreateProfessionalAgendaInput = {
  id?: string | null,
  professionalId: string,
  clientId?: string | null,
  date: string,
  time: string,
  endTime?: string | null,
  status: ProfessionalAgendaStatus,
  meetingLink?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export enum ProfessionalAgendaStatus {
  AVAILABLE = "AVAILABLE",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  MOVED = "MOVED",
  REJECTED = "REJECTED",
}


export type ModelProfessionalAgendaConditionInput = {
  professionalId?: ModelIDInput | null,
  clientId?: ModelIDInput | null,
  date?: ModelStringInput | null,
  time?: ModelStringInput | null,
  endTime?: ModelStringInput | null,
  status?: ModelProfessionalAgendaStatusInput | null,
  meetingLink?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelProfessionalAgendaConditionInput | null > | null,
  or?: Array< ModelProfessionalAgendaConditionInput | null > | null,
  not?: ModelProfessionalAgendaConditionInput | null,
};

export type ModelProfessionalAgendaStatusInput = {
  eq?: ProfessionalAgendaStatus | null,
  ne?: ProfessionalAgendaStatus | null,
};

export type ProfessionalAgenda = {
  __typename: "ProfessionalAgenda",
  id: string,
  professionalId: string,
  clientId?: string | null,
  date: string,
  time: string,
  endTime?: string | null,
  status: ProfessionalAgendaStatus,
  meetingLink?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type UpdateProfessionalAgendaInput = {
  id: string,
  professionalId?: string | null,
  clientId?: string | null,
  date?: string | null,
  time?: string | null,
  endTime?: string | null,
  status?: ProfessionalAgendaStatus | null,
  meetingLink?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteProfessionalAgendaInput = {
  id: string,
};

export type ModelUserProfileFilterInput = {
  id?: ModelIDInput | null,
  owner?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  email?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserProfileFilterInput | null > | null,
  or?: Array< ModelUserProfileFilterInput | null > | null,
  not?: ModelUserProfileFilterInput | null,
};

export type ModelUserProfileConnection = {
  __typename: "ModelUserProfileConnection",
  items:  Array<UserProfile | null >,
  nextToken?: string | null,
};

export type ModelProfessionalProfileFilterInput = {
  id?: ModelIDInput | null,
  owner?: ModelStringInput | null,
  proType?: ModelProTypeInput | null,
  displayName?: ModelStringInput | null,
  bio?: ModelStringInput | null,
  ratingAvg?: ModelFloatInput | null,
  ratingCount?: ModelIntInput | null,
  isActive?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelProfessionalProfileFilterInput | null > | null,
  or?: Array< ModelProfessionalProfileFilterInput | null > | null,
  not?: ModelProfessionalProfileFilterInput | null,
};

export type ModelProfessionalProfileConnection = {
  __typename: "ModelProfessionalProfileConnection",
  items:  Array<ProfessionalProfile | null >,
  nextToken?: string | null,
};

export type ModelSurveyResponseFilterInput = {
  id?: ModelIDInput | null,
  owner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
  professionalId?: ModelIDInput | null,
  answersJson?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelSurveyResponseFilterInput | null > | null,
  or?: Array< ModelSurveyResponseFilterInput | null > | null,
  not?: ModelSurveyResponseFilterInput | null,
};

export type ModelSurveyResponseConnection = {
  __typename: "ModelSurveyResponseConnection",
  items:  Array<SurveyResponse | null >,
  nextToken?: string | null,
};

export type ModelAppointmentFilterInput = {
  id?: ModelIDInput | null,
  clientOwner?: ModelStringInput | null,
  clientName?: ModelStringInput | null,
  clientEmail?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
  professionalId?: ModelIDInput | null,
  requestedStart?: ModelStringInput | null,
  requestedEnd?: ModelStringInput | null,
  status?: ModelAppointmentStatusInput | null,
  proposedStart?: ModelStringInput | null,
  proposedEnd?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  meetingId?: ModelStringInput | null,
  meetingRegion?: ModelStringInput | null,
  meetingData?: ModelStringInput | null,
  clientAttendeeId?: ModelStringInput | null,
  proAttendeeId?: ModelStringInput | null,
  clientJoinToken?: ModelStringInput | null,
  proJoinToken?: ModelStringInput | null,
  caseId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAppointmentFilterInput | null > | null,
  or?: Array< ModelAppointmentFilterInput | null > | null,
  not?: ModelAppointmentFilterInput | null,
};

export type ModelAppointmentConnection = {
  __typename: "ModelAppointmentConnection",
  items:  Array<Appointment | null >,
  nextToken?: string | null,
};

export type ModelCaseFilterInput = {
  id?: ModelIDInput | null,
  caseNumber?: ModelStringInput | null,
  clientOwner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
  professionalId?: ModelIDInput | null,
  appointmentId?: ModelIDInput | null,
  status?: ModelCaseStatusInput | null,
  servicePriceCents?: ModelIntInput | null,
  currency?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelCaseFilterInput | null > | null,
  or?: Array< ModelCaseFilterInput | null > | null,
  not?: ModelCaseFilterInput | null,
};

export type ModelCaseConnection = {
  __typename: "ModelCaseConnection",
  items:  Array<Case | null >,
  nextToken?: string | null,
};

export type ModelCaseDocumentFilterInput = {
  id?: ModelIDInput | null,
  caseId?: ModelIDInput | null,
  caseNumber?: ModelStringInput | null,
  clientOwner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
  professionalId?: ModelIDInput | null,
  title?: ModelStringInput | null,
  required?: ModelBooleanInput | null,
  status?: ModelDocStatusInput | null,
  fileName?: ModelStringInput | null,
  fileType?: ModelStringInput | null,
  s3Key?: ModelStringInput | null,
  uploadedAt?: ModelStringInput | null,
  reviewNotes?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelCaseDocumentFilterInput | null > | null,
  or?: Array< ModelCaseDocumentFilterInput | null > | null,
  not?: ModelCaseDocumentFilterInput | null,
};

export type ModelCaseDocumentConnection = {
  __typename: "ModelCaseDocumentConnection",
  items:  Array<CaseDocument | null >,
  nextToken?: string | null,
};

export type ModelPaymentFilterInput = {
  id?: ModelIDInput | null,
  clientOwner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
  professionalId?: ModelIDInput | null,
  appointmentId?: ModelIDInput | null,
  caseId?: ModelIDInput | null,
  type?: ModelPaymentTypeInput | null,
  amountCents?: ModelIntInput | null,
  currency?: ModelStringInput | null,
  status?: ModelPaymentStatusInput | null,
  squareCheckoutId?: ModelStringInput | null,
  squarePaymentId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPaymentFilterInput | null > | null,
  or?: Array< ModelPaymentFilterInput | null > | null,
  not?: ModelPaymentFilterInput | null,
};

export type ModelPaymentConnection = {
  __typename: "ModelPaymentConnection",
  items:  Array<Payment | null >,
  nextToken?: string | null,
};

export type ModelMessageFilterInput = {
  id?: ModelIDInput | null,
  caseId?: ModelIDInput | null,
  clientOwner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
  senderRole?: ModelStringInput | null,
  body?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMessageFilterInput | null > | null,
  or?: Array< ModelMessageFilterInput | null > | null,
  not?: ModelMessageFilterInput | null,
};

export type ModelMessageConnection = {
  __typename: "ModelMessageConnection",
  items:  Array<Message | null >,
  nextToken?: string | null,
};

export type ModelProfessionalAgendaFilterInput = {
  id?: ModelIDInput | null,
  professionalId?: ModelIDInput | null,
  clientId?: ModelIDInput | null,
  date?: ModelStringInput | null,
  time?: ModelStringInput | null,
  endTime?: ModelStringInput | null,
  status?: ModelProfessionalAgendaStatusInput | null,
  meetingLink?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelProfessionalAgendaFilterInput | null > | null,
  or?: Array< ModelProfessionalAgendaFilterInput | null > | null,
  not?: ModelProfessionalAgendaFilterInput | null,
};

export type ModelProfessionalAgendaConnection = {
  __typename: "ModelProfessionalAgendaConnection",
  items:  Array<ProfessionalAgenda | null >,
  nextToken?: string | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelProfessionalAgendaByProfessionalIdCompositeKeyConditionInput = {
  eq?: ModelProfessionalAgendaByProfessionalIdCompositeKeyInput | null,
  le?: ModelProfessionalAgendaByProfessionalIdCompositeKeyInput | null,
  lt?: ModelProfessionalAgendaByProfessionalIdCompositeKeyInput | null,
  ge?: ModelProfessionalAgendaByProfessionalIdCompositeKeyInput | null,
  gt?: ModelProfessionalAgendaByProfessionalIdCompositeKeyInput | null,
  between?: Array< ModelProfessionalAgendaByProfessionalIdCompositeKeyInput | null > | null,
  beginsWith?: ModelProfessionalAgendaByProfessionalIdCompositeKeyInput | null,
};

export type ModelProfessionalAgendaByProfessionalIdCompositeKeyInput = {
  date?: string | null,
  time?: string | null,
};

export type ModelSubscriptionUserProfileFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  role?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserProfileFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionProfessionalProfileFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  proType?: ModelSubscriptionStringInput | null,
  displayName?: ModelSubscriptionStringInput | null,
  bio?: ModelSubscriptionStringInput | null,
  ratingAvg?: ModelSubscriptionFloatInput | null,
  ratingCount?: ModelSubscriptionIntInput | null,
  isActive?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionProfessionalProfileFilterInput | null > | null,
  or?: Array< ModelSubscriptionProfessionalProfileFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionSurveyResponseFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  professionalId?: ModelSubscriptionIDInput | null,
  answersJson?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionSurveyResponseFilterInput | null > | null,
  or?: Array< ModelSubscriptionSurveyResponseFilterInput | null > | null,
  owner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
};

export type ModelSubscriptionAppointmentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  clientName?: ModelSubscriptionStringInput | null,
  clientEmail?: ModelSubscriptionStringInput | null,
  professionalId?: ModelSubscriptionIDInput | null,
  requestedStart?: ModelSubscriptionStringInput | null,
  requestedEnd?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  proposedStart?: ModelSubscriptionStringInput | null,
  proposedEnd?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  meetingId?: ModelSubscriptionStringInput | null,
  meetingRegion?: ModelSubscriptionStringInput | null,
  meetingData?: ModelSubscriptionStringInput | null,
  clientAttendeeId?: ModelSubscriptionStringInput | null,
  proAttendeeId?: ModelSubscriptionStringInput | null,
  clientJoinToken?: ModelSubscriptionStringInput | null,
  proJoinToken?: ModelSubscriptionStringInput | null,
  caseId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAppointmentFilterInput | null > | null,
  or?: Array< ModelSubscriptionAppointmentFilterInput | null > | null,
  clientOwner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
};

export type ModelSubscriptionCaseFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  caseNumber?: ModelSubscriptionStringInput | null,
  professionalId?: ModelSubscriptionIDInput | null,
  appointmentId?: ModelSubscriptionIDInput | null,
  status?: ModelSubscriptionStringInput | null,
  servicePriceCents?: ModelSubscriptionIntInput | null,
  currency?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionCaseFilterInput | null > | null,
  or?: Array< ModelSubscriptionCaseFilterInput | null > | null,
  clientOwner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
};

export type ModelSubscriptionCaseDocumentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  caseId?: ModelSubscriptionIDInput | null,
  caseNumber?: ModelSubscriptionStringInput | null,
  professionalId?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  required?: ModelSubscriptionBooleanInput | null,
  status?: ModelSubscriptionStringInput | null,
  fileName?: ModelSubscriptionStringInput | null,
  fileType?: ModelSubscriptionStringInput | null,
  s3Key?: ModelSubscriptionStringInput | null,
  uploadedAt?: ModelSubscriptionStringInput | null,
  reviewNotes?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionCaseDocumentFilterInput | null > | null,
  or?: Array< ModelSubscriptionCaseDocumentFilterInput | null > | null,
  clientOwner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
};

export type ModelSubscriptionPaymentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  professionalId?: ModelSubscriptionIDInput | null,
  appointmentId?: ModelSubscriptionIDInput | null,
  caseId?: ModelSubscriptionIDInput | null,
  type?: ModelSubscriptionStringInput | null,
  amountCents?: ModelSubscriptionIntInput | null,
  currency?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  squareCheckoutId?: ModelSubscriptionStringInput | null,
  squarePaymentId?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPaymentFilterInput | null > | null,
  or?: Array< ModelSubscriptionPaymentFilterInput | null > | null,
  clientOwner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
};

export type ModelSubscriptionMessageFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  caseId?: ModelSubscriptionIDInput | null,
  senderRole?: ModelSubscriptionStringInput | null,
  body?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMessageFilterInput | null > | null,
  or?: Array< ModelSubscriptionMessageFilterInput | null > | null,
  clientOwner?: ModelStringInput | null,
  proOwner?: ModelStringInput | null,
};

export type ModelSubscriptionProfessionalAgendaFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  clientId?: ModelSubscriptionIDInput | null,
  date?: ModelSubscriptionStringInput | null,
  time?: ModelSubscriptionStringInput | null,
  endTime?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  meetingLink?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionProfessionalAgendaFilterInput | null > | null,
  or?: Array< ModelSubscriptionProfessionalAgendaFilterInput | null > | null,
  professionalId?: ModelStringInput | null,
};

export type CreateUserProfileMutationVariables = {
  input: CreateUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type CreateUserProfileMutation = {
  createUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner: string,
    role: UserRole,
    email?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserProfileMutationVariables = {
  input: UpdateUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type UpdateUserProfileMutation = {
  updateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner: string,
    role: UserRole,
    email?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserProfileMutationVariables = {
  input: DeleteUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type DeleteUserProfileMutation = {
  deleteUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner: string,
    role: UserRole,
    email?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateProfessionalProfileMutationVariables = {
  input: CreateProfessionalProfileInput,
  condition?: ModelProfessionalProfileConditionInput | null,
};

export type CreateProfessionalProfileMutation = {
  createProfessionalProfile?:  {
    __typename: "ProfessionalProfile",
    id: string,
    owner: string,
    proType: ProType,
    displayName: string,
    bio?: string | null,
    ratingAvg?: number | null,
    ratingCount?: number | null,
    isActive?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateProfessionalProfileMutationVariables = {
  input: UpdateProfessionalProfileInput,
  condition?: ModelProfessionalProfileConditionInput | null,
};

export type UpdateProfessionalProfileMutation = {
  updateProfessionalProfile?:  {
    __typename: "ProfessionalProfile",
    id: string,
    owner: string,
    proType: ProType,
    displayName: string,
    bio?: string | null,
    ratingAvg?: number | null,
    ratingCount?: number | null,
    isActive?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteProfessionalProfileMutationVariables = {
  input: DeleteProfessionalProfileInput,
  condition?: ModelProfessionalProfileConditionInput | null,
};

export type DeleteProfessionalProfileMutation = {
  deleteProfessionalProfile?:  {
    __typename: "ProfessionalProfile",
    id: string,
    owner: string,
    proType: ProType,
    displayName: string,
    bio?: string | null,
    ratingAvg?: number | null,
    ratingCount?: number | null,
    isActive?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateSurveyResponseMutationVariables = {
  input: CreateSurveyResponseInput,
  condition?: ModelSurveyResponseConditionInput | null,
};

export type CreateSurveyResponseMutation = {
  createSurveyResponse?:  {
    __typename: "SurveyResponse",
    id: string,
    owner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    answersJson: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateSurveyResponseMutationVariables = {
  input: UpdateSurveyResponseInput,
  condition?: ModelSurveyResponseConditionInput | null,
};

export type UpdateSurveyResponseMutation = {
  updateSurveyResponse?:  {
    __typename: "SurveyResponse",
    id: string,
    owner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    answersJson: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteSurveyResponseMutationVariables = {
  input: DeleteSurveyResponseInput,
  condition?: ModelSurveyResponseConditionInput | null,
};

export type DeleteSurveyResponseMutation = {
  deleteSurveyResponse?:  {
    __typename: "SurveyResponse",
    id: string,
    owner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    answersJson: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateAppointmentMutationVariables = {
  input: CreateAppointmentInput,
  condition?: ModelAppointmentConditionInput | null,
};

export type CreateAppointmentMutation = {
  createAppointment?:  {
    __typename: "Appointment",
    id: string,
    clientOwner: string,
    clientName?: string | null,
    clientEmail?: string | null,
    proOwner: string,
    professionalId: string,
    requestedStart: string,
    requestedEnd: string,
    status: AppointmentStatus,
    proposedStart?: string | null,
    proposedEnd?: string | null,
    notes?: string | null,
    meetingId?: string | null,
    meetingRegion?: string | null,
    meetingData?: string | null,
    clientAttendeeId?: string | null,
    proAttendeeId?: string | null,
    clientJoinToken?: string | null,
    proJoinToken?: string | null,
    caseId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateAppointmentMutationVariables = {
  input: UpdateAppointmentInput,
  condition?: ModelAppointmentConditionInput | null,
};

export type UpdateAppointmentMutation = {
  updateAppointment?:  {
    __typename: "Appointment",
    id: string,
    clientOwner: string,
    clientName?: string | null,
    clientEmail?: string | null,
    proOwner: string,
    professionalId: string,
    requestedStart: string,
    requestedEnd: string,
    status: AppointmentStatus,
    proposedStart?: string | null,
    proposedEnd?: string | null,
    notes?: string | null,
    meetingId?: string | null,
    meetingRegion?: string | null,
    meetingData?: string | null,
    clientAttendeeId?: string | null,
    proAttendeeId?: string | null,
    clientJoinToken?: string | null,
    proJoinToken?: string | null,
    caseId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteAppointmentMutationVariables = {
  input: DeleteAppointmentInput,
  condition?: ModelAppointmentConditionInput | null,
};

export type DeleteAppointmentMutation = {
  deleteAppointment?:  {
    __typename: "Appointment",
    id: string,
    clientOwner: string,
    clientName?: string | null,
    clientEmail?: string | null,
    proOwner: string,
    professionalId: string,
    requestedStart: string,
    requestedEnd: string,
    status: AppointmentStatus,
    proposedStart?: string | null,
    proposedEnd?: string | null,
    notes?: string | null,
    meetingId?: string | null,
    meetingRegion?: string | null,
    meetingData?: string | null,
    clientAttendeeId?: string | null,
    proAttendeeId?: string | null,
    clientJoinToken?: string | null,
    proJoinToken?: string | null,
    caseId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateCaseMutationVariables = {
  input: CreateCaseInput,
  condition?: ModelCaseConditionInput | null,
};

export type CreateCaseMutation = {
  createCase?:  {
    __typename: "Case",
    id: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    appointmentId: string,
    status: CaseStatus,
    servicePriceCents?: number | null,
    currency?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateCaseMutationVariables = {
  input: UpdateCaseInput,
  condition?: ModelCaseConditionInput | null,
};

export type UpdateCaseMutation = {
  updateCase?:  {
    __typename: "Case",
    id: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    appointmentId: string,
    status: CaseStatus,
    servicePriceCents?: number | null,
    currency?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteCaseMutationVariables = {
  input: DeleteCaseInput,
  condition?: ModelCaseConditionInput | null,
};

export type DeleteCaseMutation = {
  deleteCase?:  {
    __typename: "Case",
    id: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    appointmentId: string,
    status: CaseStatus,
    servicePriceCents?: number | null,
    currency?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateCaseDocumentMutationVariables = {
  input: CreateCaseDocumentInput,
  condition?: ModelCaseDocumentConditionInput | null,
};

export type CreateCaseDocumentMutation = {
  createCaseDocument?:  {
    __typename: "CaseDocument",
    id: string,
    caseId: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    title: string,
    required?: boolean | null,
    status: DocStatus,
    fileName?: string | null,
    fileType?: string | null,
    s3Key?: string | null,
    uploadedAt?: string | null,
    reviewNotes?: string | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateCaseDocumentMutationVariables = {
  input: UpdateCaseDocumentInput,
  condition?: ModelCaseDocumentConditionInput | null,
};

export type UpdateCaseDocumentMutation = {
  updateCaseDocument?:  {
    __typename: "CaseDocument",
    id: string,
    caseId: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    title: string,
    required?: boolean | null,
    status: DocStatus,
    fileName?: string | null,
    fileType?: string | null,
    s3Key?: string | null,
    uploadedAt?: string | null,
    reviewNotes?: string | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteCaseDocumentMutationVariables = {
  input: DeleteCaseDocumentInput,
  condition?: ModelCaseDocumentConditionInput | null,
};

export type DeleteCaseDocumentMutation = {
  deleteCaseDocument?:  {
    __typename: "CaseDocument",
    id: string,
    caseId: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    title: string,
    required?: boolean | null,
    status: DocStatus,
    fileName?: string | null,
    fileType?: string | null,
    s3Key?: string | null,
    uploadedAt?: string | null,
    reviewNotes?: string | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type CreatePaymentMutationVariables = {
  input: CreatePaymentInput,
  condition?: ModelPaymentConditionInput | null,
};

export type CreatePaymentMutation = {
  createPayment?:  {
    __typename: "Payment",
    id: string,
    clientOwner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    appointmentId?: string | null,
    caseId?: string | null,
    type: PaymentType,
    amountCents: number,
    currency: string,
    status: PaymentStatus,
    squareCheckoutId?: string | null,
    squarePaymentId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePaymentMutationVariables = {
  input: UpdatePaymentInput,
  condition?: ModelPaymentConditionInput | null,
};

export type UpdatePaymentMutation = {
  updatePayment?:  {
    __typename: "Payment",
    id: string,
    clientOwner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    appointmentId?: string | null,
    caseId?: string | null,
    type: PaymentType,
    amountCents: number,
    currency: string,
    status: PaymentStatus,
    squareCheckoutId?: string | null,
    squarePaymentId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePaymentMutationVariables = {
  input: DeletePaymentInput,
  condition?: ModelPaymentConditionInput | null,
};

export type DeletePaymentMutation = {
  deletePayment?:  {
    __typename: "Payment",
    id: string,
    clientOwner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    appointmentId?: string | null,
    caseId?: string | null,
    type: PaymentType,
    amountCents: number,
    currency: string,
    status: PaymentStatus,
    squareCheckoutId?: string | null,
    squarePaymentId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMessageMutationVariables = {
  input: CreateMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type CreateMessageMutation = {
  createMessage?:  {
    __typename: "Message",
    id: string,
    caseId: string,
    clientOwner: string,
    proOwner: string,
    senderRole: string,
    body: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateMessageMutationVariables = {
  input: UpdateMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type UpdateMessageMutation = {
  updateMessage?:  {
    __typename: "Message",
    id: string,
    caseId: string,
    clientOwner: string,
    proOwner: string,
    senderRole: string,
    body: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteMessageMutationVariables = {
  input: DeleteMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type DeleteMessageMutation = {
  deleteMessage?:  {
    __typename: "Message",
    id: string,
    caseId: string,
    clientOwner: string,
    proOwner: string,
    senderRole: string,
    body: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateProfessionalAgendaMutationVariables = {
  input: CreateProfessionalAgendaInput,
  condition?: ModelProfessionalAgendaConditionInput | null,
};

export type CreateProfessionalAgendaMutation = {
  createProfessionalAgenda?:  {
    __typename: "ProfessionalAgenda",
    id: string,
    professionalId: string,
    clientId?: string | null,
    date: string,
    time: string,
    endTime?: string | null,
    status: ProfessionalAgendaStatus,
    meetingLink?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type UpdateProfessionalAgendaMutationVariables = {
  input: UpdateProfessionalAgendaInput,
  condition?: ModelProfessionalAgendaConditionInput | null,
};

export type UpdateProfessionalAgendaMutation = {
  updateProfessionalAgenda?:  {
    __typename: "ProfessionalAgenda",
    id: string,
    professionalId: string,
    clientId?: string | null,
    date: string,
    time: string,
    endTime?: string | null,
    status: ProfessionalAgendaStatus,
    meetingLink?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type DeleteProfessionalAgendaMutationVariables = {
  input: DeleteProfessionalAgendaInput,
  condition?: ModelProfessionalAgendaConditionInput | null,
};

export type DeleteProfessionalAgendaMutation = {
  deleteProfessionalAgenda?:  {
    __typename: "ProfessionalAgenda",
    id: string,
    professionalId: string,
    clientId?: string | null,
    date: string,
    time: string,
    endTime?: string | null,
    status: ProfessionalAgendaStatus,
    meetingLink?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type GetUserProfileQueryVariables = {
  id: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner: string,
    role: UserRole,
    email?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserProfilesQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProfilesQuery = {
  listUserProfiles?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      id: string,
      owner: string,
      role: UserRole,
      email?: string | null,
      firstName?: string | null,
      lastName?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetProfessionalProfileQueryVariables = {
  id: string,
};

export type GetProfessionalProfileQuery = {
  getProfessionalProfile?:  {
    __typename: "ProfessionalProfile",
    id: string,
    owner: string,
    proType: ProType,
    displayName: string,
    bio?: string | null,
    ratingAvg?: number | null,
    ratingCount?: number | null,
    isActive?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListProfessionalProfilesQueryVariables = {
  filter?: ModelProfessionalProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProfessionalProfilesQuery = {
  listProfessionalProfiles?:  {
    __typename: "ModelProfessionalProfileConnection",
    items:  Array< {
      __typename: "ProfessionalProfile",
      id: string,
      owner: string,
      proType: ProType,
      displayName: string,
      bio?: string | null,
      ratingAvg?: number | null,
      ratingCount?: number | null,
      isActive?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetSurveyResponseQueryVariables = {
  id: string,
};

export type GetSurveyResponseQuery = {
  getSurveyResponse?:  {
    __typename: "SurveyResponse",
    id: string,
    owner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    answersJson: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListSurveyResponsesQueryVariables = {
  filter?: ModelSurveyResponseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSurveyResponsesQuery = {
  listSurveyResponses?:  {
    __typename: "ModelSurveyResponseConnection",
    items:  Array< {
      __typename: "SurveyResponse",
      id: string,
      owner: string,
      proOwner?: string | null,
      professionalId?: string | null,
      answersJson: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetAppointmentQueryVariables = {
  id: string,
};

export type GetAppointmentQuery = {
  getAppointment?:  {
    __typename: "Appointment",
    id: string,
    clientOwner: string,
    clientName?: string | null,
    clientEmail?: string | null,
    proOwner: string,
    professionalId: string,
    requestedStart: string,
    requestedEnd: string,
    status: AppointmentStatus,
    proposedStart?: string | null,
    proposedEnd?: string | null,
    notes?: string | null,
    meetingId?: string | null,
    meetingRegion?: string | null,
    meetingData?: string | null,
    clientAttendeeId?: string | null,
    proAttendeeId?: string | null,
    clientJoinToken?: string | null,
    proJoinToken?: string | null,
    caseId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListAppointmentsQueryVariables = {
  filter?: ModelAppointmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAppointmentsQuery = {
  listAppointments?:  {
    __typename: "ModelAppointmentConnection",
    items:  Array< {
      __typename: "Appointment",
      id: string,
      clientOwner: string,
      clientName?: string | null,
      clientEmail?: string | null,
      proOwner: string,
      professionalId: string,
      requestedStart: string,
      requestedEnd: string,
      status: AppointmentStatus,
      proposedStart?: string | null,
      proposedEnd?: string | null,
      notes?: string | null,
      meetingId?: string | null,
      meetingRegion?: string | null,
      meetingData?: string | null,
      clientAttendeeId?: string | null,
      proAttendeeId?: string | null,
      clientJoinToken?: string | null,
      proJoinToken?: string | null,
      caseId?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetCaseQueryVariables = {
  id: string,
};

export type GetCaseQuery = {
  getCase?:  {
    __typename: "Case",
    id: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    appointmentId: string,
    status: CaseStatus,
    servicePriceCents?: number | null,
    currency?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListCasesQueryVariables = {
  filter?: ModelCaseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCasesQuery = {
  listCases?:  {
    __typename: "ModelCaseConnection",
    items:  Array< {
      __typename: "Case",
      id: string,
      caseNumber: string,
      clientOwner: string,
      proOwner: string,
      professionalId: string,
      appointmentId: string,
      status: CaseStatus,
      servicePriceCents?: number | null,
      currency?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetCaseDocumentQueryVariables = {
  id: string,
};

export type GetCaseDocumentQuery = {
  getCaseDocument?:  {
    __typename: "CaseDocument",
    id: string,
    caseId: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    title: string,
    required?: boolean | null,
    status: DocStatus,
    fileName?: string | null,
    fileType?: string | null,
    s3Key?: string | null,
    uploadedAt?: string | null,
    reviewNotes?: string | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type ListCaseDocumentsQueryVariables = {
  filter?: ModelCaseDocumentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCaseDocumentsQuery = {
  listCaseDocuments?:  {
    __typename: "ModelCaseDocumentConnection",
    items:  Array< {
      __typename: "CaseDocument",
      id: string,
      caseId: string,
      caseNumber: string,
      clientOwner: string,
      proOwner: string,
      professionalId: string,
      title: string,
      required?: boolean | null,
      status: DocStatus,
      fileName?: string | null,
      fileType?: string | null,
      s3Key?: string | null,
      uploadedAt?: string | null,
      reviewNotes?: string | null,
      createdAt?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPaymentQueryVariables = {
  id: string,
};

export type GetPaymentQuery = {
  getPayment?:  {
    __typename: "Payment",
    id: string,
    clientOwner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    appointmentId?: string | null,
    caseId?: string | null,
    type: PaymentType,
    amountCents: number,
    currency: string,
    status: PaymentStatus,
    squareCheckoutId?: string | null,
    squarePaymentId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPaymentsQueryVariables = {
  filter?: ModelPaymentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPaymentsQuery = {
  listPayments?:  {
    __typename: "ModelPaymentConnection",
    items:  Array< {
      __typename: "Payment",
      id: string,
      clientOwner: string,
      proOwner?: string | null,
      professionalId?: string | null,
      appointmentId?: string | null,
      caseId?: string | null,
      type: PaymentType,
      amountCents: number,
      currency: string,
      status: PaymentStatus,
      squareCheckoutId?: string | null,
      squarePaymentId?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMessageQueryVariables = {
  id: string,
};

export type GetMessageQuery = {
  getMessage?:  {
    __typename: "Message",
    id: string,
    caseId: string,
    clientOwner: string,
    proOwner: string,
    senderRole: string,
    body: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type ListMessagesQueryVariables = {
  filter?: ModelMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMessagesQuery = {
  listMessages?:  {
    __typename: "ModelMessageConnection",
    items:  Array< {
      __typename: "Message",
      id: string,
      caseId: string,
      clientOwner: string,
      proOwner: string,
      senderRole: string,
      body: string,
      createdAt?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetProfessionalAgendaQueryVariables = {
  id: string,
};

export type GetProfessionalAgendaQuery = {
  getProfessionalAgenda?:  {
    __typename: "ProfessionalAgenda",
    id: string,
    professionalId: string,
    clientId?: string | null,
    date: string,
    time: string,
    endTime?: string | null,
    status: ProfessionalAgendaStatus,
    meetingLink?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type ListProfessionalAgendaQueryVariables = {
  filter?: ModelProfessionalAgendaFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProfessionalAgendaQuery = {
  listProfessionalAgenda?:  {
    __typename: "ModelProfessionalAgendaConnection",
    items:  Array< {
      __typename: "ProfessionalAgenda",
      id: string,
      professionalId: string,
      clientId?: string | null,
      date: string,
      time: string,
      endTime?: string | null,
      status: ProfessionalAgendaStatus,
      meetingLink?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CaseDocumentsByCaseQueryVariables = {
  caseId: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCaseDocumentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type CaseDocumentsByCaseQuery = {
  caseDocumentsByCase?:  {
    __typename: "ModelCaseDocumentConnection",
    items:  Array< {
      __typename: "CaseDocument",
      id: string,
      caseId: string,
      caseNumber: string,
      clientOwner: string,
      proOwner: string,
      professionalId: string,
      title: string,
      required?: boolean | null,
      status: DocStatus,
      fileName?: string | null,
      fileType?: string | null,
      s3Key?: string | null,
      uploadedAt?: string | null,
      reviewNotes?: string | null,
      createdAt?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MessagesByCaseQueryVariables = {
  caseId: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MessagesByCaseQuery = {
  messagesByCase?:  {
    __typename: "ModelMessageConnection",
    items:  Array< {
      __typename: "Message",
      id: string,
      caseId: string,
      clientOwner: string,
      proOwner: string,
      senderRole: string,
      body: string,
      createdAt?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ProfessionalAgendasByProfessionalIdQueryVariables = {
  professionalId: string,
  dateTime?: ModelProfessionalAgendaByProfessionalIdCompositeKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelProfessionalAgendaFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ProfessionalAgendasByProfessionalIdQuery = {
  professionalAgendasByProfessionalId?:  {
    __typename: "ModelProfessionalAgendaConnection",
    items:  Array< {
      __typename: "ProfessionalAgenda",
      id: string,
      professionalId: string,
      clientId?: string | null,
      date: string,
      time: string,
      endTime?: string | null,
      status: ProfessionalAgendaStatus,
      meetingLink?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserProfileSubscription = {
  onCreateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner: string,
    role: UserRole,
    email?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserProfileSubscription = {
  onUpdateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner: string,
    role: UserRole,
    email?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserProfileSubscriptionVariables = {
  filter?: ModelSubscriptionUserProfileFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserProfileSubscription = {
  onDeleteUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    owner: string,
    role: UserRole,
    email?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateProfessionalProfileSubscriptionVariables = {
  filter?: ModelSubscriptionProfessionalProfileFilterInput | null,
  owner?: string | null,
};

export type OnCreateProfessionalProfileSubscription = {
  onCreateProfessionalProfile?:  {
    __typename: "ProfessionalProfile",
    id: string,
    owner: string,
    proType: ProType,
    displayName: string,
    bio?: string | null,
    ratingAvg?: number | null,
    ratingCount?: number | null,
    isActive?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateProfessionalProfileSubscriptionVariables = {
  filter?: ModelSubscriptionProfessionalProfileFilterInput | null,
  owner?: string | null,
};

export type OnUpdateProfessionalProfileSubscription = {
  onUpdateProfessionalProfile?:  {
    __typename: "ProfessionalProfile",
    id: string,
    owner: string,
    proType: ProType,
    displayName: string,
    bio?: string | null,
    ratingAvg?: number | null,
    ratingCount?: number | null,
    isActive?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteProfessionalProfileSubscriptionVariables = {
  filter?: ModelSubscriptionProfessionalProfileFilterInput | null,
  owner?: string | null,
};

export type OnDeleteProfessionalProfileSubscription = {
  onDeleteProfessionalProfile?:  {
    __typename: "ProfessionalProfile",
    id: string,
    owner: string,
    proType: ProType,
    displayName: string,
    bio?: string | null,
    ratingAvg?: number | null,
    ratingCount?: number | null,
    isActive?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateSurveyResponseSubscriptionVariables = {
  filter?: ModelSubscriptionSurveyResponseFilterInput | null,
  owner?: string | null,
  proOwner?: string | null,
};

export type OnCreateSurveyResponseSubscription = {
  onCreateSurveyResponse?:  {
    __typename: "SurveyResponse",
    id: string,
    owner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    answersJson: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateSurveyResponseSubscriptionVariables = {
  filter?: ModelSubscriptionSurveyResponseFilterInput | null,
  owner?: string | null,
  proOwner?: string | null,
};

export type OnUpdateSurveyResponseSubscription = {
  onUpdateSurveyResponse?:  {
    __typename: "SurveyResponse",
    id: string,
    owner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    answersJson: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteSurveyResponseSubscriptionVariables = {
  filter?: ModelSubscriptionSurveyResponseFilterInput | null,
  owner?: string | null,
  proOwner?: string | null,
};

export type OnDeleteSurveyResponseSubscription = {
  onDeleteSurveyResponse?:  {
    __typename: "SurveyResponse",
    id: string,
    owner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    answersJson: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateAppointmentSubscriptionVariables = {
  filter?: ModelSubscriptionAppointmentFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnCreateAppointmentSubscription = {
  onCreateAppointment?:  {
    __typename: "Appointment",
    id: string,
    clientOwner: string,
    clientName?: string | null,
    clientEmail?: string | null,
    proOwner: string,
    professionalId: string,
    requestedStart: string,
    requestedEnd: string,
    status: AppointmentStatus,
    proposedStart?: string | null,
    proposedEnd?: string | null,
    notes?: string | null,
    meetingId?: string | null,
    meetingRegion?: string | null,
    meetingData?: string | null,
    clientAttendeeId?: string | null,
    proAttendeeId?: string | null,
    clientJoinToken?: string | null,
    proJoinToken?: string | null,
    caseId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAppointmentSubscriptionVariables = {
  filter?: ModelSubscriptionAppointmentFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnUpdateAppointmentSubscription = {
  onUpdateAppointment?:  {
    __typename: "Appointment",
    id: string,
    clientOwner: string,
    clientName?: string | null,
    clientEmail?: string | null,
    proOwner: string,
    professionalId: string,
    requestedStart: string,
    requestedEnd: string,
    status: AppointmentStatus,
    proposedStart?: string | null,
    proposedEnd?: string | null,
    notes?: string | null,
    meetingId?: string | null,
    meetingRegion?: string | null,
    meetingData?: string | null,
    clientAttendeeId?: string | null,
    proAttendeeId?: string | null,
    clientJoinToken?: string | null,
    proJoinToken?: string | null,
    caseId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAppointmentSubscriptionVariables = {
  filter?: ModelSubscriptionAppointmentFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnDeleteAppointmentSubscription = {
  onDeleteAppointment?:  {
    __typename: "Appointment",
    id: string,
    clientOwner: string,
    clientName?: string | null,
    clientEmail?: string | null,
    proOwner: string,
    professionalId: string,
    requestedStart: string,
    requestedEnd: string,
    status: AppointmentStatus,
    proposedStart?: string | null,
    proposedEnd?: string | null,
    notes?: string | null,
    meetingId?: string | null,
    meetingRegion?: string | null,
    meetingData?: string | null,
    clientAttendeeId?: string | null,
    proAttendeeId?: string | null,
    clientJoinToken?: string | null,
    proJoinToken?: string | null,
    caseId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCaseSubscriptionVariables = {
  filter?: ModelSubscriptionCaseFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnCreateCaseSubscription = {
  onCreateCase?:  {
    __typename: "Case",
    id: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    appointmentId: string,
    status: CaseStatus,
    servicePriceCents?: number | null,
    currency?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCaseSubscriptionVariables = {
  filter?: ModelSubscriptionCaseFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnUpdateCaseSubscription = {
  onUpdateCase?:  {
    __typename: "Case",
    id: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    appointmentId: string,
    status: CaseStatus,
    servicePriceCents?: number | null,
    currency?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCaseSubscriptionVariables = {
  filter?: ModelSubscriptionCaseFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnDeleteCaseSubscription = {
  onDeleteCase?:  {
    __typename: "Case",
    id: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    appointmentId: string,
    status: CaseStatus,
    servicePriceCents?: number | null,
    currency?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCaseDocumentSubscriptionVariables = {
  filter?: ModelSubscriptionCaseDocumentFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnCreateCaseDocumentSubscription = {
  onCreateCaseDocument?:  {
    __typename: "CaseDocument",
    id: string,
    caseId: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    title: string,
    required?: boolean | null,
    status: DocStatus,
    fileName?: string | null,
    fileType?: string | null,
    s3Key?: string | null,
    uploadedAt?: string | null,
    reviewNotes?: string | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateCaseDocumentSubscriptionVariables = {
  filter?: ModelSubscriptionCaseDocumentFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnUpdateCaseDocumentSubscription = {
  onUpdateCaseDocument?:  {
    __typename: "CaseDocument",
    id: string,
    caseId: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    title: string,
    required?: boolean | null,
    status: DocStatus,
    fileName?: string | null,
    fileType?: string | null,
    s3Key?: string | null,
    uploadedAt?: string | null,
    reviewNotes?: string | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteCaseDocumentSubscriptionVariables = {
  filter?: ModelSubscriptionCaseDocumentFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnDeleteCaseDocumentSubscription = {
  onDeleteCaseDocument?:  {
    __typename: "CaseDocument",
    id: string,
    caseId: string,
    caseNumber: string,
    clientOwner: string,
    proOwner: string,
    professionalId: string,
    title: string,
    required?: boolean | null,
    status: DocStatus,
    fileName?: string | null,
    fileType?: string | null,
    s3Key?: string | null,
    uploadedAt?: string | null,
    reviewNotes?: string | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePaymentSubscriptionVariables = {
  filter?: ModelSubscriptionPaymentFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnCreatePaymentSubscription = {
  onCreatePayment?:  {
    __typename: "Payment",
    id: string,
    clientOwner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    appointmentId?: string | null,
    caseId?: string | null,
    type: PaymentType,
    amountCents: number,
    currency: string,
    status: PaymentStatus,
    squareCheckoutId?: string | null,
    squarePaymentId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePaymentSubscriptionVariables = {
  filter?: ModelSubscriptionPaymentFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnUpdatePaymentSubscription = {
  onUpdatePayment?:  {
    __typename: "Payment",
    id: string,
    clientOwner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    appointmentId?: string | null,
    caseId?: string | null,
    type: PaymentType,
    amountCents: number,
    currency: string,
    status: PaymentStatus,
    squareCheckoutId?: string | null,
    squarePaymentId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePaymentSubscriptionVariables = {
  filter?: ModelSubscriptionPaymentFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnDeletePaymentSubscription = {
  onDeletePayment?:  {
    __typename: "Payment",
    id: string,
    clientOwner: string,
    proOwner?: string | null,
    professionalId?: string | null,
    appointmentId?: string | null,
    caseId?: string | null,
    type: PaymentType,
    amountCents: number,
    currency: string,
    status: PaymentStatus,
    squareCheckoutId?: string | null,
    squarePaymentId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnCreateMessageSubscription = {
  onCreateMessage?:  {
    __typename: "Message",
    id: string,
    caseId: string,
    clientOwner: string,
    proOwner: string,
    senderRole: string,
    body: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnUpdateMessageSubscription = {
  onUpdateMessage?:  {
    __typename: "Message",
    id: string,
    caseId: string,
    clientOwner: string,
    proOwner: string,
    senderRole: string,
    body: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null,
  clientOwner?: string | null,
  proOwner?: string | null,
};

export type OnDeleteMessageSubscription = {
  onDeleteMessage?:  {
    __typename: "Message",
    id: string,
    caseId: string,
    clientOwner: string,
    proOwner: string,
    senderRole: string,
    body: string,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateProfessionalAgendaSubscriptionVariables = {
  filter?: ModelSubscriptionProfessionalAgendaFilterInput | null,
  professionalId?: string | null,
};

export type OnCreateProfessionalAgendaSubscription = {
  onCreateProfessionalAgenda?:  {
    __typename: "ProfessionalAgenda",
    id: string,
    professionalId: string,
    clientId?: string | null,
    date: string,
    time: string,
    endTime?: string | null,
    status: ProfessionalAgendaStatus,
    meetingLink?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnUpdateProfessionalAgendaSubscriptionVariables = {
  filter?: ModelSubscriptionProfessionalAgendaFilterInput | null,
  professionalId?: string | null,
};

export type OnUpdateProfessionalAgendaSubscription = {
  onUpdateProfessionalAgenda?:  {
    __typename: "ProfessionalAgenda",
    id: string,
    professionalId: string,
    clientId?: string | null,
    date: string,
    time: string,
    endTime?: string | null,
    status: ProfessionalAgendaStatus,
    meetingLink?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};

export type OnDeleteProfessionalAgendaSubscriptionVariables = {
  filter?: ModelSubscriptionProfessionalAgendaFilterInput | null,
  professionalId?: string | null,
};

export type OnDeleteProfessionalAgendaSubscription = {
  onDeleteProfessionalAgenda?:  {
    __typename: "ProfessionalAgenda",
    id: string,
    professionalId: string,
    clientId?: string | null,
    date: string,
    time: string,
    endTime?: string | null,
    status: ProfessionalAgendaStatus,
    meetingLink?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
  } | null,
};
