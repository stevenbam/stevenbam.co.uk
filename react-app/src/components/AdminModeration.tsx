import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { commentsApi, reactionsApi, Comment } from '../services/api';
import AdminProtected from './AdminProtected';

const ModerationContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #6b46c1 0%, #4338ca 25%, #1e1b4b 75%, #000000 100%);
  min-height: 100vh;
  color: #e2e8f0;
`;

const ModerationHeader = styled.h1`
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  backdrop-filter: blur(5px);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #a78bfa;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
`;

const SectionContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  backdrop-filter: blur(5px);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: rgba(139, 92, 246, 0.1);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  display: flex;
  justify-content: between;
  align-items: center;
`;

const SectionTitle = styled.h2`
  color: #a78bfa;
  margin: 0;
  font-size: 1.3rem;
`;

const RefreshButton = styled.button`
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: auto;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  }
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const CommentCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const CommentMeta = styled.div`
  flex: 1;
`;

const AuthorInfo = styled.div`
  color: #a78bfa;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ContentInfo = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const CommentDate = styled.div`
  color: #64748b;
  font-size: 0.8rem;
`;

const CommentContent = styled.div`
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 1rem;
  white-space: pre-wrap;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid rgba(139, 92, 246, 0.3);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant: 'approve' | 'delete' }>`
  background: ${props => props.$variant === 'approve' 
    ? 'linear-gradient(90deg, #10b981, #059669)'
    : 'linear-gradient(90deg, #dc2626, #b91c1c)'};
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px ${props => props.$variant === 'approve' 
      ? 'rgba(16, 185, 129, 0.4)'
      : 'rgba(220, 38, 38, 0.4)'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 3rem;
`;

const ReactionsList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ReactionItem = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.1);
`;

const ReactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ReactionEmoji = styled.span`
  font-size: 1.5rem;
`;

const ReactionDetails = styled.div``;

const ReactionTitle = styled.div`
  color: #a78bfa;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ReactionMeta = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
`;

const ReactionCount = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 700;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  color: #a78bfa;
  padding: 2rem;
`;

const AdminModeration: React.FC = () => {
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [reactionSummary, setReactionSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated) {
      loadData();
    }
  }, [isAdminAuthenticated]);

  const loadData = async () => {
    await Promise.all([
      loadPendingComments(),
      loadReactionSummary()
    ]);
  };

  const loadPendingComments = async () => {
    try {
      setLoading(true);
      const comments = await commentsApi.getPendingComments();
      setPendingComments(comments);
    } catch (error) {
      console.error('Error loading pending comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReactionSummary = async () => {
    try {
      const summary = await reactionsApi.getReactionSummary();
      setReactionSummary(summary);
    } catch (error) {
      console.error('Error loading reaction summary:', error);
    }
  };

  const handleApproveComment = async (commentId: number) => {
    try {
      setActionLoading(commentId);
      await commentsApi.approveComment(commentId);
      setPendingComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error approving comment:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      setActionLoading(commentId);
      await commentsApi.deleteComment(commentId);
      setPendingComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const getReactionStats = () => {
    const totalReactions = reactionSummary.reduce((sum, item) => sum + item.Count, 0);
    const uniqueContent = new Set(reactionSummary.map(item => `${item.ContentType}-${item.ContentId}`)).size;
    const mostPopularReaction = reactionSummary.reduce((max, item) => 
      item.Count > (max.Count || 0) ? item : max, {} as any);

    return {
      totalReactions,
      uniqueContent,
      pendingComments: pendingComments.length,
      mostPopular: mostPopularReaction.ReactionType || 'None'
    };
  };

  const stats = getReactionStats();

  if (!isAdminAuthenticated) {
    return (
      <ModerationContainer>
        <ModerationHeader>Admin Moderation Panel</ModerationHeader>
        <AdminProtected 
          isAuthenticated={isAdminAuthenticated}
          onAuthenticated={() => setIsAdminAuthenticated(true)}
        >
          <SectionContainer>
            <SectionContent>
              <EmptyState>
                Click to authenticate and access the moderation panel
              </EmptyState>
            </SectionContent>
          </SectionContainer>
        </AdminProtected>
      </ModerationContainer>
    );
  }

  return (
    <ModerationContainer>
      <ModerationHeader>Admin Moderation Panel</ModerationHeader>
      
      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.pendingComments}</StatNumber>
          <StatLabel>Pending Comments</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.totalReactions}</StatNumber>
          <StatLabel>Total Reactions</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.uniqueContent}</StatNumber>
          <StatLabel>Content with Engagement</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.mostPopular}</StatNumber>
          <StatLabel>Most Popular Reaction</StatLabel>
        </StatCard>
      </StatsGrid>

      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Pending Comments ({pendingComments.length})</SectionTitle>
          <RefreshButton onClick={loadPendingComments} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </RefreshButton>
        </SectionHeader>
        <SectionContent>
          {loading && pendingComments.length === 0 ? (
            <LoadingSpinner>Loading pending comments...</LoadingSpinner>
          ) : pendingComments.length === 0 ? (
            <EmptyState>No pending comments to review</EmptyState>
          ) : (
            pendingComments.map(comment => (
              <CommentCard key={comment.id}>
                <CommentHeader>
                  <CommentMeta>
                    <AuthorInfo>{comment.authorName}</AuthorInfo>
                    <ContentInfo>
                      On: {comment.contentTitle || `Content #${comment.id}`}
                    </ContentInfo>
                    <CommentDate>{formatDate(comment.createdDate)}</CommentDate>
                  </CommentMeta>
                </CommentHeader>
                <CommentContent>{comment.content}</CommentContent>
                <ActionButtons>
                  <ActionButton
                    $variant="approve"
                    onClick={() => handleApproveComment(comment.id)}
                    disabled={actionLoading === comment.id}
                  >
                    {actionLoading === comment.id ? 'Processing...' : 'Approve'}
                  </ActionButton>
                  <ActionButton
                    $variant="delete"
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={actionLoading === comment.id}
                  >
                    {actionLoading === comment.id ? 'Processing...' : 'Delete'}
                  </ActionButton>
                </ActionButtons>
              </CommentCard>
            ))
          )}
        </SectionContent>
      </SectionContainer>

      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Reaction Analytics</SectionTitle>
          <RefreshButton onClick={loadReactionSummary}>
            Refresh
          </RefreshButton>
        </SectionHeader>
        <SectionContent>
          {reactionSummary.length === 0 ? (
            <EmptyState>No reactions yet</EmptyState>
          ) : (
            <ReactionsList>
              {reactionSummary.map((item, index) => (
                <ReactionItem key={index}>
                  <ReactionInfo>
                    <ReactionEmoji>{item.ReactionType}</ReactionEmoji>
                    <ReactionDetails>
                      <ReactionTitle>{item.ContentTitle || `${item.ContentType} #${item.ContentId}`}</ReactionTitle>
                      <ReactionMeta>{item.ContentType} content</ReactionMeta>
                    </ReactionDetails>
                  </ReactionInfo>
                  <ReactionCount>{item.Count}</ReactionCount>
                </ReactionItem>
              ))}
            </ReactionsList>
          )}
        </SectionContent>
      </SectionContainer>
    </ModerationContainer>
  );
};

export default AdminModeration;