import React, { useState } from 'react';
import styled from 'styled-components';

interface PasswordProtectedProps {
  children: React.ReactNode;
  title: string;
}

const ProtectionContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #6b46c1 0%, #4338ca 25%, #1e1b4b 75%, #000000 100%);
  min-height: 100vh;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PasswordCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 3rem;
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(10px);
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  color: #ffffff;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
`;

const Subtitle = styled.p`
  color: #a78bfa;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const PasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PasswordInput = styled.input`
  padding: 1rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  text-align: center;
  margin-top: 1rem;
  font-weight: 500;
`;

const LockIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #a78bfa;
`;

const PasswordProtected: React.FC<PasswordProtectedProps> = ({ children, title }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if already authenticated in this session
    return sessionStorage.getItem(`auth_${title.toLowerCase()}`) === 'true';
  });
  const [error, setError] = useState('');

  const correctPassword = 'steven2024'; // You can change this password

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem(`auth_${title.toLowerCase()}`, 'true');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <ProtectionContainer>
      <PasswordCard>
        <LockIcon>🔒</LockIcon>
        <Title>{title}</Title>
        <Subtitle>This section is password protected</Subtitle>
        
        <PasswordForm onSubmit={handleSubmit}>
          <PasswordInput
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <SubmitButton type="submit">
            Access {title}
          </SubmitButton>
        </PasswordForm>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </PasswordCard>
    </ProtectionContainer>
  );
};

export default PasswordProtected;