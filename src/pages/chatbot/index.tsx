import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { ResourceAccordion } from 'src/components/ai-chatbot/ResourceAccordion';
import { ConversationHistory } from './ConversationHistory';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { AppService } from 'src/services/app';
import { ROUTES } from 'src/constants/navigation-routes';
import { AiService } from 'src/services/ai';
import {
  ChatRequest,
  ChatResponse,
  ConversationListItem,
  UnifiedRolesWithPricingResponse,
  OptimizePricingResponse,
  PricingResult,
  RoleWithResources,
} from 'src/services/ai';

enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant'
}

enum ChatIntent {
  ROLE_IDENTIFICATION = 'role_identification',
  PRICING = 'pricing',
  PLATFORM_DATA = 'platform_data',
  GENERAL = 'general',
  UNKNOWN = 'unknown',
  CREATE_PROJECT = 'create_project',
}

interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  rolesWithResources?: RoleWithResources[];
  pricingData?: PricingResult[];
  unifiedData?: UnifiedRolesWithPricingResponse;
  projectData?: { title?: string; description?: string };
}

export const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<string>('Global');
  const [locationFetched, setLocationFetched] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const aiService = new AiService();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
    }, 5000);

    return () => clearInterval(interval);
  }, [loading, loadingStartTime, t]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleViewDetails = (resourceId: string) => {
    navigate(`${ROUTES.RESOURCEBYID.replace(':id', resourceId)}`);
  };

  const handleCreateProject = (projectData?: { title?: string; description?: string }) => {
    navigate(ROUTES.CREATE_PROJECT, {
      state: {
        data: {
          name: projectData?.title || '',
          summary: projectData?.description || '',
        },
      },
    });
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
      
      // Navigate to favourites page on success
      navigate(ROUTES.FAVORITE_RESOURCES);
    } catch (error) {
      console.error('Error favouriting resources:', error);
    }
  };

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
    if (!locationFetched) {
      fetchUserLocation();
    }
  }, [locationFetched]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadConversations = async () => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL || '';
      if (!baseUrl) return;

      setLoadingConversations(true);
      const convos = await aiService.getConversations(baseUrl);
      setConversations(convos.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ));
    } catch (error: any) {
      console.error('Error loading conversations:', error);
      // If endpoint not implemented yet, just set empty array
      if (error?.message?.includes('404') || error?.message?.includes('Cannot GET')) {
        setConversations([]);
      }
    } finally {
      setLoadingConversations(false);
    }
  };

  const handleSelectConversation = async (id: string) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL || '';
      if (!baseUrl) return;

      setLoading(true);
      const conversation = await aiService.getConversation(baseUrl, id);
      
      setConversationId(id);
      const loadedMessages: Message[] = conversation.messages.map(msg => {
        const toolCalls = (msg as any).toolCalls || {};

        let unifiedData: UnifiedRolesWithPricingResponse | undefined;
        let pricingData: PricingResult[] | undefined;
        let projectData: { title?: string; description?: string } | undefined;

        if (toolCalls.intent === ChatIntent.ROLE_IDENTIFICATION) {
          unifiedData = toolCalls.rolesData as UnifiedRolesWithPricingResponse;
        } else if (toolCalls.intent === ChatIntent.PRICING) {
          pricingData = (toolCalls.rolesData as OptimizePricingResponse | undefined)?.results || [];
        } else if (toolCalls.intent === ChatIntent.CREATE_PROJECT) {
          projectData = toolCalls.rolesData as { title?: string; description?: string } | undefined;
        }

        return {
          role: msg.role === 'user' ? MessageRole.USER : MessageRole.ASSISTANT,
          content: msg.content,
          timestamp: new Date(msg.createdAt),
          unifiedData,
          pricingData,
          projectData,
        };
      });
      
      setMessages(loadedMessages);
      setLoading(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL || '';
      if (!baseUrl) return;

      await aiService.deleteConversation(baseUrl, id);
      
      setConversations(prev => prev.filter(c => c.id !== id));
      
      if (conversationId === id) {
        handleNewConversation();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleNewConversation = () => {
    setConversationId(undefined);
    setMessages([]);
    setInput('');
    setRequirements([]);
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
        // Reload conversations to show the new one
        loadConversations();
      }

      setMessages(prev => prev.filter(msg => !msg.isLoading));

      // Handle response based on intent
      console.log('Response intent:', response.intent, 'ChatIntent.PRICING:', ChatIntent.PRICING, 'match:', response.intent === ChatIntent.PRICING);
      let assistantMessage: Message;

      if (response.intent === ChatIntent.CREATE_PROJECT) {
        assistantMessage = {
          role: MessageRole.ASSISTANT,
          content: response.text || 'Response received',
          timestamp: new Date(),
          projectData: response.projectData
        };
      } else if (response.intent === ChatIntent.ROLE_IDENTIFICATION && (response.rolesData || response.data)) {
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
       } else if (response.intent === ChatIntent.PRICING) {
        const pricingResponse = response.rolesData as OptimizePricingResponse | undefined;
        console.log('PRICING intent matched. rolesData:', response.rolesData, 'results:', pricingResponse?.results);
        assistantMessage = {
          role: MessageRole.ASSISTANT,
          content: response.text || 'Response received',
          timestamp: new Date(),
          pricingData: pricingResponse?.results || []
        };
      } else {
        // For platform_data or general intents
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

  const renderUnifiedData = (data: UnifiedRolesWithPricingResponse) => {
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
                          <span className={styles.rateLabel}>Tentative Average Market Rate</span>
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

  const renderPricingData = (pricingResults: PricingResult[]) => {
    if (!pricingResults || pricingResults.length === 0) return null;

    return (
      <div className={styles.unifiedResults}>
        {pricingResults.map((result, resultIdx) => (
          <div key={resultIdx} className={styles.roleSection}>
            <div className={styles.roleHeader}>
              <h4 className={styles.roleTitle}>
                {result?.role || 'Unknown Role'}
              </h4>
            </div>

            {result?.levelResults && result.levelResults.length > 0 ? (
              <div className={styles.pricingLevelsSection}>
                {result.levelResults.map((level, levelIdx) => (
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
                        roleSeniority={level?.level || ''}
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

  return (
    <div className={styles.chatbotPageContainer}>
      <ConversationHistory
        conversations={conversations}
        selectedConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onNewConversation={handleNewConversation}
        loading={loadingConversations}
      />
      <div className={styles.chatbotFullPage}>
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
                  ) : msg.pricingData ? (
                    <>
                      <div className={styles.messageText}>
                        {msg.content.split('\n').map((line, i) => (
                          <span key={i}>{line}<br /></span>
                        ))}
                      </div>
                      {renderPricingData(msg.pricingData)}
                    </>
                  ) : msg.projectData !== undefined ? (
                    <>
                      <div className={styles.messageText}>
                        {msg.content.split('\n').map((line, i) => (
                          <span key={i}>{line}<br /></span>
                        ))}
                      </div>
                      <button
                        className={styles.sendButton}
                        onClick={() => handleCreateProject(msg.projectData)}
                        style={{ marginTop: '8px' }}
                      >
                        Create Project
                      </button>
                    </>
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
    </div>
  );
};
