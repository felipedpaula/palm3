import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './assets/pages/Home/Home';
import NovoAmistoso from './assets/pages/NovoAmistoso/NovoAmistoso';
import './App.css';
import IncluirJogadores from './assets/pages/NovoAmistoso/IncluirJogadores';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/novo-amistoso" element={<NovoAmistoso />} />
        <Route path="/novo-amistoso/incluir-jogadores" element={<IncluirJogadores />} />
      </Routes>
  );
}

export default App;
