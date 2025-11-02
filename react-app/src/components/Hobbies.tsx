import React from 'react';
import styled from 'styled-components';

const HobbiesContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #6b46c1 0%, #4338ca 25%, #1e1b4b 75%, #000000 100%);
  min-height: 100vh;
  color: #e2e8f0;
`;

const HobbiesHeader = styled.h1`
  color: #ffffff;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
`;

const HobbiesList = styled.ol`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(10px);
  font-size: 1.2rem;
  
  li {
    margin-bottom: 1rem;
    color: #cbd5e1;
    padding: 1rem;
    background: rgba(139, 92, 246, 0.1);
    border-radius: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(139, 92, 246, 0.2);
      transform: translateX(10px);
    }
    
    a {
      color: #a78bfa;
      text-decoration: none;
      font-weight: 600;
      
      &:hover {
        color: #c4b5fd;
        text-decoration: underline;
      }
    }
  }
`;

const Hobbies: React.FC = () => {
  return (
    <HobbiesContainer>
      <HobbiesHeader>My Hobbies</HobbiesHeader>
      <HobbiesList>
        <li>
          <a href="https://www.youtube.com/watch?v=XeVLe4dX9V8&t=1s&ab_channel=Drumeo" target="_blank" rel="noopener noreferrer">
            Drums
          </a>
        </li>
        <li>Painting</li>
        <li>
          <a href="https://www.facebook.com/stevenbam0" target="_blank" rel="noopener noreferrer">
            Running
          </a>
        </li>
      </HobbiesList>
    </HobbiesContainer>
  );
};

export default Hobbies;