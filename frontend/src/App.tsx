import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Projects from './pages/Home';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Projects />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
