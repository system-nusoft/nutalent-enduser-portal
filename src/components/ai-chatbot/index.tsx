import React, { useState, useEffect, useRef } from 'react';
import { AiService, IdentifyRolesRequest, Role } from 'src/services/ai';
import styles from './styles.module.scss';

enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant'
}

interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiService = new AiService();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update loading message based on elapsed time
  useEffect(() => {
    if (!loading || !loadingStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - loadingStartTime;
      const seconds = Math.floor(elapsed / 1000);
      
      let message = '🤔 Analyzing your project requirements and generating optimal team recommendations...';
      
      if (seconds >= 10) {
        message = '🧠 Deep learning analysis in progress... This may take up to 30 seconds for complex projects.';
      }
      
      if (seconds >= 20) {
        message = '⚡ Processing complex requirements and optimizing team composition... Almost there!';
      }
      
      if (seconds >= 30) {
        message = '🎯 Finalizing recommendations and ensuring optimal team structure...';
      }

      setMessages(prev => prev.map(msg => 
        msg.isLoading ? { ...msg, content: message } : msg
      ));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [loading, loadingStartTime]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  const extractRequirements = (text: string): string[] => {
    const keywords = [
      'React', 'Angular', 'Vue', 'Next.js', 'Nuxt.js',
      'Node.js', 'Python', 'Java', 'C#', '.NET', 'PHP', 'Ruby', 'Go',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
      'mobile', 'web', 'API', 'REST', 'GraphQL',
      'blockchain', 'AI', 'ML', 'machine learning', 'data science',
      'React Native', 'Flutter', 'iOS', 'Android',
      'TypeScript', 'JavaScript', 'Solidity', 'Rust'
    ];
    
    return keywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const formatRolesResponse = (roles: Role[], totalTeamSize: number, phasing?: string, considerations?: string[]): string => {
    let response = `Based on your requirements, I recommend a team of ${totalTeamSize} ${totalTeamSize === 1 ? 'person' : 'people'}:\n\n`;
    
    roles.forEach((role, index) => {
      response += `${index + 1}. ${role.title} (${role.seniorityLevel})\n`;
      response += `   • Skills: ${role.skills.join(', ')}\n`;
      response += `   • Hours: ${role.estimatedHoursPerWeek}/week\n`;
      response += `   • Priority: ${role.priority}\n`;
      response += `   • Why: ${role.reasoning}\n\n`;
    });

    if (phasing) {
      response += `\n📅 Recommended Phasing:\n${phasing}\n`;
    }

    if (considerations && Array.isArray(considerations) && considerations.length > 0) {
      response += `\n💡 Key Considerations:\n`;
      considerations.forEach(consideration => {
        response += `• ${consideration}\n`;
      });
    }

    return response;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;

    const userMessage: Message = {
      role: MessageRole.USER,
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setLoadingStartTime(Date.now());

    const loadingMessage: Message = {
      role: MessageRole.ASSISTANT,
      content: '🤔 Analyzing your project requirements and generating optimal team recommendations...',
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL || '';
      const extractedReqs = extractRequirements(input);
      const allRequirements = Array.from(new Set([...requirements, ...extractedReqs]));

      const requestData: IdentifyRolesRequest = {
        projectDescription: input,
        requirements: allRequirements,
        budget: budget || undefined,
        timeline: timeline || undefined
      };

      const response: any = await aiService.identifyRoles(baseUrl, requestData);

      setMessages(prev => prev.filter(msg => !msg.isLoading));

      
      // Safety checks for response data - AI service unwraps response in prepareResponseObject
      const roles = response?.roles || [];
      const teamSize = response?.totalEstimatedTeamSize ?? roles.length;
      const phasing = response?.recommendedPhasing;
      const considerations = response?.keyConsiderations || [];

      const assistantMessage: Message = {
        role: MessageRole.ASSISTANT,
        content: formatRolesResponse(roles, teamSize, phasing, considerations),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      const errorMessage: Message = {
        role: MessageRole.ASSISTANT,
        content: `Sorry, I encountered an error: ${error?.message || 'Unable to process your request'}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setLoadingStartTime(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput('');
    setRequirements([]);
    setBudget('');
    setTimeline('');
  };

  return (
    <div className={styles.chatbotContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.aiIcon}>🤖</div>
              <div>
                <h3>AI Role Advisor</h3>
                <p>Get intelligent role recommendations</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button 
                onClick={startNewChat}
                className={styles.iconButton}
                title="New Chat"
              >
                ➕
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>
          </div>

          
          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div className={styles.welcomeScreen}>
                <div className={styles.welcomeIcon}>🚀</div>
                <h2>Welcome to AI Role Advisor!</h2>
                <p>Describe your project and I'll recommend the perfect team composition.</p>
                <div className={styles.exampleQueries}>
                  <p><strong>Try asking:</strong></p>
                  <div 
                    className={styles.exampleQuery}
                    onClick={() => setInput('I need to build a mobile fitness app with workout tracking and social features')}
                  >
                    "I need to build a mobile fitness app with workout tracking"
                  </div>
                  <div 
                    className={styles.exampleQuery}
                    onClick={() => setInput('Building a blockchain-based supply chain tracking system with Ethereum')}
                  >
                    "Building a blockchain supply chain tracking system"
                  </div>
                  <div 
                    className={styles.exampleQuery}
                    onClick={() => setInput('E-commerce platform with React frontend and Node.js backend')}
                  >
                    "E-commerce platform with React and Node.js"
                  </div>
                </div>

                <div className={styles.staticRoles}>
                  <p><strong>Available Roles:</strong></p>
                  <div className={styles.rolesGrid}>
                    <div className={styles.roleCard}>
                      <div className={styles.roleTitle}>Mobile App Developer</div>
                      <div className={styles.roleSkills}>React Native, Flutter, Mobile UI</div>
                    </div>
                    <div className={styles.roleCard}>
                      <div className={styles.roleTitle}>Backend Developer</div>
                      <div className={styles.roleSkills}>Node.js, MongoDB, REST API</div>
                    </div>
                    <div className={styles.roleCard}>
                      <div className={styles.roleTitle}>UI/UX Designer</div>
                      <div className={styles.roleSkills}>Mobile Design, Fitness App UX</div>
                    </div>
                    <div className={styles.roleCard}>
                      <div className={styles.roleTitle}>Social Features Developer</div>
                      <div className={styles.roleSkills}>Real-time Communication, Social APIs</div>
                    </div>
                    <div className={styles.roleCard}>
                      <div className={styles.roleTitle}>QA Engineer</div>
                      <div className={styles.roleSkills}>Testing, Quality Assurance</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`${styles.message} ${styles[msg.role]}`}
                >
                  <div className={styles.messageContent}>
                    {msg.isLoading ? (
                      <div className={styles.loadingDots}>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      <div className={styles.messageText}>
                        {msg.content.split('\n').map((line, i) => {
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <strong key={i}>{line.replace(/\*\*/g, '')}<br /></strong>;
                          }
                          if (line.startsWith('•')) {
                            return <div key={i} className={styles.bulletPoint}>{line}<br /></div>;
                          }
                          return <span key={i}>{line}<br /></span>;
                        })}
                      </div>
                    )}
                  </div>
                  <div className={styles.timestamp}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <div className={styles.optionalFields}>
              <input
                type="text"
                placeholder="Budget (optional, e.g., $50,000)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={styles.optionalInput}
              />
              <input
                type="text"
                placeholder="Timeline (optional, e.g., 3 months)"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className={styles.optionalInput}
              />
            </div>
            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your project requirements..."
                rows={3}
                disabled={loading}
                className={styles.textarea}
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className={styles.sendButton}
              >
                {loading ? '⏳' : '🚀'} {loading ? 'Analyzing...' : 'Get Recommendations'}
              </button>
            </form>
          </div>
        </div>
      )}

      <button 
        className={`${styles.chatToggle} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '🤖'}
        {!isOpen && <span className={styles.toggleText}>AI Role Advisor</span>}
      </button>
    </div>
  );
};
