import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { commentsApi, Comment } from '../services/api';

interface CommentsProps {
  contentType: 'blog' | 'photo';
  contentId: number;
  isCollapsed?: boolean;
}

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CommentsContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  backdrop-filter: blur(5px);
`;

const CommentsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  cursor: pointer;
  user-select: none;
`;

const CommentsTitle = styled.h3`
  color: #a78bfa;
  margin: 0;
  font-size: 1.2rem;
`;

const CommentCount = styled.span`
  color: #94a3b8;
  font-size: 0.9rem;
`;

const CollapseIcon = styled.span<{ $isCollapsed: boolean }>`
  color: #a78bfa;
  transition: transform 0.3s ease;
  transform: ${props => props.$isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'};
`;

const CommentsContent = styled.div<{ $isCollapsed: boolean }>`
  display: ${props => props.$isCollapsed ? 'none' : 'block'};
  animation: ${props => props.$isCollapsed ? 'none' : slideDown} 0.3s ease;
`;

const CommentForm = styled.form`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.1);
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
  min-height: 100px;
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

const CharacterCounter = styled.div<{ $isOverLimit: boolean }>`
  text-align: right;
  font-size: 0.8rem;
  color: ${props => props.$isOverLimit ? '#ef4444' : '#94a3b8'};
  margin-top: 0.25rem;
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
    transform: none;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  animation: ${slideDown} 0.3s ease;
  position: relative;
`;

const AuthorBadge = styled.span`
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
  color: #ffffff;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorName = styled.span`
  color: #a78bfa;
  font-weight: 600;
  font-size: 0.9rem;
`;

const CommentTime = styled.span`
  color: #94a3b8;
  font-size: 0.8rem;
`;

const CommentContent = styled.p`
  color: #cbd5e1;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
`;

const ReplyButton = styled.button`
  background: none;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #a78bfa;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 0.75rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(139, 92, 246, 0.1);
    border-color: #8b5cf6;
  }
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

const Comments: React.FC<CommentsProps> = ({ contentType, contentId, isCollapsed: initialCollapsed = false }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: ''
  });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const maxCharacters = 1000;
  const isOverLimit = formData.content.length > maxCharacters;
  const isAuthor = (authorName: string) => 
    authorName.toLowerCase().includes('steven') || authorName.toLowerCase().includes('martin');

  useEffect(() => {
    loadComments();
  }, [contentType, contentId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorName.trim() || !formData.content.trim() || isOverLimit) return;

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
        text: 'Comment submitted successfully! It will appear after approval.'
      });

      // Clear status message after 5 seconds
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
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <CommentsContainer>
      <CommentsHeader onClick={() => setIsCollapsed(!isCollapsed)}>
        <div>
          <CommentsTitle>Comments</CommentsTitle>
          <CommentCount>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</CommentCount>
        </div>
        <CollapseIcon $isCollapsed={isCollapsed}>▼</CollapseIcon>
      </CommentsHeader>

      <CommentsContent $isCollapsed={isCollapsed}>
        <CommentForm onSubmit={handleSubmit}>
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
            <CharacterCounter $isOverLimit={isOverLimit}>
              {formData.content.length}/{maxCharacters}
            </CharacterCounter>
          </FormGroup>

          {statusMessage && (
            <StatusMessage $type={statusMessage.type}>
              {statusMessage.text}
            </StatusMessage>
          )}

          <SubmitButton type="submit" disabled={loading || !formData.authorName.trim() || !formData.content.trim() || isOverLimit}>
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
                  <CommentAuthor>
                    <AuthorName>{comment.authorName}</AuthorName>
                    {isAuthor(comment.authorName) && <AuthorBadge>AUTHOR</AuthorBadge>}
                  </CommentAuthor>
                  <CommentTime>{formatTimeAgo(comment.createdDate)}</CommentTime>
                </CommentHeader>
                <CommentContent>{comment.content}</CommentContent>
                <ReplyButton>Reply</ReplyButton>
              </CommentCard>
            ))
          )}
        </CommentsList>
      </CommentsContent>
    </CommentsContainer>
  );
};

export default Comments;