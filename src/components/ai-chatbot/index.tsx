import React, { useState, useEffect, useRef } from 'react';
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
  pricingData?: PricingResult[];
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
  const [userLocation, setUserLocation] = useState<string>('Global');
  const [locationFetched, setLocationFetched] = useState(false);
  const aiService = new AiService();
  const { t } = useTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Update loading message based on elapsed time
  useEffect(() => {
    if (!loading || !loadingStartTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - loadingStartTime;
      const seconds = Math.floor(elapsed / 1000);
      
      let message = 'Analyzing your project requirements and generating optimal team recommendations...';
      
      if (seconds >= 10) {
        message = 'Deep learning analysis in progress... This may take up to 30 seconds for complex projects.';
      }
      
      if (seconds >= 20) {
        message = 'Processing complex requirements and optimizing team composition... Almost there!';
      }
      
      if (seconds >= 30) {
        message = 'Finalizing recommendations and ensuring optimal team structure...';
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
      content: 'Analyzing your project requirements and generating optimal team recommendations...',
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL || '';
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
                    ) : msg.pricingData && msg.pricingData.length > 0 ? (
                      renderPricingResult(msg.pricingData)
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
