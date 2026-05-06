import { HttpService } from "../http";
import { prepareErrorResponse, prepareResponseObject } from "../http/response";
import { RESPONSE_TYPES } from "../../constants/response-types";

export interface IdentifyRolesRequest {
  projectDescription: string;
  requirements: string[];
  budget?: string;
  timeline?: string;
}

enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface Role {
  title: string;
  seniorityLevel: string;
  skills: string[];
  estimatedHoursPerWeek: number;
  priority: Priority;
  reasoning: string;
}

export interface IdentifyRolesResponse {
  roles: Role[];
  totalEstimatedTeamSize: number;
  recommendedPhasing?: string;
  keyConsiderations: string[];
}

// Quick endpoint interfaces with resource matching
export interface MatchingResource {
  id: string;
  fullName: string;
  title: string;
  skills: string[];
  yearsOfExperience: number;
  availableStatus: string;
  matchScore: number;
  profilePicture?: string;
}

export interface RoleWithResources {
  role: Role;
  matchingResources: MatchingResource[];
}

export interface IdentifyRolesQuickResponse {
  roles: RoleWithResources[];
  totalEstimatedTeamSize: number;
  totalMatchingResources: number;
}


export class AiService extends HttpService {
  async identifyRoles(
    baseUrl: string,
    data: IdentifyRolesRequest
  ): Promise<IdentifyRolesResponse> {
    if (!baseUrl?.trim()) {
      throw new Error('Base URL is required');
    }
    
    if (!data?.projectDescription?.trim()) {
      throw new Error('Project description is required');
    }

    try {
      // AI endpoints can take 30+ seconds, set timeout to 60 seconds
      const apiResponse = await this.post(`${baseUrl}ai/identify-roles`, data, undefined, 60000);
      const response = prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
      
      // prepareResponseObject wraps data in response.data
      const responseData = response?.data || response;
      
      // Validate response structure
      if (!responseData?.roles || !Array.isArray(responseData.roles)) {
        throw new Error('Invalid response: roles array is required');
      }
      
      return responseData;
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  }

  async identifyRolesQuick(
    baseUrl: string,
    data: IdentifyRolesRequest
  ): Promise<IdentifyRolesQuickResponse> {
    if (!baseUrl?.trim()) {
      throw new Error('Base URL is required');
    }
    
    if (!data?.projectDescription?.trim()) {
      throw new Error('Project description is required');
    }

    try {
      // Quick endpoint should be faster, but still allow 30 seconds timeout
      const apiResponse = await this.post(`${baseUrl}ai/identify-roles/quick`, data, undefined, 30000);
      const response = prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
      
      // prepareResponseObject wraps data in response.data
      const responseData = response?.data || response;
      
      // Validate response structure
      if (!responseData?.roles || !Array.isArray(responseData.roles)) {
        throw new Error('Invalid response: roles array is required');
      }
      
      return responseData;
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  }

}
