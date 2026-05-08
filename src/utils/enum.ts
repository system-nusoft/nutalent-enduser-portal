export interface modalProps {
  openModal: () => void;
  closeModal: () => void;
}

export enum RESOURCE_STATUS {
  AVAILABLE = "Available",
  VACATION = "Vacation",
  BUSY = "Busy",
}

export enum PROJECTSTATUS {
  NOTSTARTED = "Not started",
  ONGOING = "Ongoing",
  COMPLETED = "Completed",
}

export enum TIMESHEET_STATUS {
  PENDING = "Pending Approval",
  REVISION = "Revision Requested",
  APPROVED = "Approved",
}

export enum paymentStatus {
  PENDING = "Pending payment",
  REVISION = "Revision requested",
  APPROVED = "Approved",
}

export enum INTERVIEW_STATUS {
  BOOKED = "Booked",
  DONE = "Done",
}

export enum PROJECT_STATUS {
  NOT_STARTED = "Not Started",
  ON_GOING = "Ongoing",
  COMPLETED = "Completed",
}

export enum INVOICES_STATUS {
  CONFIRMATION_PENDING = "Confirmation Pending",
  PENDING = "Pending",
  PAID = "Paid",
}

export enum ENGAGEMENTS_STATUS {
  ACTIVE = "Active",
  ENDED = "Closed",
}

export enum CLASSIFICATION_INTENT {
  PRICING = "pricing",
  ROLE_IDENTIFICATION = "role_identification",
  UNKNOWN = "unknown",
}
