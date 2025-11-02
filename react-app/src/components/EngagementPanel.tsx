import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { commentsApi, reactionsApi, Comment, Reaction, AVAILABLE_REACTIONS } from '../services/api';

interface EngagementPanelProps {
  contentType: 'blog' | 'photo';
  contentId: number;
  initialMode?: 'reactions' | 'comments';
}

const bounce = keyframes`
  0%, 20%, 60%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  80% { transform: translateY(-5px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PanelContainer = styled.div`
  margin-top: 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  backdrop-filter: blur(5px);
  overflow: hidden;
`;

const TabBar = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
`;

const Tab = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 1rem;
  background: ${props => props.$isActive 
    ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))'
    : 'transparent'};
  border: none;
  color: ${props => props.$isActive ? '#ffffff' : '#94a3b8'};
  font-weight: ${props => props.$isActive ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(139, 92, 246, 0.1);
    color: #a78bfa;
  }
  
  ${props => props.$isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #8b5cf6, #7c3aed);
    }
  `}
`;

const TabContent = styled.div`
  padding: 1.5rem;
  animation: ${slideIn} 0.3s ease;
`;

const ReactionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ReactionButton = styled.button<{ $isActive: boolean; $count: number }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${props => props.$isActive 
    ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.3), rgba(124, 58, 237, 0.2))'
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$isActive 
    ? 'rgba(139, 92, 246, 0.5)'
    : 'rgba(139, 92, 246, 0.2)'};
  border-radius: 25px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
    border-color: #8b5cf6;
  }
  
  &:active {
    animation: ${pulse} 0.3s ease;
  }
  
  ${props => props.$count > 0 && `
    animation: ${bounce} 0.6s ease;
  `}
`;

const ReactionEmoji = styled.span`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

const ReactionCount = styled.span<{ $isAnimating: boolean }>`
  font-weight: 600;
  min-width: 1.2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  ${props => props.$isAnimating && `
    animation: ${pulse} 0.4s ease;
  `}
`;

const QuickReactBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.1);
`;

const QuickReactButton = styled.button<{ $isActive: boolean }>`
  padding: 0.5rem;
  background: ${props => props.$isActive 
    ? 'rgba(139, 92, 246, 0.2)'
    : 'transparent'};
  border: 1px solid ${props => props.$isActive 
    ? 'rgba(139, 92, 246, 0.4)'
    : 'rgba(139, 92, 246, 0.1)'};
  border-radius: 8px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    background: rgba(139, 92, 246, 0.1);
  }
  
  &:active {
    animation: ${pulse} 0.2s ease;
  }
`;

const CommentForm = styled.form`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #a78bfa;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(139, 92, 246, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(139, 92, 246, 0.5);
    }
  }
`;

const CommentCard = styled.div<{ $isAuthor: boolean }>`
  padding: 1rem;
  background: ${props => props.$isAuthor 
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))'
    : 'rgba(255, 255, 255, 0.03)'};
  border-radius: 10px;
  border: 1px solid ${props => props.$isAuthor 
    ? 'rgba(139, 92, 246, 0.3)'
    : 'rgba(139, 92, 246, 0.1)'};
  animation: ${slideIn} 0.3s ease;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const AuthorName = styled.span`
  color: #a78bfa;
  font-weight: 600;
  font-size: 0.9rem;
`;

const CommentTime = styled.span`
  color: #94a3b8;
  font-size: 0.8rem;
  margin-left: auto;
`;

const CommentContent = styled.p`
  color: #cbd5e1;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
`;

const StatusMessage = styled.div<{ $type: 'success' | 'error' }>`
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  background: ${props => props.$type === 'success' 
    ? 'rgba(34, 197, 94, 0.1)' 
    : 'rgba(239, 68, 68, 0.1)'};
  border: 1px solid ${props => props.$type === 'success' 
    ? 'rgba(34, 197, 94, 0.3)' 
    : 'rgba(239, 68, 68, 0.3)'};
  color: ${props => props.$type === 'success' ? '#22c55e' : '#ef4444'};
`;

const EmptyState = styled.div`
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 2rem;
`;

const EngagementPanel: React.FC<EngagementPanelProps> = ({ 
  contentType, 
  contentId, 
  initialMode = 'reactions' 
}) => {
  const [activeTab, setActiveTab] = useState<'reactions' | 'comments'>(initialMode);
  const [reactions, setReactions] = useState<Reaction>({});
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [animatingReactions, setAnimatingReactions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: ''
  });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const isAuthor = (authorName: string) => 
    authorName.toLowerCase().includes('steven') || authorName.toLowerCase().includes('martin');

  useEffect(() => {
    loadReactions();
    loadUserReactions();
    if (activeTab === 'comments') {
      loadComments();
    }
  }, [contentType, contentId, activeTab]);

  const loadReactions = async () => {
    try {
      const fetchedReactions = await reactionsApi.getReactions(contentType, contentId);
      setReactions(fetchedReactions);
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const loadUserReactions = async () => {
    try {
      const fetchedUserReactions = await reactionsApi.getUserReactions(contentType, contentId);
      setUserReactions(fetchedUserReactions);
    } catch (error) {
      console.error('Error loading user reactions:', error);
    }
  };

  const loadComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await commentsApi.getComments(contentType, contentId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (emoji: string) => {
    try {
      const result = await reactionsApi.toggleReaction(contentType, contentId, emoji);
      
      // Animate the reaction
      setAnimatingReactions(prev => [...prev, emoji]);
      setTimeout(() => {
        setAnimatingReactions(prev => prev.filter(e => e !== emoji));
      }, 600);

      // Update local state
      if (result.action === 'added') {
        setUserReactions(prev => [...prev, emoji]);
        setReactions(prev => ({
          ...prev,
          [emoji]: (prev[emoji] || 0) + 1
        }));
      } else {
        setUserReactions(prev => prev.filter(r => r !== emoji));
        setReactions(prev => ({
          ...prev,
          [emoji]: Math.max((prev[emoji] || 1) - 1, 0)
        }));
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorName.trim() || !formData.content.trim()) return;

    try {
      setLoading(true);
      await commentsApi.createComment(
        contentType,
        contentId,
        formData.authorName.trim(),
        formData.content.trim(),
        formData.authorEmail.trim() || undefined
      );

      setFormData({ authorName: '', authorEmail: '', content: '' });
      setStatusMessage({
        type: 'success',
        text: 'Comment submitted! It will appear after approval.'
      });

      setTimeout(() => setStatusMessage(null), 5000);
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to submit comment. Please try again.'
      });
      console.error('Error submitting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);
  const totalComments = comments.length;

  return (
    <PanelContainer>
      <TabBar>
        <Tab 
          $isActive={activeTab === 'reactions'} 
          onClick={() => setActiveTab('reactions')}
        >
          React {totalReactions > 0 && `(${totalReactions})`}
        </Tab>
        <Tab 
          $isActive={activeTab === 'comments'} 
          onClick={() => setActiveTab('comments')}
        >
          Comment {totalComments > 0 && `(${totalComments})`}
        </Tab>
      </TabBar>

      <TabContent>
        {activeTab === 'reactions' ? (
          <>
            <QuickReactBar>
              {AVAILABLE_REACTIONS.slice(0, 5).map(emoji => (
                <QuickReactButton
                  key={emoji}
                  $isActive={userReactions.includes(emoji)}
                  onClick={() => handleReaction(emoji)}
                >
                  {emoji}
                </QuickReactButton>
              ))}
            </QuickReactBar>

            <ReactionsContainer>
              {AVAILABLE_REACTIONS.map(emoji => {
                const count = reactions[emoji] || 0;
                const isActive = userReactions.includes(emoji);
                const isAnimating = animatingReactions.includes(emoji);
                
                return (
                  <ReactionButton
                    key={emoji}
                    $isActive={isActive}
                    $count={count}
                    onClick={() => handleReaction(emoji)}
                  >
                    <ReactionEmoji>{emoji}</ReactionEmoji>
                    <ReactionCount $isAnimating={isAnimating}>
                      {count || ''}
                    </ReactionCount>
                  </ReactionButton>
                );
              })}
            </ReactionsContainer>
          </>
        ) : (
          <>
            <CommentForm onSubmit={handleCommentSubmit}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="authorName">Name *</Label>
                  <Input
                    type="text"
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="Your name"
                    required
                    disabled={loading}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="authorEmail">Email (optional)</Label>
                  <Input
                    type="email"
                    id="authorEmail"
                    value={formData.authorEmail}
                    onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label htmlFor="content">Comment *</Label>
                <TextArea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Share your thoughts..."
                  required
                  disabled={loading}
                />
              </FormGroup>

              {statusMessage && (
                <StatusMessage $type={statusMessage.type}>
                  {statusMessage.text}
                </StatusMessage>
              )}

              <SubmitButton type="submit" disabled={loading || !formData.authorName.trim() || !formData.content.trim()}>
                {loading ? 'Submitting...' : 'Post Comment'}
              </SubmitButton>
            </CommentForm>

            <CommentsList>
              {loading && comments.length === 0 ? (
                <EmptyState>Loading comments...</EmptyState>
              ) : comments.length === 0 ? (
                <EmptyState>No comments yet. Be the first to share your thoughts!</EmptyState>
              ) : (
                comments.map(comment => (
                  <CommentCard key={comment.id} $isAuthor={isAuthor(comment.authorName)}>
                    <CommentHeader>
                      <AuthorName>{comment.authorName}</AuthorName>
                      <CommentTime>{formatTimeAgo(comment.createdDate)}</CommentTime>
                    </CommentHeader>
                    <CommentContent>{comment.content}</CommentContent>
                  </CommentCard>
                ))
              )}
            </CommentsList>
          </>
        )}
      </TabContent>
    </PanelContainer>
  );
};

export default EngagementPanel;