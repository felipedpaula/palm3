import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import Cronometro from '../../components/Cronometro/Cronometro';
import { getDadosJogo, getJogadores } from '../../../db/db';
import './JogoEmAndamento.css'; 
import TimesEmCampo from '../../components/TimesEmCampo/TimesEmCampo';

const JogoEmAndamento = () => {

    const [jogo, setJogo] = useState([]);
    const [jogadores, setJogadores] = useState([]);

    useEffect(() => {
        const fetchJogo = async () => {
            try {
                const dadosJogo = await getDadosJogo();
                if (dadosJogo.length > 0) {
                    setJogo(dadosJogo[0]); // Como sempre será 1 jogo, pegamos o primeiro (ou único)
                } else {
                    console.log('Nenhum jogo encontrado.');
                }
            } catch (error) {
                console.error('Erro ao recuperar o jogo:', error);
            }
        };    
        const fetchJogadores = async () => {
            const jogadoresDB = await getJogadores();
            if (jogadoresDB.length > 0) {
                setJogadores(jogadoresDB);
            }
        };
        fetchJogo();
        fetchJogadores();
    }, []);

    return (
        <>
            <Header/>
            
            <div className='body'>
                <div className='center'>
                    <div className='body-content card'>
                        <div className='topo-page'>
                            <strong># Amistoso | {jogo.nome}</strong>                        
                        </div>

                        <div className="area-jogo">
                            <Cronometro/>
                            <TimesEmCampo/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JogoEmAndamento;
