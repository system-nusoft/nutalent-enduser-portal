import { useRef, useState } from 'react';
import { AiService } from 'src/services/ai';
import { Button, Input } from 'src/components';
import { DialogBox } from 'src/components/modal/Modal';
import { modalProps } from 'src/utils/enum';
import { AISummaryStorage } from 'src/utils/ai-summary-storage';
import styles from './styles.module.scss';

enum Tone {
  PROFESSIONAL = 'professional',
  TECHNICAL = 'technical',
  CONCISE = 'concise'
}

interface TimesheetAIRewriterModalProps {
  initialSummary?: string;
  timesheetId?: string;
  onSummaryGenerated?: (summary: string) => void;
}

const aiService = new AiService();

export const TimesheetAIRewriterModal = ({ 
  initialSummary = '',
  timesheetId,
  onSummaryGenerated 
}: TimesheetAIRewriterModalProps) => {
  const modalRef = useRef<modalProps>(null);
  const [originalSummary, setOriginalSummary] = useState(initialSummary);
  const [additionalContext, setAdditionalContext] = useState('');
  const [projectName, setProjectName] = useState('');
  const [taskType, setTaskType] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [rewrittenSummary, setRewrittenSummary] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [clarity, setClarity] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

  const openModal = () => {
    setOriginalSummary(initialSummary);
    modalRef?.current?.openModal();
  };

  const handleRewrite = async () => {
    if (!originalSummary.trim()) {
      setError('Please enter a summary to rewrite');
      return;
    }

    setIsLoading(true);
    setError('');
    setShowResults(false);

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL || '';
      const response: any = await aiService.rewriteTimesheet(baseUrl, {
        originalSummary,
        additionalContext: additionalContext || undefined,
        tone,
        projectName: projectName || undefined,
        taskType: taskType || undefined,
      });

      const data = response?.data || response;
      
      // Handle both direct response and nested content structure
      let parsedData = data;
      
      // Check if response has the expected direct format (rewrittenSummary, improvements, etc.)
      if (data.rewrittenSummary || data.improvements || data.clarity !== undefined) {
        // Direct response format - use as-is
        parsedData = data;
      } 
      // Else check if response has content array (nested format)
      else if (data.content && Array.isArray(data.content) && data.content.length > 0) {
        const textContent = data.content[0];
        if (textContent.text) {
          try {
            // Parse the JSON string inside the text content
            parsedData = JSON.parse(textContent.text);
          } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            setError('Failed to parse AI response. Please try again.');
            setIsLoading(false);
            return;
          }
        }
      }
      
      // Check if response contains an error field (API returns 200 but with error)
      if (parsedData.error) {
        const errorMessage = String(parsedData.error || '');
        
        // Check if it's an API quota/rate limit error
        if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('429')) {
          setError('AI service quota exceeded. Please try again later.');
        } else {
          setError('AI service is currently down. Please try again later.');
        }
        
        // Auto-close modal after showing error for 3 seconds
        setTimeout(() => {
          modalRef?.current?.closeModal();
          handleReset();
        }, 3000);
        
        setIsLoading(false);
        return;
      }
      
      setRewrittenSummary(parsedData.rewrittenSummary || '');
      setImprovements(parsedData.improvements || []);
      setClarity(parsedData.clarity || 0);
      setSuggestions(parsedData.suggestions || []);
      setShowResults(true);

      // Save to localStorage if timesheetId is provided
      if (timesheetId && parsedData.rewrittenSummary) {
        AISummaryStorage.saveSummary({
          timesheetId,
          originalSummary,
          aiGeneratedSummary: parsedData.rewrittenSummary,
          improvements: parsedData.improvements || [],
          clarity: parsedData.clarity || 0,
          suggestions: parsedData.suggestions || [],
          generatedAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      const errorMessage = String(err?.message || err?.error || 'Failed to rewrite summary. Please try again.');
      
      // Check if it's an API quota/rate limit error
      if (errorMessage.includes('quota') || errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        setError('AI service quota exceeded. Please try again later.');
      } else {
        setError('AI service is currently down. Please try again later.');
      }
      
      // Auto-close modal after showing error for 3 seconds
      setTimeout(() => {
        modalRef?.current?.closeModal();
        handleReset();
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (onSummaryGenerated && rewrittenSummary) {
      onSummaryGenerated(rewrittenSummary);
      modalRef?.current?.closeModal();
      handleReset();
    }
  };

  const handleReset = () => {
    setOriginalSummary(initialSummary);
    setAdditionalContext('');
    setProjectName('');
    setTaskType('');
    setTone(Tone.PROFESSIONAL);
    setRewrittenSummary('');
    setImprovements([]);
    setClarity(0);
    setSuggestions([]);
    setShowResults(false);
    setError('');
  };

  const handleClose = () => {
    handleReset();
  };

  return (
    <>
      <button 
        onClick={openModal}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-[2px] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="relative flex items-center gap-4 rounded-[10px] bg-white px-6 py-4 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-indigo-50 group-hover:to-purple-50">
          {/* Icon with animation */}
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            <span className="text-2xl animate-pulse">✨</span>
          </div>
          
          {/* Content */}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Timesheet Summary AI Rewriter
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                AI
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Enhance your task summaries with professional formatting and clarity
            </p>
          </div>
          
          {/* Arrow indicator */}
          <div className="flex-shrink-0 text-gray-400 transition-all duration-300 group-hover:text-purple-600 group-hover:translate-x-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </button>

      <DialogBox
        ref={modalRef}
        onClose={handleClose}
      >
        <div className={styles.modalContent}>
          <div className={styles.header}>
            <div className={styles.icon}>✨</div>
            <div>
              <h3 className={styles.title}>Timesheet Summary AI Rewriter</h3>
              <p className={styles.subtitle}>
                Enhance your task summaries with professional formatting and clarity
              </p>
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.inputSection}>
              <label className={styles.label}>Original Summary</label>
              <Input
                name="originalSummary"
                value={originalSummary}
                onChange={(e) => setOriginalSummary(e.target.value)}
                inputType="textArea"
                placeholder="Enter your task summary (e.g., 'worked on the login page and fixed some bugs')"
                size="small"
              />
            </div>

            <div className={styles.optionsGrid}>
              <div className={styles.inputSection}>
                <label className={styles.label}>Additional Context (Optional)</label>
                <Input
                  name="additionalContext"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="e.g., 'Added OAuth2 authentication'"
                  size="small"
                />
              </div>

              <div className={styles.inputSection}>
                <label className={styles.label}>Project Name (Optional)</label>
                <Input
                  name="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., 'E-commerce Platform'"
                  size="small"
                />
              </div>

              <div className={styles.inputSection}>
                <label className={styles.label}>Task Type (Optional)</label>
                <Input
                  name="taskType"
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  placeholder="e.g., 'development', 'bug fix', 'testing'"
                  size="small"
                />
              </div>

              <div className={styles.inputSection}>
                <label className={styles.label}>Tone</label>
                <select
                  className={styles.select}
                  value={tone}
                  onChange={(e) => setTone(e.target.value as Tone)}
                >
                  <option value={Tone.PROFESSIONAL}>Professional</option>
                  <option value={Tone.TECHNICAL}>Technical</option>
                  <option value={Tone.CONCISE}>Concise</option>
                </select>
              </div>
            </div>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <div className={styles.actions}>
              <Button
                onClick={handleRewrite}
                label={isLoading ? 'Rewriting...' : 'Rewrite Summary'}
                disabled={isLoading || !originalSummary.trim()}
                btn_class="filled_btn"
              />
              <Button
                onClick={handleReset}
                label="Reset"
                disabled={isLoading}
                btn_class="white_btn"
              />
            </div>

            {showResults && rewrittenSummary && (
              <div className={styles.results}>
                <div className={styles.resultSection}>
                  <label className={styles.label}>Rewritten Summary</label>
                  <div className={styles.rewrittenText}>
                    {rewrittenSummary}
                  </div>
                  <Button
                    onClick={handleApply}
                    label="Apply This Summary"
                    btn_class="filled_btn"
                  />
                </div>

                {clarity > 0 && (
                  <div className={styles.clarityScore}>
                    <span className={styles.label}>Clarity Score:</span>
                    <span className={styles.score}>{clarity}/10</span>
                    <div className={styles.scoreBar}>
                      <div 
                        className={styles.scoreBarFill} 
                        style={{ width: `${clarity * 10}%` }}
                      />
                    </div>
                  </div>
                )}

                {improvements.length > 0 && (
                  <div className={styles.resultSection}>
                    <label className={styles.label}>Improvements Made</label>
                    <ul className={styles.list}>
                      {improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div className={styles.resultSection}>
                    <label className={styles.label}>Suggestions</label>
                    <ul className={styles.list}>
                      {suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogBox>
    </>
  );
};
