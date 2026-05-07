import React from 'react';
import { Avatar } from 'antd';
import { MatchingResource } from 'src/services/ai';
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
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Orange
    return '#6b7280'; // Gray
  };

  const getAvailabilityColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return '#10b981';
      case 'partially available':
        return '#f59e0b';
      case 'unavailable':
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
            src={resource.profilePicture}
            size={48}
            className={styles.avatar}
          >
            {resource.fullName.charAt(0).toUpperCase()}
          </Avatar>
          <div className={styles.info}>
            <h4 className={styles.name}>{resource.fullName}</h4>
            <p className={styles.title}>{resource.title}</p>
          </div>
        </div>
        <div className={styles.badges}>
          <div 
            className={styles.matchScore}
            style={{ backgroundColor: getMatchScoreColor(resource.matchScore) }}
          >
            {resource.matchScore}% Match
          </div>
          <div
            className={styles.availability}
            style={{ borderColor: getAvailabilityColor(resource.availableStatus) }}
          >
            {resource.availableStatus}
          </div>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.experience}>
          <span className={styles.label}>Experience:</span>
          <span className={styles.value}>{resource.yearsOfExperience} years</span>
        </div>
        
        <div className={styles.skills}>
          <span className={styles.label}>Skills:</span>
          <div className={styles.skillsList}>
            {resource.skills.slice(0, 5).map((skill, idx) => (
              <span key={idx} className={styles.skillTag}>
                {skill}
              </span>
            ))}
            {resource.skills.length > 5 && (
              <span className={styles.skillTag}>+{resource.skills.length - 5} more</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => onScheduleInterview(resource.id)}
          className={`${styles.actionBtn} ${styles.primary}`}
        >
          Schedule Interview
        </button>
        <button
          onClick={() => onViewDetails(resource.id)}
          className={`${styles.actionBtn} ${styles.secondary}`}
        >
          View Details
        </button>
        <button
          onClick={() => onSendInquiry(resource.id)}
          className={`${styles.actionBtn} ${styles.secondary}`}
        >
          Send Inquiry
        </button>
        <button
          onClick={() => onViewTimesheet(resource.id)}
          className={`${styles.actionBtn} ${styles.secondary}`}
        >
          View Timesheet
        </button>
      </div>
    </div>
  );
};
