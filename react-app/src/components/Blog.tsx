import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { blogApi, BlogPost } from '../services/api';
import AdminProtected from './AdminProtected';

const BlogContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #6b46c1 0%, #4338ca 25%, #1e1b4b 75%, #000000 100%);
  min-height: 100vh;
  color: #e2e8f0;
`;

const BlogHeader = styled.h1`
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
`;

const CreatePostSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(10px);
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #a78bfa;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
  color: #ffffff;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }
`;

const PostsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PostCard = styled.article`
  background: rgba(0, 0, 0, 0.2);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  backdrop-filter: blur(5px);
`;

const PostTitle = styled.h2`
  color: #a78bfa;
  margin-bottom: 0.5rem;
`;

const PostMeta = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PostContent = styled.p`
  color: #cbd5e1;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const DeleteButton = styled.button`
  background: linear-gradient(90deg, #dc2626, #b91c1c);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
  }
`;

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await blogApi.getAll();
      setPosts(fetchedPosts);
    } catch (err) {
      setError('Failed to load blog posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.title.trim() && newPost.content.trim()) {
      try {
        setLoading(true);
        await blogApi.create({
          title: newPost.title,
          content: newPost.content,
          author: 'Steven J Martin'
        });
        setNewPost({ title: '', content: '' });
        await loadPosts(); // Refresh the list
      } catch (err) {
        setError('Failed to create blog post');
        console.error('Error creating post:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const deletePost = async (id: number) => {
    try {
      setLoading(true);
      await blogApi.delete(id);
      await loadPosts(); // Refresh the list
    } catch (err) {
      setError('Failed to delete blog post');
      console.error('Error deleting post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlogContainer>
      <BlogHeader>My Tech Blog</BlogHeader>
      
      <CreatePostSection>
        <h3 style={{ color: '#a78bfa', marginBottom: '1rem' }}>Create New Post</h3>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Post Title:</Label>
            <AdminProtected 
              isAuthenticated={isAdminAuthenticated}
              onAuthenticated={() => setIsAdminAuthenticated(true)}
            >
              <Input
                type="text"
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Enter post title"
                required
                disabled={!isAdminAuthenticated}
              />
            </AdminProtected>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="content">Post Content:</Label>
            <AdminProtected 
              isAuthenticated={isAdminAuthenticated}
              onAuthenticated={() => setIsAdminAuthenticated(true)}
            >
              <TextArea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Write your blog post content here..."
                required
                disabled={!isAdminAuthenticated}
              />
            </AdminProtected>
          </FormGroup>
          
          <AdminProtected 
            isAuthenticated={isAdminAuthenticated}
            onAuthenticated={() => setIsAdminAuthenticated(true)}
          >
            <Button type="submit" disabled={loading || !isAdminAuthenticated}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </Button>
          </AdminProtected>
        </form>
      </CreatePostSection>

      {error && (
        <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <PostsContainer>
        {loading && posts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
            Loading blog posts...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
            No blog posts yet. Create your first post above!
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post.id}>
              <PostTitle>{post.title}</PostTitle>
              <PostMeta>
                By {post.author} on {new Date(post.createdDate).toLocaleDateString()}
              </PostMeta>
              <PostContent>{post.content}</PostContent>
              <AdminProtected 
                isAuthenticated={isAdminAuthenticated}
                onAuthenticated={() => setIsAdminAuthenticated(true)}
              >
                <DeleteButton 
                  onClick={() => deletePost(post.id)}
                  disabled={loading || !isAdminAuthenticated}
                >
                  {loading ? 'Deleting...' : 'Delete Post'}
                </DeleteButton>
              </AdminProtected>
            </PostCard>
          ))
        )}
      </PostsContainer>
    </BlogContainer>
  );
};

export default Blog;