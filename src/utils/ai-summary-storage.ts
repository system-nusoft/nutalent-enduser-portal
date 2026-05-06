interface StoredAISummary {
  timesheetId: string;
  originalSummary: string;
  aiGeneratedSummary: string;
  improvements: string[];
  clarity: number;
  suggestions: string[];
  generatedAt: string;
}

const STORAGE_KEY = 'nutalent_ai_summaries';
const EXPIRY_DAYS = 7; // Summaries expire after 7 days

export class AISummaryStorage {
  private static isExpired(generatedAt: string): boolean {
    const generated = new Date(generatedAt);
    const now = new Date();
    const diffDays = (now.getTime() - generated.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > EXPIRY_DAYS;
  }

  static saveSummary(summary: StoredAISummary): void {
    try {
      const stored = this.getAllSummaries();
      stored[summary.timesheetId] = summary;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
      console.error('Failed to save AI summary to localStorage:', error);
    }
  }

  static getSummary(timesheetId: string): StoredAISummary | null {
    try {
      const stored = this.getAllSummaries();
      const summary = stored[timesheetId];
      
      if (!summary) {
        return null;
      }

      if (this.isExpired(summary.generatedAt)) {
        this.removeSummary(timesheetId);
        return null;
      }

      return summary;
    } catch (error) {
      console.error('Failed to get AI summary from localStorage:', error);
      return null;
    }
  }

  static removeSummary(timesheetId: string): void {
    try {
      const stored = this.getAllSummaries();
      delete stored[timesheetId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
      console.error('Failed to remove AI summary from localStorage:', error);
    }
  }

  static getAllSummaries(): Record<string, StoredAISummary> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to get all AI summaries from localStorage:', error);
      return {};
    }
  }

  static clearExpiredSummaries(): void {
    try {
      const stored = this.getAllSummaries();
      const filtered: Record<string, StoredAISummary> = {};

      Object.entries(stored).forEach(([id, summary]) => {
        if (!this.isExpired(summary.generatedAt)) {
          filtered[id] = summary;
        }
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to clear expired AI summaries:', error);
    }
  }

  static clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear all AI summaries:', error);
    }
  }
}
