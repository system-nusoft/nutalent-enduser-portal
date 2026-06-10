import React from 'react';
import { DeleteOutlined, MessageOutlined, PlusOutlined } from '@ant-design/icons';
import { ConversationListItem } from 'src/services/ai';
import styles from './ConversationHistory.module.scss';

interface ConversationHistoryProps {
  conversations: ConversationListItem[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
  loading?: boolean;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  loading = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={styles.conversationHistory}>
      <div className={styles.header}>
        <h3 className={styles.title}>Chat History</h3>
        <button 
          className={styles.newChatBtn}
          onClick={onNewConversation}
          title="New Conversation"
        >
          <PlusOutlined />
        </button>
      </div>

      <div className={styles.conversationList}>
        {loading ? (
          <div className={styles.loading}>Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className={styles.empty}>
            <MessageOutlined className={styles.emptyIcon} />
            <p>No conversations yet</p>
            <p className={styles.emptyHint}>Start a new chat to begin</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`${styles.conversationItem} ${
                selectedConversationId === conversation.id ? styles.active : ''
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className={styles.conversationContent}>
                <h4 className={styles.conversationTitle}>{conversation.title}</h4>
                <p className={styles.lastMessage}>{conversation.lastMessage}</p>
                <span className={styles.timestamp}>{formatDate(conversation.updatedAt)}</span>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conversation.id);
                }}
                title="Delete conversation"
              >
                <DeleteOutlined />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
