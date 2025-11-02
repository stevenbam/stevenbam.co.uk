import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './components/Home';
import WorkExperience from './components/WorkExperience';
import Hobbies from './components/Hobbies';
import Contact from './components/Contact';
import Blog from './components/Blog';
import Photos from './components/Photos';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #6b46c1 0%, #4338ca 25%, #1e1b4b 75%, #000000 100%);
`;

const GlobalStyles = styled.div`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #6b46c1 0%, #4338ca 25%, #1e1b4b 75%, #000000 100%);
    min-height: 100vh;
  }
`;

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyles />
        <AppContainer>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work-experience" element={<WorkExperience />} />
            <Route path="/hobbies" element={<Hobbies />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/photos" element={<Photos />} />
          </Routes>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

export default App;
