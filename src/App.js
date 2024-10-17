import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './assets/pages/Home/Home';
import NovoAmistoso from './assets/pages/NovoAmistoso/NovoAmistoso';
import './App.css';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/novo-amistoso" element={<NovoAmistoso />} />
        NovoAmistoso
      </Routes>
  );
}

export default App;
