import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiService, IdentifyRolesRequest, RoleWithResources, MatchingResource, Role } from 'src/services/ai';
import { EngagementService } from 'src/services/engagement';
import { ResourceCard } from './ResourceCard';
import { ROUTES } from 'src/constants/navigation-routes';
import { Notification } from 'src/components';
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
  rolesWithResources?: RoleWithResources[];
}

export const AIChatbot: React.FC = () => {
  const navigate = useNavigate();
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
  const engagementService = new EngagementService();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update loading message based on elapsed time
  useEffect(() => {
    if (!loading || !loadingStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - loadingStartTime;
      const seconds = Math.floor(elapsed / 1000);
      
      let message = 'Analyzing your project requirements and matching available resources...';
      
      if (seconds >= 5) {
        message = 'Finding the best-matched talent from our database... Almost there!';
      }
      
      if (seconds >= 10) {
        message = 'Calculating match scores and finalizing recommendations...';
      }
      
      if (seconds >= 15) {
        message = 'Preparing resource cards with detailed profiles...';
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

  
  const extractRequirements = (): string[] => {
    // Keywords should be extracted from backend configuration
    // For now, return empty array and let backend handle requirement extraction
    return [];
  };

  // Resource action handlers
  const handleScheduleInterview = (resourceId: string) => {
    const path = ROUTES.SCHEDULE_INTERVIEW.replace(':id', resourceId);
    
    // Navigate normally
    navigate(path, {
      state: {
        data: {
          id: resourceId,
        },
      },
    });
  };

  const handleViewTimesheet = async (resourceId: string) => {
    try {
      // First, get engagements to find the engagement ID for this resource
      const baseUrl = process.env.REACT_APP_BASE_URL || '';
      const response = await engagementService.getEngagements(baseUrl, 1, 10);
      
      const engagements = response?.data?.items || [];
      
      // Find engagement for this resource
      const engagement = engagements.find((eng: any) => 
        eng.resource?.id === resourceId && eng.hiringStatus === 'Active'
      );
      
      if (engagement) {
        // Navigate to timesheet page with engagement ID
        navigate(`/engagements/${engagement.id}/timesheets`);
      } else {
        // Fallback to old method if no active engagement found
        console.log('No active engagement found for resource:', resourceId);
        navigate(`${ROUTES.TIMESHEETS}?resourceId=${resourceId}`);
      }
    } catch (error) {
      console.error('Error fetching engagements:', error);
      // Fallback to old method on error
      navigate(`${ROUTES.TIMESHEETS}?resourceId=${resourceId}`);
    }
  };

  const handleViewInvoices = (resourceId: string) => {
    // Handle view invoices - navigate to invoices page
    console.log('View invoices for resource:', resourceId);
    // TODO: Implement navigation to invoices page
  };

  const handleSendInquiry = async (resourceId: string) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL || '';
      const message = 'I am interested in learning more about your expertise and availability for potential collaboration.';
      
      await engagementService.sendMessage(baseUrl, resourceId, message);
      
      // Show success notification
      Notification({
        type: 'success',
        message: 'Inquiry sent successfully!'
      });
      
      // Redirect to inquiries page on success
      navigate(ROUTES.INQUIRIES);
    } catch (error) {
      console.error('Error sending inquiry:', error);
      Notification({
        type: 'error',
        message: 'Failed to send inquiry. Please try again.'
      });
    }
  };

  const handleViewDetails = (resourceId: string) => {
    // Navigate to resource detail page
    navigate(`${ROUTES.RESOURCEBYID.replace(':id', resourceId)}`);
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
      response += `\nRecommended Phasing:\n${phasing}\n`;
    }

    if (considerations && Array.isArray(considerations) && considerations.length > 0) {
      response += `\nKey Considerations:\n`;
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
      content: 'Analyzing your project requirements and matching available resources...',
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL || '';
      const extractedReqs = extractRequirements();
      const allRequirements = Array.from(new Set([...requirements, ...extractedReqs]));

      const finalRequirements = allRequirements.length > 0 ? allRequirements : ['general'];

      const requestData: IdentifyRolesRequest = {
        projectDescription: input,
        requirements: finalRequirements,
        budget: budget || undefined,
        timeline: timeline || undefined
      };

      // Use quick endpoint for faster response with resource matching
      const response: any = await aiService.identifyRolesQuick(baseUrl, requestData);

      setMessages(prev => prev.filter(msg => !msg.isLoading));

      
      // Safety checks for response data - Quick endpoint returns roles with resources
      const rolesWithResources = response?.roles || [];
      const teamSize = response?.totalEstimatedTeamSize ?? rolesWithResources.length;
      const totalResources = response?.totalMatchingResources ?? 0;

      // Create summary message
      let summaryContent = `Based on your requirements, I found ${teamSize} recommended ${teamSize === 1 ? 'role' : 'roles'} with ${totalResources} matching ${totalResources === 1 ? 'resource' : 'resources'} from our database.\n\n`;
      summaryContent += `Showing real-time talent matched to your needs with availability and match scores.`;

      const assistantMessage: Message = {
        role: MessageRole.ASSISTANT,
        content: summaryContent,
        timestamp: new Date(),
        rolesWithResources: rolesWithResources
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

  const handleReset = () => {
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
                {/* <div className={styles.welcomeIcon}>AI</div> */}
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
                      <>
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
                        
                        {/* Render resource cards if available */}
                        {msg.rolesWithResources && msg.rolesWithResources.length > 0 && (
                          <div className={styles.rolesContainer}>
                            {msg.rolesWithResources.map((roleWithRes, roleIdx) => (
                              <div key={roleIdx} className={styles.roleSection}>
                                <div className={styles.roleHeader}>
                                  <h4 className={styles.roleTitle}>
                                    {roleWithRes.role.title} ({roleWithRes.role.seniorityLevel})
                                  </h4>
                                  <span className={styles.rolePriority}>
                                    {roleWithRes.role.priority}
                                  </span>
                                </div>
                                <p className={styles.roleReasoning}>{roleWithRes.role.reasoning}</p>
                                <div className={styles.roleSkills}>
                                  <strong>Required Skills:</strong> {roleWithRes.role.skills.join(', ')}
                                </div>
                                
                                {roleWithRes.matchingResources.length > 0 ? (
                                  <div className={styles.matchingResourcesSection}>
                                    <h5 className={styles.matchingSectionTitle}>
                                      {roleWithRes.matchingResources.length} Matching {roleWithRes.matchingResources.length === 1 ? 'Resource' : 'Resources'}
                                    </h5>
                                    {roleWithRes.matchingResources.map((resource) => (
                                      <ResourceCard
                                        key={resource.id}
                                        resource={resource}
                                        onScheduleInterview={handleScheduleInterview}
                                        onViewTimesheet={handleViewTimesheet}
                                        onSendInquiry={handleSendInquiry}
                                        onViewDetails={handleViewDetails}
                                      />
                                    ))}
                                  </div>
                                ) : (
                                  <div className={styles.noResources}>
                                    No matching resources found for this role.
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
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
                {loading ? 'Analyzing...' : 'Get Recommendations'}
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
