import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: linear-gradient(90deg, #1e1b4b 0%, #4338ca 50%, #6b46c1 100%);
  padding: 1rem 2rem;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(10px);
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #e2e8f0;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ffffff;
    background: rgba(139, 92, 246, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
  }
`;

const Logo = styled.h1`
  margin: 0;
  margin-right: auto;
  color: #ffffff;
  font-size: 1.5rem;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
`;

const PulsingBAM = styled.span`
  @keyframes heartbeat {
    0% {
      color: #991b1b;
      transform: scale(1);
      text-shadow: 0 0 5px rgba(153, 27, 27, 0.3);
    }
    25% {
      color: #dc2626;
      transform: scale(1.05);
      text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
    }
    50% {
      color: #ef4444;
      transform: scale(1.1);
      text-shadow: 0 0 15px rgba(239, 68, 68, 0.7);
    }
    75% {
      color: #f87171;
      transform: scale(1.05);
      text-shadow: 0 0 10px rgba(248, 113, 113, 0.5);
    }
    100% {
      color: #991b1b;
      transform: scale(1);
      text-shadow: 0 0 5px rgba(153, 27, 27, 0.3);
    }
  }
  
  animation: heartbeat 1.5s ease-in-out infinite;
  display: inline-block;
  font-weight: bold;
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Nav>
        <Logo>steven<PulsingBAM>BAM</PulsingBAM></Logo>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/work-experience">Work Experience</NavLink>
        <NavLink to="/hobbies">Hobbies</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/blog">Blog</NavLink>
        <NavLink to="/photos">Photos</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;