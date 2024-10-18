import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import Jogo from '../../../models/Jogo';
import { addJogo } from '../../../db/db';
import './IncluirJogadores.css'; 

const IncluirJogadores = () => {

    return (
        <>
            <Header/>
            
            <body>
                <div className='center'>
                    <div className='body-content card'>
                        <div className='topo-page'>
                            <strong># Novo Amistoso | Incluir Jogadores</strong>                        
                        </div>
                        <div className="area-novo-jogo">

                        </div>
                    </div>
                </div>
            </body>
        </>
    );
};

export default IncluirJogadores;
