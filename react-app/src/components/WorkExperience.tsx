import React from 'react';
import styled from 'styled-components';

const WorkContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #6b46c1 0%, #4338ca 25%, #1e1b4b 75%, #000000 100%);
  min-height: 100vh;
  color: #e2e8f0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ProfileSection = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #8b5cf6;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  margin: 0 0 0.5rem 0;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
  font-size: 2.5rem;
`;

const Title = styled.p`
  font-style: italic;
  margin-bottom: 1rem;
  color: #c7d2fe;
  font-size: 1.1rem;
  
  a {
    color: #a78bfa;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      color: #c4b5fd;
    }
  }
`;

const Description = styled.p`
  line-height: 1.6;
  color: #cbd5e1;
`;

const Section = styled.section`
  margin-bottom: 2rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  backdrop-filter: blur(5px);
`;

const SectionTitle = styled.h3`
  color: #a78bfa;
  border-bottom: 2px solid #8b5cf6;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const WorkGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const WorkCard = styled.div`
  background: rgba(139, 92, 246, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
    border-color: #8b5cf6;
  }
`;

const WorkDates = styled.div`
  color: #a78bfa;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const WorkTitle = styled.h4`
  color: #ffffff;
  margin: 0;
  font-size: 1.1rem;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const SkillCard = styled.div`
  background: rgba(139, 92, 246, 0.1);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.2);
    border-color: #8b5cf6;
  }
`;

const SkillName = styled.span`
  color: #ffffff;
  font-weight: 500;
`;

const SkillRating = styled.span`
  color: #fbbf24;
  font-size: 1.1rem;
`;

const EducationList = styled.ul`
  list-style-type: disc;
  padding-left: 2rem;
  
  li {
    margin-bottom: 0.5rem;
    color: #cbd5e1;
  }
`;

const WorkExperience: React.FC = () => {
  return (
    <WorkContainer>
      <ProfileSection>
        <ProfileImage 
          src="/images/Steven-modified.png" 
          alt="Steven's profile picture"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x150/8b5cf6/ffffff?text=SJM';
          }}
        />
        <ProfileInfo>
          <Name>Steven J Martin</Name>
          <Title>
            <em>Lead Systems Developer at <strong>
              <a href="https://www.wjfg.co.uk/">William Jackson Food Group</a>
            </strong></em>
          </Title>
          <Description>
            I am a full stack developer with over thirty-five years of IT development. 
            I am a musician and avid runner.
          </Description>
        </ProfileInfo>
      </ProfileSection>

      <Section>
        <SectionTitle>Education</SectionTitle>
        <EducationList>
          <li>Ventura Junior College</li>
          <li>Coleman College</li>
        </EducationList>
      </Section>

      <Section>
        <SectionTitle>Work Experience</SectionTitle>
        <WorkGrid>
          <WorkCard>
            <WorkDates>2021 - Present</WorkDates>
            <WorkTitle>Lead Systems Developer at WJFG</WorkTitle>
          </WorkCard>
          <WorkCard>
            <WorkDates>2014 - 2021</WorkDates>
            <WorkTitle>Developer at Wellocks</WorkTitle>
          </WorkCard>
          <WorkCard>
            <WorkDates>2011 - 2014</WorkDates>
            <WorkTitle>Software Development Contractor in Leicester, UK</WorkTitle>
          </WorkCard>
          <WorkCard>
            <WorkDates>2001 - 2010</WorkDates>
            <WorkTitle>Developer at Performance Food Group(Vistar)</WorkTitle>
          </WorkCard>
          <WorkCard>
            <WorkDates>1999 - 2001</WorkDates>
            <WorkTitle>Vice President at AS400 Personnel Agency</WorkTitle>
          </WorkCard>
          <WorkCard>
            <WorkDates>1998 - 1999</WorkDates>
            <WorkTitle>Software Development Contractor in Denver, Colorado</WorkTitle>
          </WorkCard>
          <WorkCard>
            <WorkDates>1996 - 1998</WorkDates>
            <WorkTitle>Developer in Green Bay/Appleton</WorkTitle>
          </WorkCard>
          <WorkCard>
            <WorkDates>1994 - 1996</WorkDates>
            <WorkTitle>Developer at County of Imperial</WorkTitle>
          </WorkCard>
        </WorkGrid>
      </Section>

      <Section>
        <SectionTitle>Skills</SectionTitle>
        <SkillsGrid>
          <SkillCard>
            <SkillName>C#</SkillName>
            <SkillRating>⭐⭐⭐⭐</SkillRating>
          </SkillCard>
          <SkillCard>
            <SkillName>SQL</SkillName>
            <SkillRating>⭐⭐⭐⭐</SkillRating>
          </SkillCard>
          <SkillCard>
            <SkillName>HTML</SkillName>
            <SkillRating>⭐⭐</SkillRating>
          </SkillCard>
          <SkillCard>
            <SkillName>CSS</SkillName>
            <SkillRating>⭐</SkillRating>
          </SkillCard>
        </SkillsGrid>
      </Section>
    </WorkContainer>
  );
};

export default WorkExperience;