import React, { useState } from 'react';
import { Avatar, Tooltip, Button } from 'antd';
import { EyeOutlined, StarOutlined, DownOutlined, UpOutlined, CaretRightOutlined, CaretDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ResourceWithPricing, ResourceProfile } from 'src/services/ai';
import { RESOURCE_STATUS } from 'src/utils/enum';
import { formatFullNameString } from 'src/utils/formatName';
import styles from './ResourceAccordion.module.scss';

// Union type to handle both resource types
type ResourceItem = ResourceWithPricing | ResourceProfile;

interface ResourceAccordionProps {
  resources: ResourceItem[];
  onViewDetails: (resourceId: string) => void;
  onBookmarkAll: (resourceIds: string[]) => void;
  roleSeniority: string; // To determine if we should hide "Junior" level
}

export const ResourceAccordion: React.FC<ResourceAccordionProps> = ({
  resources,
  onViewDetails,
  onBookmarkAll,
  roleSeniority
}) => {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (resourceId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
        console.log('Collapsed accordion:', resourceId);
      } else {
        newSet.add(resourceId);
        console.log('Expanded accordion:', resourceId);
      }
      console.log('Current expanded items:', Array.from(newSet));
      return newSet;
    });
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Orange
    return '#6b7280'; // Gray
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case RESOURCE_STATUS.AVAILABLE:
        return '#10b981';
      case 'partially available':
        return '#f59e0b';
      case RESOURCE_STATUS.BUSY:
      case RESOURCE_STATUS.VACATION:
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  // Helper function to normalize resource data
  const normalizeResource = (resource: ResourceItem): ResourceWithPricing => {
    // Check if it's ResourceProfile (with totalYearsOfExperience)
    if ('totalYearsOfExperience' in resource) {
      return {
        id: resource.id,
        fullName: resource.name, // Note: ResourceProfile uses 'name' not 'fullName'
        title: resource.title,
        skills: resource.skills ? resource.skills.split(',').map(s => s.trim()) : [], // Skills are comma-separated string
        yearsOfExperience: resource.totalYearsOfExperience, // Map totalYearsOfExperience to yearsOfExperience
        availableStatus: resource.availability || 'Available',
        matchScore: 0, // Not available in ResourceProfile, default to 0
        profilePicture: resource.profilePicture || undefined,
        hourlyRate: resource.hourlyRate,
        derivedLevel: resource.derivedLevel,
        profileSummary: resource.profileSummary
      };
    }
    
    // It's already ResourceWithPricing
    return resource;
  };

  const shouldHideJuniorLevel = (resource: ResourceItem) => {
    const normalizedResource = normalizeResource(resource);
    // Hide "Junior" if the role is Senior and resource level is Junior
    return roleSeniority?.toLowerCase() === 'senior' && 
           normalizedResource.derivedLevel?.toLowerCase() === 'junior';
  };

  const formatExperience = (resource: ResourceItem) => {
    const normalizedResource = normalizeResource(resource);
    const years = normalizedResource.yearsOfExperience;
    if (years === 0) return null; // Hide 0 experience
    return `${years} year${years !== 1 ? 's' : ''}`;
  };

  const handleBookmarkAll = () => {
    const resourceIds = resources.map(resource => resource.id).filter(Boolean);
    if (resourceIds.length > 0) {
      onBookmarkAll(resourceIds);
    }
  };

  if (!resources || resources.length === 0) {
    return (
      <div className={styles.noResources}>
        {t('aiChatbot.noMatchedResources')}
      </div>
    );
  }

  return (
    <div className={styles.accordionContainer}>
      {/* Favourite All Resources Button */}
      <div className={styles.bookmarkAllSection}>
        <Button
          type="primary"
          icon={<StarOutlined />}
          onClick={handleBookmarkAll}
          className={styles.bookmarkAllBtn}
          size="small"
        >
          Favourite Resources ({resources.length})
        </Button>
      </div>
      {resources.map((resource) => {
        const isExpanded = expandedItems.has(resource.id);
        const normalizedResource = normalizeResource(resource);
        const experienceText = formatExperience(resource);
        const hideJuniorLevel = shouldHideJuniorLevel(resource);
        
        return (
          <div key={resource.id} className={styles.accordionItem}>
            <div 
              className={styles.accordionHeader}
              onClick={() => toggleExpanded(resource.id)}
            >
              <div className={styles.resourceInfo}>
                <div className={styles.profileSection}>
                   <Avatar
                    src={normalizedResource.profilePicture}
                    size={40}
                    className={styles.avatar}
                  >
                    {normalizedResource.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <div className={styles.info}>
                    <h4 className={styles.name}>{formatFullNameString(normalizedResource.fullName) || 'Unknown'}</h4>
                    <p className={styles.title}>{normalizedResource.title || 'N/A'}</p>
                    {experienceText && (
                      <p className={styles.experience}>{experienceText}</p>
                    )}
                  </div>
                </div>
                
                <div className={styles.badges}>
                  <div 
                    className={styles.matchScore}
                    style={{ backgroundColor: getMatchScoreColor(normalizedResource.matchScore ?? 0) }}
                  >
                    {normalizedResource.matchScore ?? 0}% Match
                  </div>
                  <div
                    className={styles.availability}
                    style={{ borderColor: getAvailabilityColor(normalizedResource.availableStatus ?? 'unavailable') }}
                  >
                    {normalizedResource.availableStatus || 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className={styles.expandIcon}>
                {isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
              </div>
            </div>

            {isExpanded && (
              <div className={styles.accordionContent}>
                <div className={styles.skillsSection}>
                  <span className={styles.label}>Skills:</span>
                  <div className={styles.skillsList}>
                    {normalizedResource.skills && normalizedResource.skills.length > 0 ? (
                      normalizedResource.skills.map((skill, idx) => (
                        <span key={idx} className={styles.skillTag}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className={styles.noSkills}>{t('resourceCard.noSkills')}</span>
                    )}
                  </div>
                </div>

                {normalizedResource.profileSummary && (
                  <div className={styles.summarySection}>
                    <span className={styles.label}>Summary:</span>
                    <p className={styles.summary}>{normalizedResource.profileSummary}</p>
                  </div>
                )}

                <div className={styles.actions}>
                  <Tooltip title={t('resourceCard.viewDetails')} placement="top">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resource.id && onViewDetails(resource.id);
                      }}
                      className={`${styles.actionBtn} ${styles.primary}`}
                      disabled={!resource.id}
                      aria-label="View Details"
                    >
                      <EyeOutlined />
                      View Details
                    </button>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
