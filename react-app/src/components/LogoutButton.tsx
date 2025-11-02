import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

interface LogoutButtonProps {
  section: string;
}

const LogoutBtn = styled.button`
  position: fixed;
  top: 100px;
  right: 2rem;
  background: linear-gradient(90deg, #dc2626, #b91c1c);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LogoutButton: React.FC<LogoutButtonProps> = ({ section }) => {
  const { logout } = useAuth();

  return (
    <LogoutBtn onClick={() => logout(section)}>
      🔒 Logout
    </LogoutBtn>
  );
};

export default LogoutButton;