import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { ResourceCard } from './ResourceCard';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { AiService } from 'src/services/ai';
import { EngagementService } from 'src/services/engagement';
import { Notification } from 'src/components';
import { ROUTES } from 'src/constants/navigation-routes';
import { ENGAGEMENTS_STATUS, CLASSIFICATION_INTENT } from 'src/utils/enum';
import {
  UnifiedRolesWithPricingRequest,
  UnifiedRolesWithPricingResponse,
  ResourceWithPricing,
  PricingLevel,
  RoleWithPricingDetails,
  RoleWithResources,
  PricingResult,
  Role
} from 'src/services/ai';

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
  unifiedData?: UnifiedRolesWithPricingResponse;
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

  const messageSuggestions = [
    "Build a mobile app like Instagram",
    "E-commerce platform with AI recommendations",
    "Real-time collaboration tool for teams",
    "Healthcare patient management system"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Debug: Check if suggestions should be visible
  useEffect(() => {
    console.log('Messages length:', messages.length);
    console.log('Should show suggestions:', messages.length > 0);
    console.log('Message suggestions:', messageSuggestions);
  }, [messages.length]);

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

      // Use unified endpoint - single API call for roles + resources + pricing
      const response = await aiService.identifyRolesWithPricing(baseUrl, {
        projectDescription: input,
        location: userLocation,
        budget: budget || undefined,
        requirements: allRequirements.length > 0 ? allRequirements : undefined
      });

      setMessages(prev => prev.filter(msg => !msg.isLoading));

      // Create summary message with savings info
      let summaryContent = `${response.overallSavingsSummary}\n\nFound ${response.totalEstimatedTeamSize} recommended roles with ${response.totalMatchingResources} matching resources.`;
      
      if (response.keyConsiderations && response.keyConsiderations.length > 0) {
        summaryContent += `\n\n**Key Considerations:**\n${response.keyConsiderations.map(c => `• ${c}`).join('\n')}`;
      }

      const assistantMessage: Message = {
        role: MessageRole.ASSISTANT,
        content: summaryContent,
        timestamp: new Date(),
        unifiedData: response
      };

      setMessages(prev => [...prev, assistantMessage]);
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

  const renderUnifiedData = (data: UnifiedRolesWithPricingResponse) => {
    return (
      <div className={styles.unifiedResults}>
        {data.roles.map((role, roleIdx) => (
          <div key={roleIdx} className={styles.roleSection}>
            <div className={styles.roleHeader}>
              <h4 className={styles.roleTitle}>
                {role?.title || 'Unknown Role'} ({role?.seniorityLevel || 'N/A'})
              </h4>
              <span className={styles.rolePriority}>
                {role?.priority || 'N/A'}
              </span>
            </div>
            <p className={styles.roleReasoning}>{role?.reasoning || ''}</p>
            <div className={styles.roleSkills}>
              <strong>Required Skills:</strong> {role?.skills?.join(', ') || 'N/A'}
            </div>
            
            {role?.pricingSummary && (
              <div className={styles.pricingSummaryBox}>
                {role.pricingSummary}
              </div>
            )}

            {role?.pricingLevels && role.pricingLevels.length > 0 ? (
              <div className={styles.pricingLevelsSection}>
                {role.pricingLevels.map((level, levelIdx) => (
                  <div key={levelIdx} className={`${styles.levelCard} ${level.isCheaper ? styles.cheaperCard : styles.regularCard}`}>
                    <div className={styles.levelHeader}>
                      <span className={styles.levelTitle}>{level.level}</span>
                      <span className={styles.resourceCount}>
                        {level.resourceCount} {level.resourceCount === 1 ? 'resource' : 'resources'}
                      </span>
                    </div>

                    <div className={styles.rateRow}>
                      {level.marketRate && (
                        <div className={styles.rateBlock}>
                          <span className={styles.rateLabel}>Market ({level.detectedRegion})</span>
                          <span className={styles.rateValue}>${level.marketRate.avg.toFixed(2)}/hr</span>
                          <span className={styles.rateRange}>
                            ${level.marketRate.min}–${level.marketRate.max}
                          </span>
                        </div>
                      )}
                      <div className={styles.rateBlock}>
                        <span className={styles.rateLabel}>Our Rate</span>
                        <span className={styles.rateValue}>${level.ourRates.avg.toFixed(2)}/hr</span>
                        <span className={styles.rateRange}>
                          ${level.ourRates.min}–${level.ourRates.max}
                        </span>
                      </div>
                    </div>

                    {level.isCheaper && level.savings > 0 && (
                      <div className={styles.savingsBanner}>
                        {level.savingsPercent}% cheaper — saving ~${(level.savings || 0).toFixed(2)}/hr
                      </div>
                    )}

                    {level.resources && level.resources.length > 0 ? (
                      <div className={styles.resourceList}>
                        {level.resources.slice(0, 3).map((resource) => (
                          <ResourceCard
                            key={resource.id}
                            resource={{
                              id: resource.id,
                              fullName: resource.fullName,
                              title: resource.title,
                              skills: resource.skills,
                              yearsOfExperience: resource.yearsOfExperience,
                              availableStatus: resource.availableStatus,
                              matchScore: resource.matchScore,
                              profilePicture: resource.profilePicture
                            }}
                            onScheduleInterview={handleScheduleInterview}
                            onViewTimesheet={handleViewTimesheet}
                            onSendInquiry={handleSendInquiry}
                            onViewDetails={handleViewDetails}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className={styles.noResourcesLabel}>
                        No matched resources available
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noResourcesLabel}>
                No matched resources available
              </div>
            )}
          </div>
        ))}
      </div>
    );
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
                        <span className={styles.rateValue}>${lr.marketRate.avg.toFixed(2)}/hr</span>
                        <span className={styles.rateRange}>
                          ${lr.marketRate.min}–${lr.marketRate.max}
                        </span>
                      </div>
                      <div className={styles.rateBlock}>
                        <span className={styles.rateLabel}>Our Rate</span>
                        <span className={styles.rateValue}>${lr.ourRates.avg.toFixed(2)}/hr</span>
                        <span className={styles.rateRange}>
                          ${lr.ourRates.min}–${lr.ourRates.max}
                        </span>
                      </div>
                    </div>

                    {lr.isCheaper ? (
                      <div className={styles.savingsBanner}>
                        {lr.savingsPercent}% cheaper — saving ~${(lr.savings || 0).toFixed(2)}/hr
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
              <Tooltip title="AI Role Advisor - Your intelligent assistant" placement="bottom">
                <div className={styles.aiIcon}>🤖</div>
              </Tooltip>
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
                <h2>Welcome to AI Role Advisor!</h2>
                <p>Describe your project and I'll recommend the perfect team composition with pricing insights.</p>
                <div className={styles.messageSuggestions}>
                  <p><strong>Try asking:</strong></p>
                  <div className={styles.suggestionChips}>
                    <div 
                      className={styles.suggestionChip}
                      onClick={() => setInput('Build a mobile app like Instagram')}
                    >
                      Build a mobile app like Instagram
                    </div>
                    <div 
                      className={styles.suggestionChip}
                      onClick={() => setInput('E-commerce platform with AI recommendations')}
                    >
                      E-commerce platform with AI recommendations
                    </div>
                    <div 
                      className={styles.suggestionChip}
                      onClick={() => setInput('Real-time collaboration tool for teams')}
                    >
                      Real-time collaboration tool for teams
                    </div>
                    <div 
                      className={styles.suggestionChip}
                      onClick={() => setInput('Healthcare patient management system')}
                    >
                      Healthcare patient management system
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
                    ) : msg.unifiedData ? (
                      renderUnifiedData(msg.unifiedData)
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
            
            {/* Add suggestions at the end of messages */}
            {messages.length > 0 && (
              <div className={styles.messageSuggestions}>
                <p><strong>Try asking:</strong></p>
                <div className={styles.suggestionChips}>
                  {messageSuggestions.map((suggestion, idx) => (
                    <div 
                      key={idx}
                      className={styles.suggestionChip}
                      onClick={() => setInput(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
