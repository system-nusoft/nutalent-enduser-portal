import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'antd';
import { ResourceCard } from './ResourceCard';
import { ResourceAccordion } from './ResourceAccordion';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './styles.module.scss';
import { EngagementService } from 'src/services/engagement';
import { AppService } from 'src/services/app';
import { Notification } from 'src/components';
import { ROUTES } from 'src/constants/navigation-routes';
import RequestAppAction from 'src/store/slices/app-actions';
import { ENGAGEMENTS_STATUS, CLASSIFICATION_INTENT } from 'src/utils/enum';
import { AiService } from 'src/services/ai';
import {
  ChatRequest,
  ChatResponse,
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
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<string>('Global');
  const [locationFetched, setLocationFetched] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const engagementService = new EngagementService();
  const aiService = new AiService();

  const messageSuggestions = [
    t('aiChatbot.suggestion1'),
    t('aiChatbot.suggestion2'),
    t('aiChatbot.suggestion3'),
    t('aiChatbot.suggestion4')
  ];

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

  useEffect(() => {
    if (isOpen && !locationFetched) {
      fetchUserLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, locationFetched]);

  // Click outside to close functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Don't show chatbot on dedicated chatbot page
  if (location.pathname === '/chatbot') {
    return null;
  }

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

  const handleBookmarkAll = async (resourceIds: string[]) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      if (!baseUrl) {
        console.error('Base URL not configured');
        return;
      }

      const appService = new AppService();
      await appService.fetchBulkFavoriteResources(baseUrl, { resourceIds });
      
      // Refresh favorite resources list if on favorites page
      if (location.pathname.includes('/resources') && location.hash === '#favorite') {
        dispatch(RequestAppAction.handleGetFavoriteResrouces({
          query: { page: 1, search: '' }
        }));
      }
      
      // Navigate to favourites page on success
      navigate(ROUTES.FAVORITE_RESOURCES);
    } catch (error) {
      console.error('Error favouriting resources:', error);
    }
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


  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;

    const userMessage: Message = {
      role: MessageRole.USER,
      content: input,
      timestamp: new Date()
    };

    const currentInput = input;
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

      // Use new chat endpoint
      const chatRequest: ChatRequest = {
        message: currentInput,
        conversationId: conversationId,
        location: userLocation
      };

      const response: ChatResponse = await aiService.sendChatMessage(baseUrl, chatRequest);
      
      // Store conversation ID for subsequent messages
      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
      }

      setMessages(prev => prev.filter(msg => !msg.isLoading));

      // Handle response based on intent
      let assistantMessage: Message;

      if (response.intent === 'role_identification' && (response.rolesData || response.data)) {
        const unifiedData = (response.rolesData || response.data) as UnifiedRolesWithPricingResponse;
        let summaryContent = `${unifiedData.overallSavingsSummary || 'Analysis complete'}\n\nFound ${unifiedData.totalEstimatedTeamSize || 0} recommended roles with ${unifiedData.totalMatchingResources || 0} matching resources.`;
        
        if (unifiedData.keyConsiderations && unifiedData.keyConsiderations.length > 0) {
          summaryContent += `\n\n**Key Considerations:**\n${unifiedData.keyConsiderations.map((c: string) => `• ${c}`).join('\n')}`;
        }

        assistantMessage = {
          role: MessageRole.ASSISTANT,
          content: summaryContent,
          timestamp: new Date(),
          unifiedData: unifiedData
        };
      } else {
        // For pricing, platform_data, or general intents
        assistantMessage = {
          role: MessageRole.ASSISTANT,
          content: response.text || response.message || 'Response received',
          timestamp: new Date()
        };
      }

      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
      setLoadingStartTime(null);
    } catch (error: any) {
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      const errorMessage: Message = {
        role: MessageRole.ASSISTANT,
        content: t('aiChatbot.errorMessage', { error: error?.message || t('aiChatbot.defaultError') }),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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
  };

  const renderUnifiedData = (data: UnifiedRolesWithPricingResponse) => {
    // Safety check for roles array
    if (!data || !data.roles || !Array.isArray(data.roles)) {
      return (
        <div className={styles.unifiedResults}>
          <div className={styles.noResourcesLabel}>
            {t('aiChatbot.noMatchedResources')}
          </div>
        </div>
      );
    }

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

            {role?.pricingLevels && role.pricingLevels.length > 0 ? (
              <div className={styles.pricingLevelsSection}>
                {role.pricingLevels.map((level, levelIdx) => (
                  <div key={levelIdx} className={`${styles.levelCard} ${level.isCheaper ? styles.cheaperCard : styles.regularCard}`}>
                    <div className={styles.levelHeader}>
                      <span className={styles.levelTitle}>{level.level || 'Standard'}</span>
                      <span className={styles.resourceCount}>
                        {level.resourceCount || 0} {(level.resourceCount || 0) === 1 ? 'resource' : 'resources'}
                      </span>
                    </div>

                    <div className={styles.rateRow}>
                      {level?.marketRate && (
                        <div className={styles.rateBlock}>
                          <span className={styles.rateLabel}>Market ({level?.detectedRegion || 'Global'})</span>
                          <span className={styles.rateValue}>${(level?.marketRate?.avg || 0).toFixed(2)}/hr</span>
                          <span className={styles.rateRange}>
                            ${(level?.marketRate?.min || 0)}–${(level?.marketRate?.max || 0)}
                          </span>
                        </div>
                      )}
                      <div className={styles.rateBlock}>
                        <span className={styles.rateLabel}>Our Rate</span>
                        <span className={styles.rateValue}>${(level?.ourRates?.avg || 0).toFixed(2)}/hr</span>
                        <span className={styles.rateRange}>
                          ${(level?.ourRates?.min || 0)}–${(level?.ourRates?.max || 0)}
                        </span>
                      </div>
                    </div>

                    {level?.isCheaper && (level?.savings || 0) > 0 && (
                      <div className={styles.savingsBanner}>
                        {level?.savingsPercent || 0}% cheaper — saving ~${(level?.savings || 0).toFixed(2)}/hr
                      </div>
                    )}

                    {level.resources && level.resources.length > 0 ? (
                      <ResourceAccordion
                        resources={level.resources}
                        onViewDetails={handleViewDetails}
                        onBookmarkAll={handleBookmarkAll}
                        roleSeniority={role?.seniorityLevel || ''}
                      />
                    ) : (
                      <div className={styles.noResourcesLabel}>
                        {t('aiChatbot.noMatchedResources')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noResourcesLabel}>
                {t('aiChatbot.noMatchedResources')}
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
                    <span className={styles.rateValue}>${lr.ourRates.avg.toFixed(2)}/hr</span>
                    <span className={styles.rateRange}>
                      ${lr.ourRates.min}–${lr.ourRates.max}
                    </span>
                  </div>
                )}

                <div className={styles.resourceList}>
                  {lr.resources?.map((res, resIdx) => (
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
        <div className={styles.chatWindow} ref={chatWindowRef}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <Tooltip title={t('aiChatbot.tooltipTitle')} placement="bottom">
                <div className={styles.aiIcon}>🤖</div>
              </Tooltip>
              <div>
                <h3>{t('aiChatbot.title')}</h3>
                <p>{t('aiChatbot.subtitle')}</p>
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
                <h2>{t('aiChatbot.welcomeTitle')}</h2>
                <p>{t('aiChatbot.welcomeDescription')}</p>
                <div className={styles.messageSuggestions}>
                  <p><strong>{t('aiChatbot.tryAsking')}</strong></p>
                  <div className={styles.suggestionChips}>
                    <div 
                      className={styles.suggestionChip}
                      onClick={() => setInput(t('aiChatbot.suggestion1'))}
                    >
                      {t('aiChatbot.suggestion1')}
                    </div>
                    <div 
                      className={styles.suggestionChip}
                      onClick={() => setInput(t('aiChatbot.suggestion2'))}
                    >
                      {t('aiChatbot.suggestion2')}
                    </div>
                    <div 
                      className={styles.suggestionChip}
                      onClick={() => setInput(t('aiChatbot.suggestion3'))}
                    >
                      {t('aiChatbot.suggestion3')}
                    </div>
                    <div 
                      className={styles.suggestionChip}
                      onClick={() => setInput(t('aiChatbot.suggestion4'))}
                    >
                      {t('aiChatbot.suggestion4')}
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
          </div>

          <div className={styles.inputArea}>
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
        {!isOpen && <span className={styles.toggleText}>Chatbot</span>}
      </button>
    </div>
  );
};
