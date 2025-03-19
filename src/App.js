import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/students" element={<Students />} />
    </Routes>
  );
}

export default App;