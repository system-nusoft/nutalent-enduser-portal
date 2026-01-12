export interface WorkExperience {
  id: string;
  organization: string;
  jobTitle: string;
  startDate: Date;
  endDate: Date | null;
  summary: string;
  yearsOfExperience: number;
  resourceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationHistory {
  id: string;
  certification: string;
  institute: string;
  completionDate: Date;
  resourceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  name: string;
  profileSummary: string;
  title: string;
  age: number | null;
  gender: string | null;
  email: string | null;
  phoneNo: string | null;
  profilePicture: string | null;
  hourlyRate: number | null;
  timeSlot: string | null;
  availableFrom: Date | null;
  additionalComments: string | null;
  resume: string | null;
  workMode: string | null;
  employmentType: string | null;
  availabilityStatus: string | null;
  partnerId: string;
  isProfileCompleted: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  ResourceSkills: string[];
  WorkExperience: WorkExperience[];
  EducationHistory: EducationHistory[];
}