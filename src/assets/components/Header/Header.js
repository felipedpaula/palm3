import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 

export const Header = () => {

  // Obter a data de hoje no formato dd/mm/aa
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  return (
    <header>
      <div className="center">
        <div className="topo card">
          <div className="logo">
            <h1>Palm3</h1> {/* Logo ou título do app */}
          </div>
          <div className="date-to-day">
            {today}
          </div>
          <nav>
            <ul className="nav-links">
              <li>
                <Link className='btn-default' to="/">Início</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};