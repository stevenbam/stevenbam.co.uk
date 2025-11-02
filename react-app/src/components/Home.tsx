import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #6b46c1 0%, #4338ca 25%, #1e1b4b 75%, #000000 100%);
  min-height: 100vh;
  color: #e2e8f0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
`;

const WelcomeSection = styled.section`
  background: rgba(255, 255, 255, 0.05);
  padding: 3rem;
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(10px);
  margin-bottom: 3rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 3.5rem;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const WelcomeSubtitle = styled.h2`
  font-size: 1.5rem;
  color: #a78bfa;
  margin-bottom: 2rem;
  font-weight: 300;
`;

const WelcomeDescription = styled.p`
  font-size: 1.2rem;
  color: #cbd5e1;
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto 2rem auto;
`;

const NavigationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const NavCard = styled(Link)`
  background: rgba(0, 0, 0, 0.3);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  
  &:hover {
    transform: translateY(-5px);
    border-color: #8b5cf6;
    box-shadow: 0 15px 35px rgba(139, 92, 246, 0.3);
  }
`;

const CardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  color: #a78bfa;
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;

const CardDescription = styled.p`
  color: #cbd5e1;
  line-height: 1.6;
`;

const TechHighlight = styled.span`
  color: #8b5cf6;
  font-weight: 600;
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <WelcomeSection>
        <WelcomeTitle>Welcome to My Home on the Web 🚀</WelcomeTitle>
        <WelcomeSubtitle>Steven J Martin - Full Stack Developer</WelcomeSubtitle>
        <WelcomeDescription>
          Step into my world of <TechHighlight>code</TechHighlight>, <TechHighlight>creativity</TechHighlight>, and <TechHighlight>innovation</TechHighlight>. 
          With over 35 years in software development, I'm passionate about building amazing digital experiences 
          and sharing my journey through technology, music, and life.
        </WelcomeDescription>
      </WelcomeSection>

      <NavigationGrid>
        <NavCard to="/work-experience">
          <CardIcon>💼</CardIcon>
          <CardTitle>Work Experience</CardTitle>
          <CardDescription>
            Discover my professional journey through decades of software development, 
            from startups to enterprise solutions.
          </CardDescription>
        </NavCard>

        <NavCard to="/hobbies">
          <CardIcon>🎵</CardIcon>
          <CardTitle>My Hobbies</CardTitle>
          <CardDescription>
            Explore my passions beyond coding - drumming, painting, and running 
            that keep my creative spirit alive.
          </CardDescription>
        </NavCard>

        <NavCard to="/blog">
          <CardIcon>📝</CardIcon>
          <CardTitle>Tech Blog</CardTitle>
          <CardDescription>
            Read my thoughts on technology trends, development insights, 
            and lessons learned from the software engineering world.
          </CardDescription>
        </NavCard>

        <NavCard to="/photos">
          <CardIcon>📸</CardIcon>
          <CardTitle>Photo Gallery</CardTitle>
          <CardDescription>
            Browse through my collection of moments captured - from tech conferences 
            to personal adventures and everything in between.
          </CardDescription>
        </NavCard>

        <NavCard to="/contact">
          <CardIcon>📬</CardIcon>
          <CardTitle>Get In Touch</CardTitle>
          <CardDescription>
            Have a project idea? Want to collaborate? Or just want to say hello? 
            I'd love to hear from you!
          </CardDescription>
        </NavCard>
      </NavigationGrid>
    </HomeContainer>
  );
};

export default Home;