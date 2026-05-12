import React from 'react';
import { Avatar, Tooltip } from 'antd';
import { CalendarOutlined, EyeOutlined, SendOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { MatchingResource } from 'src/services/ai';
import { RESOURCE_STATUS } from 'src/utils/enum';
import styles from './ResourceCard.module.scss';

interface ResourceCardProps {
  resource: MatchingResource;
  onScheduleInterview: (resourceId: string) => void;
  onViewTimesheet: (resourceId: string) => void;
  onSendInquiry: (resourceId: string) => void;
  onViewDetails: (resourceId: string) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onScheduleInterview,
  onViewTimesheet,
  onSendInquiry,
  onViewDetails,
}) => {
  const { t } = useTranslation();
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

  return (
    <div className={styles.resourceCard}>
      <div className={styles.header}>
        <div className={styles.profileSection}>
          <Avatar
            src={resource?.profilePicture}
            size={48}
            className={styles.avatar}
          >
            {resource?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <div className={styles.info}>
            <h4 className={styles.name}>{resource?.fullName || 'Unknown'}</h4>
            <p className={styles.title}>{resource?.title || 'N/A'}</p>
          </div>
        </div>
        <div className={styles.badges}>
          <div 
            className={styles.matchScore}
            style={{ backgroundColor: getMatchScoreColor(resource?.matchScore ?? 0) }}
          >
            {resource?.matchScore ?? 0}% Match
          </div>
          <div
            className={styles.availability}
            style={{ borderColor: getAvailabilityColor(resource?.availableStatus ?? 'unavailable') }}
          >
            {resource?.availableStatus || 'N/A'}
          </div>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.experience}>
          <span className={styles.label}>Experience:</span>
          <span className={styles.value}>{resource?.yearsOfExperience ?? 0} years</span>
        </div>
        
        <div className={styles.skills}>
          <span className={styles.label}>Skills:</span>
          <div className={styles.skillsList}>
            {resource?.skills && resource.skills.length > 0 ? (
              resource.skills.map((skill, idx) => (
                <span key={idx} className={styles.skillTag}>
                  {skill}
                </span>
              ))
            ) : (
              <span>{t('resourceCard.noSkills')}</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Tooltip title={t('resourceCard.scheduleInterview')} placement="top">
          <button
            onClick={() => {
              console.log('Schedule Interview clicked for resource:', resource?.id);
              resource?.id && onScheduleInterview(resource.id);
            }}
            className={`${styles.iconBtn} ${styles.primary}`}
            disabled={!resource?.id}
            aria-label="Schedule Interview"
          >
            <CalendarOutlined />
          </button>
        </Tooltip>
        <Tooltip title={t('resourceCard.viewDetails')} placement="top">
          <button
            onClick={() => {
              console.log('View Details clicked for resource:', resource?.id);
              resource?.id && onViewDetails(resource.id);
            }}
            className={styles.iconBtn}
            disabled={!resource?.id}
            aria-label="View Details"
          >
            <EyeOutlined />
          </button>
        </Tooltip>
        <Tooltip title={t('resourceCard.sendInquiry')} placement="top">
          <button
            onClick={() => {
              console.log('Send Inquiry clicked for resource:', resource?.id);
              resource?.id && onSendInquiry(resource.id);
            }}
            className={styles.iconBtn}
            disabled={!resource?.id}
            aria-label="Send Inquiry"
          >
            <SendOutlined />
          </button>
        </Tooltip>
        <Tooltip title={t('resourceCard.viewTimesheet')} placement="top">
          <button
            onClick={() => {
              console.log('View Timesheet clicked for resource:', resource?.id);
              resource?.id && onViewTimesheet(resource.id);
            }}
            className={styles.iconBtn}
            disabled={!resource?.id}
            aria-label="View Timesheet"
          >
            <ClockCircleOutlined />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
