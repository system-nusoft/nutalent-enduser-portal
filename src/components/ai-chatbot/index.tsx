import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AiService, IdentifyRolesRequest, RoleWithResources, MatchingResource, Role } from 'src/services/ai';
import { EngagementService } from 'src/services/engagement';
import { ResourceCard } from './ResourceCard';
import { ROUTES } from 'src/constants/navigation-routes';
import { Notification } from 'src/components';
import { ENGAGEMENTS_STATUS } from 'src/utils/enum';
import { AiService, IdentifyRolesRequest, Role, PricingResult } from 'src/services/ai';
import styles from './styles.module.scss';
import { CLASSIFICATION_INTENT } from 'src/utils/enum';
import { useTranslation } from 'react-i18next';

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
  pricingData?: PricingResult[];
}

export const AIChatbot: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<string>('Global');
  const [locationFetched, setLocationFetched] = useState(false);
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
      
      let message = t('aiChatbot.analyzing');
      
      if (seconds >= 5) {
        message = t('aiChatbot.findingTalent');
      }
      
      if (seconds >= 10) {
        message = t('aiChatbot.calculatingScores');
      }
      
      if (seconds >= 15) {
        message = t('aiChatbot.preparingCards');
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
      const baseUrl = process.env.REACT_APP_BASE_URL;
      if (!baseUrl) {
        console.error('Base URL not configured');
        navigate(`${ROUTES.TIMESHEETS}?resourceId=${resourceId}`);
        return;
      }

      const response = await engagementService.getEngagements(baseUrl, 1, 10);
      
      const engagements = response?.data?.items || [];
      
      // Find engagement for this resource using enum
      const engagement = engagements.find((eng: any) => 
        eng?.resource?.id === resourceId && eng?.hiringStatus === ENGAGEMENTS_STATUS.ACTIVE
      );
      
      if (engagement?.id) {
        navigate(ROUTES.VIEW_TIMESHEET.replace(':engagementId', engagement.id).replace(':resourceId', resourceId));
      } else {
        console.log('No active engagement found for resource:', resourceId);
        navigate(`${ROUTES.TIMESHEETS}?resourceId=${resourceId}`);
      }
    } catch (error) {
      console.error('Error fetching engagements:', error);
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
      const baseUrl = process.env.REACT_APP_BASE_URL;
      if (!baseUrl) {
        Notification({
          type: 'error',
          message: t('error.configurationError')
        });
        return;
      }

      const message = t('aiChatbot.inquiryMessage');
      
      await engagementService.sendMessage(baseUrl, resourceId, message);
      
      Notification({
        type: 'success',
        message: t('notification.inquirySent')
      });
      
      navigate(ROUTES.INQUIRIES);
    } catch (error) {
      console.error('Error sending inquiry:', error);
      Notification({
        type: 'error',
        message: t('error.inquiryFailed')
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

  // Reverse-geocode lat/lng → country name using a free public API
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=3`
      );
      const data = await res.json();
      return data?.address?.country || 'Global';
    } catch {
      return 'Global';
    }
  };

  // IP-based fallback when browser geolocation is denied/unavailable
  const fetchLocationByIP = async (): Promise<string> => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      return data?.country_name || 'Global';
    } catch {
      return 'Global';
    }
  };

  const fetchUserLocation = async () => {
    if (locationFetched) return;

    // Try browser geolocation first (most accurate)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const country = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );
          setUserLocation(country);
          setLocationFetched(true);
        },
        async () => {
          // User denied or geolocation failed -> fall back to IP lookup
          const country = await fetchLocationByIP();
          setUserLocation(country);
          setLocationFetched(true);
        },
        { timeout: 5000, maximumAge: 600000 }
      );
    } else {
      const country = await fetchLocationByIP();
      setUserLocation(country);
      setLocationFetched(true);
    }
  };

  useEffect(() => {
    if (isOpen && !locationFetched) {
      fetchUserLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, locationFetched]);


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
      content: t('aiChatbot.analyzing'),
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL || '';
      if (!baseUrl) {
        throw new Error(t('error.configurationError'));
      }
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
      let summaryContent = t('aiChatbot.summaryMessage', { 
        teamSize, 
        roleText: teamSize === 1 ? t('aiChatbot.role') : t('aiChatbot.roles'),
        totalResources,
        resourceText: totalResources === 1 ? t('aiChatbot.resource') : t('aiChatbot.resources')
      });
      summaryContent += `\n\n${t('aiChatbot.showingTalent')}`;

      const assistantMessage: Message = {
        role: MessageRole.ASSISTANT,
        content: summaryContent,
        timestamp: new Date(),
        rolesWithResources: rolesWithResources
      };

      setMessages(prev => [...prev, assistantMessage]);
      const currentInput = userMessage.content;

      // Step 1: classify intent + extract roles via Gemini
      console.log('[chatbot] Calling classifyIntent with:', currentInput);
      const classification = await aiService.classifyIntent(baseUrl, currentInput);
      console.log('[chatbot] Classification result:', classification);

      // Step 2: route based on intent
      if (classification.intent === CLASSIFICATION_INTENT.PRICING && classification.roles.length > 0) {
         console.log('[chatbot] → pricing flow, roles:', classification.roles);
        const response = await aiService.optimizePricing(baseUrl, {
          roles: classification.roles,
          location: userLocation,
          budget: budget ? parseFloat(budget.replace(/[^0-9.]/g, '')) || undefined : undefined,
        });

        setMessages((prev) => prev.filter((msg) => !msg.isLoading));
        setMessages((prev) => [
          ...prev,
          {
            role: MessageRole.ASSISTANT,
            content: '',
            timestamp: new Date(),
            pricingData: response.results,
          },
        ]);
      } else if (classification.intent === CLASSIFICATION_INTENT.ROLE_IDENTIFICATION) {
        // Existing flow — unchanged
        const extractedReqs = extractRequirements();
        const allRequirements = Array.from(new Set([...requirements, ...extractedReqs]));
        const finalRequirements = allRequirements.length > 0 ? allRequirements : ['general'];

        const requestData: IdentifyRolesRequest = {
          projectDescription: currentInput,
          requirements: finalRequirements,
          budget: budget || undefined,
          timeline: timeline || undefined,
        };

        const response: any = await aiService.identifyRoles(baseUrl, requestData);
        setMessages((prev) => prev.filter((msg) => !msg.isLoading));

        const roles = response?.roles || [];
        const teamSize = response?.totalEstimatedTeamSize ?? roles.length;
        const phasing = response?.recommendedPhasing;
        const considerations = response?.keyConsiderations || [];

        setMessages((prev) => [
          ...prev,
          {
            role: MessageRole.ASSISTANT,
            content: formatRolesResponse(roles, teamSize, phasing, considerations),
            timestamp: new Date(),
          },
        ]);
      } else {
        // Pricing intent without roles, or unknown
        setMessages((prev) => prev.filter((msg) => !msg.isLoading));
        setMessages((prev) => [
          ...prev,
          {
            role: MessageRole.ASSISTANT,
            content:
              classification.intent === CLASSIFICATION_INTENT.PRICING
                ? t('chatbot.pricingNoRole')
                : t('chatbot.fallbackHelp'),
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error: any) {
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      const errorMessage: Message = {
        role: MessageRole.ASSISTANT,
        content: t('aiChatbot.errorMessage', { error: error?.message || t('aiChatbot.defaultError') }),
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

  // const renderPricingResult = (data: PricingResult[]) => (
  const renderPricingResult = (data: PricingResult[]) => {
    // Build a friendly intro line summarizing what we found
    const totalResources = data.reduce((sum, r) => sum + r.totalAvailable, 0);
    const roleNames = data.map((r) => r.role).join(', ');

    const intro =
      totalResources === 0
        ? t('chatbot.noResourcesFound', { roleNames })
        : t('chatbot.resourcesAvailable', { count: totalResources, roleNames });

    return (
    <div className={styles.pricingResults}>
      <p className={styles.pricingIntro}>{intro}</p>
      {data.map((result, idx) => (
        <div key={idx} className={styles.pricingRole}>
          <div className={styles.pricingRoleHeader}>
            <strong>{result.role}</strong>
            <span className={styles.regionBadge}> {result.detectedRegion}</span>
          </div>

          {result.levelResults.length === 0 ? (
            <div className={styles.noResources}>
              <p>{result.responseMessage}</p>
            </div>
          ) : (
            result.levelResults.map((lr, lrIdx) => (
              <div
                key={lrIdx}
                className={`${styles.levelCard} ${lr.isCheaper ? styles.cheaperCard : styles.regularCard}`}
              >
                <div className={styles.levelHeader}>
                  <span className={styles.levelTitle}>{lr.level}</span>
                  <span className={styles.resourceCount}>
                    {lr.resourceCount} {lr.resourceCount === 1 ? 'resource' : 'resources'} available
                  </span>
                </div>

                {/* Only show market comparison if we have a real market rate */}
                {lr.marketRate ? (
                  <>
                    <div className={styles.rateRow}>
                      <div className={styles.rateBlock}>
                        <span className={styles.rateLabel}>Market ({lr.detectedRegion})</span>
                        <span className={styles.rateValue}>${lr.marketRate.avg}/hr</span>
                        <span className={styles.rateRange}>
                          ${lr.marketRate.min}–${lr.marketRate.max}
                        </span>
                      </div>
                      <div className={styles.rateBlock}>
                        <span className={styles.rateLabel}>Our Rate</span>
                        <span className={styles.rateValue}>${lr.ourRates.avg}/hr</span>
                        <span className={styles.rateRange}>
                          ${lr.ourRates.min}–${lr.ourRates.max}
                        </span>
                      </div>
                    </div>

                    {lr.isCheaper ? (
                      <div className={styles.savingsBanner}>
                        {lr.savingsPercent}% cheaper — saving ~${lr.savings}/hr
                      </div>
                    ) : (
                      <div className={styles.neutralBanner}>
                        Verified profiles available at competitive rates
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.rateBlock}>
                    <span className={styles.rateLabel}>Our Rate</span>
                    <span className={styles.rateValue}>${lr.ourRates.avg}/hr</span>
                    <span className={styles.rateRange}>
                      ${lr.ourRates.min}–${lr.ourRates.max}
                    </span>
                  </div>
                )}

                <div className={styles.resourceList}>
                  {lr.resources?.slice(0, 3).map((res, resIdx) => (
                    <div key={res?.id ?? resIdx} className={styles.resourceCard}>
                      {res?.profilePicture ? (
                        <img src={res.profilePicture} alt={res?.name || '-'} className={styles.avatar} />
                      ) : (
                        <div className={styles.avatarPlaceholder}>{res?.name?.[0] || '-'}</div>
                      )}
                      <div className={styles.resourceInfo}>
                        <div className={styles.resourceName}>{res?.name || '-'}</div>
                        <div className={styles.resourceTitle}>{res?.title || '-'}</div>
                        <div className={styles.resourceMeta}>
                          ${res?.hourlyRate ?? '-'}/hr • {res?.totalYearsOfExperience ?? '-'}y exp
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
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
                    ) : msg.pricingData && msg.pricingData.length > 0 ? (
                      renderPricingResult(msg.pricingData)
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
                                    {roleWithRes?.role?.title || 'Unknown Role'} ({roleWithRes?.role?.seniorityLevel || 'N/A'})
                                  </h4>
                                  <span className={styles.rolePriority}>
                                    {roleWithRes?.role?.priority || 'N/A'}
                                  </span>
                                </div>
                                <p className={styles.roleReasoning}>{roleWithRes?.role?.reasoning || ''}</p>
                                <div className={styles.roleSkills}>
                                  <strong>Required Skills:</strong> {roleWithRes?.role?.skills?.join(', ') || 'N/A'}
                                </div>
                                
                                {roleWithRes?.matchingResources && roleWithRes.matchingResources.length > 0 ? (
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
