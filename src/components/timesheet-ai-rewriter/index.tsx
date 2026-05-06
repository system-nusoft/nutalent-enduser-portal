import { useState } from 'react';
import { AiService } from 'src/services/ai';
import { Button, Input } from 'src/components';
import styles from './styles.module.scss';

interface TimesheetAIRewriterProps {
  initialSummary?: string;
  onApply?: (rewrittenSummary: string) => void;
}

const aiService = new AiService();

export const TimesheetAIRewriter = ({ initialSummary = '', onApply }: TimesheetAIRewriterProps) => {
  const [originalSummary, setOriginalSummary] = useState(initialSummary);
  const [additionalContext, setAdditionalContext] = useState('');
  const [projectName, setProjectName] = useState('');
  const [taskType, setTaskType] = useState('');
  const [tone, setTone] = useState<'professional' | 'technical' | 'concise'>('professional');
  const [rewrittenSummary, setRewrittenSummary] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [clarity, setClarity] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

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
      
      setRewrittenSummary(data.rewrittenSummary || '');
      setImprovements(data.improvements || []);
      setClarity(data.clarity || 0);
      setSuggestions(data.suggestions || []);
      setShowResults(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to rewrite summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (onApply && rewrittenSummary) {
      onApply(rewrittenSummary);
    }
  };

  const handleReset = () => {
    setOriginalSummary(initialSummary);
    setAdditionalContext('');
    setProjectName('');
    setTaskType('');
    setTone('professional');
    setRewrittenSummary('');
    setImprovements([]);
    setClarity(0);
    setSuggestions([]);
    setShowResults(false);
    setError('');
  };

  return (
    <div className="white-container w-full col-span-2">
      <div className={styles.container}>
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
                onChange={(e) => setTone(e.target.value as 'professional' | 'technical' | 'concise')}
              >
                <option value="professional">Professional</option>
                <option value="technical">Technical</option>
                <option value="concise">Concise</option>
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
                {onApply && (
                  <Button
                    onClick={handleApply}
                    label="Apply This Summary"
                    btn_class="filled_btn"
                  />
                )}
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
    </div>
  );
};
