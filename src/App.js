import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './assets/pages/Home/Home';
import NovoAmistoso from './assets/pages/NovoAmistoso/NovoAmistoso';
import IncluirJogadores from './assets/pages/NovoAmistoso/IncluirJogadores';
import PreJogo from './assets/pages/NovoAmistoso/PreJogo';
import JogoEmAndamento from './assets/pages/JogoEmAndamento/JogoEmAndamento';
import './App.css';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/novo-amistoso" element={<NovoAmistoso />} />
        <Route path="/novo-amistoso/incluir-jogadores" element={<IncluirJogadores />} />
        <Route path="/novo-amistoso/pre-jogo" element={<PreJogo />} />
        <Route path="/novo-amistoso/jogo-em-andamento" element={<JogoEmAndamento />} />
      </Routes>
  );
}

export default App;
