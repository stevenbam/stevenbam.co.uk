import React, { useState } from 'react';
import styled from 'styled-components';

interface AdminProtectedProps {
  children: React.ReactNode;
  onAuthenticated: () => void;
  isAuthenticated: boolean;
}

const ProtectionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const PasswordCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(10px);
  width: 300px;
  text-align: center;
  color: #e2e8f0;
`;

const Title = styled.h3`
  color: #ffffff;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
`;

const Subtitle = styled.p`
  color: #a78bfa;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const PasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PasswordInput = styled.input`
  padding: 0.75rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 0.9rem;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SubmitButton = styled.button`
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  }
`;

const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(139, 92, 246, 0.3);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.8rem;
`;

const LockIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #a78bfa;
`;

const AdminProtected: React.FC<AdminProtectedProps> = ({ children, onAuthenticated, isAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const correctPassword = 'steven2024';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onAuthenticated();
      setShowModal(false);
      setError('');
      setPassword('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setPassword('');
    setError('');
  };

  const handleClick = () => {
    if (!isAuthenticated) {
      setShowModal(true);
    }
  };

  return (
    <>
      <div 
        onClick={handleClick} 
        onMouseDown={handleClick}
        style={{ 
          cursor: isAuthenticated ? 'default' : 'pointer',
          position: 'relative'
        }}
      >
        {children}
        {!isAuthenticated && (
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
              cursor: 'pointer'
            }}
            onClick={handleClick}
          />
        )}
      </div>
      
      {showModal && (
        <ProtectionOverlay>
          <PasswordCard>
            <LockIcon>🔒</LockIcon>
            <Title>Admin Access Required</Title>
            <Subtitle>This action requires admin privileges</Subtitle>
            
            <PasswordForm onSubmit={handleSubmit}>
              <PasswordInput
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
              <ButtonGroup>
                <SubmitButton type="submit">
                  Authenticate
                </SubmitButton>
                <CancelButton type="button" onClick={handleCancel}>
                  Cancel
                </CancelButton>
              </ButtonGroup>
            </PasswordForm>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </PasswordCard>
        </ProtectionOverlay>
      )}
    </>
  );
};

export default AdminProtected;