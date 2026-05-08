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

export interface ResourceProfile {
  id: string;
  name: string;
  title: string;
  hourlyRate: number;
  totalYearsOfExperience: number;
  derivedLevel: string;
  profileSummary: string;
  skills: string;
  availability: string;
  profilePicture: string | null;
}

export interface LevelResult {
  level: string;
  marketRate: { min: number; avg: number; max: number };
  detectedRegion: string;
  ourRates: { min: number; avg: number; max: number };
  isCheaper: boolean;
  savings: number | null;
  savingsPercent: number;
  resourceCount: number;
  resources: ResourceProfile[];
}

export interface PricingResult {
  role: string;
  userLocation: string;
  detectedRegion: string;
  levelResults: LevelResult[];
  totalAvailable: number;
  responseMessage: string;
}

export interface OptimizePricingRequest {
  roles: string[];
  location?: string;
  budget?: number;
}

export interface OptimizePricingResponse {
  results: PricingResult[];
}

export interface IntentClassification {
  intent: 'pricing' | 'role_identification' | 'unknown';
  roles: string[];
  confidence: number;
}

export interface RewriteTimesheetRequest {
  originalSummary: string;
  additionalContext?: string;
  tone?: 'professional' | 'technical' | 'concise';
  projectName?: string;
  taskType?: string;
}

export interface RewriteTimesheetResponse {
  rewrittenSummary: string;
  improvements: string[];
  tone: string;
  clarity: number;
  suggestions: string[];
}

export interface TimesheetSuggestion {
  summary: string;
  tone: string;
  clarity: number;
  reasoning: string;
}

export interface TimesheetSuggestionsResponse {
  timesheetId: string;
  originalSummary: string;
  suggestedEnhancements: TimesheetSuggestion[];
  recommendations: string[];
}

export interface SaveAISummaryRequest {
  timesheetId: string;
  originalSummary: string;
  aiGeneratedSummary: string;
  improvements: string[];
  clarity: number;
  suggestions: string[];
  generatedAt: string;
}

export interface SaveAISummaryResponse {
  success: boolean;
  message: string;
  savedSummary: {
    timesheetId: string;
    aiGeneratedSummary: string;
    generatedAt: string;
  };
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
      // AI endpoints can take significant time, set timeout to 2 minutes for safety
      const apiResponse = await this.post(`${baseUrl}ai/identify-roles/quick`, data, undefined, 120000);
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

  async classifyIntent(
    baseUrl: string,
    query: string
  ): Promise<IntentClassification> {
    if (!baseUrl?.trim()) {
      throw new Error('Base URL is required');
    }

    if (!query?.trim()) {
      throw new Error('Query is required');
    }

    try {
      const apiResponse = await this.post(
        `${baseUrl}ai/classify-intent`,
        { query },
        undefined,
        30000
      );
      const response = prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
      const responseData = response?.data || response;

      if (!responseData?.intent) {
        throw new Error('Invalid response: intent is required');
      }

      return responseData;
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  }

  async optimizePricing(
    baseUrl: string,
    payload: OptimizePricingRequest
  ): Promise<OptimizePricingResponse> {
    if (!baseUrl?.trim()) {
      throw new Error('Base URL is required');
    }

    if (!payload?.roles || payload.roles.length === 0) {
      throw new Error('At least one role is required');
    }

    try {
      // Pricing involves multiple Gemini calls + DB lookups, give it 60s
      const apiResponse = await this.post(
        `${baseUrl}ai/optimize-pricing`,
        payload,
        undefined,
        60000
      );
      const response = prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
      const responseData = response?.data || response;

      if (!responseData?.results || !Array.isArray(responseData.results)) {
        throw new Error('Invalid response: results array is required');
      }

      return responseData;
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  }

  async rewriteTimesheet(
    baseUrl: string,
    data: RewriteTimesheetRequest
  ): Promise<RewriteTimesheetResponse> {
    if (!baseUrl?.trim()) {
      throw new Error('Base URL is required');
    }
    
    if (!data?.originalSummary?.trim()) {
      throw new Error('Original summary is required');
    }

    try {
      // AI endpoints can take 30+ seconds, set timeout to 60 seconds
      const apiResponse = await this.post(`${baseUrl}ai/rewrite-timesheet`, data, undefined, 60000);
      const response = prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
      
      // prepareResponseObject wraps data in response.data
      const responseData = response?.data || response;
      
      // Validate response structure
      if (!responseData?.rewrittenSummary?.trim()) {
        throw new Error('Invalid response: rewrittenSummary is required');
      }
      
      return responseData;
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  }

  async getTimesheetSuggestions(
    baseUrl: string,
    timesheetId: string
  ): Promise<TimesheetSuggestionsResponse> {
    if (!baseUrl?.trim()) {
      throw new Error('Base URL is required');
    }
    
    if (!timesheetId?.trim()) {
      throw new Error('Timesheet ID is required');
    }

    try {
      const apiResponse = await this.get(`${baseUrl}ai/timesheet-suggestions/${timesheetId}`);
      const response = prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
      
      const responseData = response?.data || response;
      
      if (!responseData?.suggestedEnhancements || !Array.isArray(responseData.suggestedEnhancements)) {
        throw new Error('Invalid response: suggestedEnhancements array is required');
      }
      
      return responseData;
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  }

  async saveAISummary(
    baseUrl: string,
    data: SaveAISummaryRequest
  ): Promise<SaveAISummaryResponse> {
    if (!baseUrl?.trim()) {
      throw new Error('Base URL is required');
    }
    
    if (!data?.timesheetId?.trim()) {
      throw new Error('Timesheet ID is required');
    }
    
    if (!data?.aiGeneratedSummary?.trim()) {
      throw new Error('AI generated summary is required');
    }

    try {
      const apiResponse = await this.post(`${baseUrl}ai/save-ai-summary`, data);
      const response = prepareResponseObject(apiResponse, RESPONSE_TYPES.SUCCESS);
      
      const responseData = response?.data || response;
      
      if (!responseData?.success) {
        throw new Error('Failed to save AI summary');
      }
      
      return responseData;
    } catch (error) {
      throw prepareErrorResponse(error);
    }
  }
}
